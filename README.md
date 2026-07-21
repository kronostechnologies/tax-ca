# tax-ca

## Description

The `tax-ca` library contains up-to-date provincial and federal tax data and calculation functions.

We built it so that we would have a single source of truth for taxes data across all of our applications.

The library is implemented in **Kotlin Multiplatform**: a single code base (`src/commonMain`) holds all data and logic, and two artifacts are published from it —

| Ecosystem | Artifact | Consumers |
|---|---|---|
| npm | `@equisoft/tax-ca` | TypeScript/JavaScript applications (fna-engine, kronos-fna, ...) |
| Maven | `com.equisoft:tax-ca` | JVM/Kotlin services (financial-api, ...) |

Both artifacts share the same version number, so one yearly data revision reaches every consumer in a single release.

## Installation & usage — npm (TypeScript / JavaScript)

```
yarn add @equisoft/tax-ca
# or: npm install @equisoft/tax-ca --save
```

All modules are exported flat at the package root, with full TypeScript declarations:

```typescript
import { CPP, OAS, TAX_BRACKETS, getEffectiveRate, ProvinceCode } from '@equisoft/tax-ca';

console.log('OAS maximum age:', OAS.MAX_AGE); // 70
console.log('QC first bracket rate:', TAX_BRACKETS.QC.RATES[0].RATE);

const province: ProvinceCode = 'QC';
const rate = getEffectiveRate(province, 100_000, 0.02, 10);
```

The npm package is a drop-in continuation of the historical TypeScript library: the
export names, object shapes, function signatures, and numeric results are identical
(enforced by the compatibility gates in `ts-compat/` — see below).

## Installation & usage — Maven (Kotlin / JVM)

```kotlin
// build.gradle.kts
dependencies {
    implementation("com.equisoft:tax-ca:<version>")
}
```

The JVM API is idiomatic Kotlin — camelCase data classes in `com.equisoft.taxca.*`:

```kotlin
import com.equisoft.taxca.pension.Cpp
import com.equisoft.taxca.pension.Oas
import com.equisoft.taxca.taxes.TaxBrackets

println("OAS maximum age: ${Oas.maxAge}")            // 70
println("CPP base rate: ${Cpp.contributionRates.base}")
```

For services that work in `BigDecimal` and `java.time` (e.g. financial-api), the
`com.equisoft.taxca.jvm` package provides the boundary layer:

```kotlin
import com.equisoft.taxca.jvm.toDecimal
import com.equisoft.taxca.jvm.getRequestDateFactor
import java.time.LocalDate

// Exact decimal literals: BigDecimal("0.0595"), not binary noise
val baseRate = Cpp.contributionRates.base.toDecimal()

// java.time overloads for all date-taking functions
val factor = Cpp.getRequestDateFactor(LocalDate.of(1960, 1, 1), LocalDate.of(2026, 1, 1))
```

Numbers are stored as `Double` in common code (required for bit-for-bit parity with the
historical JavaScript package); `toDecimal()` converts with `BigDecimal.valueOf`
(string-round-trip) semantics so constants come back as exact decimal literals, and
functions with precision-sensitive arithmetic also ship a BigDecimal-exact JVM variant
(e.g. `calculateCppContributionCoverageFactorDecimal`).

> Registry note: Maven publishing activates once the `MAVEN_REPOSITORY_URL` repository
> variable and credentials are configured in CI. Until then,
> `./gradlew publishToMavenLocal -Papplication.version=<version>` publishes locally —
> see [docs/kmp-migration/testing-in-consumers.md](docs/kmp-migration/testing-in-consumers.md).

## Versions

The `major` portion of the library version is named according to the year of the dataset it contains. There could be breaking changes (such as modifications to the data structure) in both `major` and `minor` updates.

Updates at the `patch` level are reserved for bug fixes, non-breaking changes and minor improvements.

We suggest you lock the library dependency to the `minor` version and execute exhaustive testing before migrating to a new version to avoid unintentional regression. The npm and Maven artifacts of a given version are built from the same commit and always carry the same data.

## Modules

Data and functions live in `src/commonMain/kotlin/com/equisoft/taxca/`:

```
investments   LifeIncomeFund, LockedInRetirementAccount, NonRegisteredSavingsPlan,
              RegisteredRetirementIncomeFund, RegisteredRetirementSavingsPlan,
              TaxFreeSavingsAccount, resp/ (RESP grants: CESG, CLB, QESI, BCTESG...)
pension       CanadaPensionPlan, QuebecPensionPlan, OldAgeSecurity, PublicPensionPlan,
              DefinedBenefit/MoneyPurchase/Supplemental pension plans
taxes         IncomeTax (all federal/provincial brackets), DividendCredit,
              EmploymentInsurance, QuebecParentalInsurancePlan
misc          CodeTypes (jurisdictions), ConsumerPriceIndex, IpfStats, LifeExpectancy,
              PppIncreaseFactor
utils         date, math, collections helpers
```

Each data file keeps a `Sources` / `Revised` header documenting where the values come
from and when they were last updated.

## Development

This library is maintained by the _Equisoft/plan_ product team in Quebec City, QC, Canada.

We strongly value [inner source](https://en.wikipedia.org/wiki/Inner_source) practices within Equisoft and encourage contributors external to the FNA team to submit issues (including feature requests) and pull requests to the repository.

Build and test everything (JVM + JS targets):

```
./gradlew build          # compile all targets, run the test suite on JVM and Node
yarn build               # assemble the npm package into dist/
yarn compat              # npm compatibility gates (see below)
```

The npm compatibility gates in `ts-compat/` protect the JavaScript API against
regressions: a strict-TypeScript smoke test of the real consumers' import surface, and a
deep regression walker comparing every exported value and function result against the
committed golden corpus (`ts-compat/golden.json`, recorded from a build verified
bit-for-bit against the last legacy TypeScript build and against the real consumers).
A yearly data revision is EXPECTED to fail the walker - regenerate deliberately with
`node ts-compat/deep-parity.cjs --record` and review the golden.json diff, which lists
exactly which values changed. `dts/overlay.d.ts` carries the hand-maintained TypeScript
declarations; the build fails if a new export is left untyped.

Migration history, decisions, and consumer-validation instructions live in
[docs/kmp-migration/](docs/kmp-migration/).

## Release

Versions of this package are built by Github Actions.
All you need to do is create a new tag and release using the Github Interface. The
pipeline publishes the npm package and, once the registry is configured, the Maven
artifact from the same build.
