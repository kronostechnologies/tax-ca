# Source layout

One Kotlin Multiplatform code base produces both published artifacts (npm
`@equisoft/tax-ca`, Maven `com.equisoft:tax-ca`).

| Source set | Role |
|---|---|
| `commonMain` | **The single source of truth** — all tax data and calculation logic, idiomatic Kotlin (camelCase data classes, `Double` numbers, `kotlinx-datetime` dates). Compiles to both targets. |
| `commonTest` | The test suite (ported from the legacy jest specs, 1:1). Runs on **both** JVM and Node — platform math drift fails the build. |
| `jsMain` | The npm compatibility facade: re-exposes everything with the legacy TypeScript package's exact names, shapes, and runtime semantics. See [jsMain/README.md](jsMain/README.md). |
| `jvmMain` | The JVM boundary layer: `BigDecimal` views and `java.time` overloads for services like financial-api. See [jvmMain/README.md](jvmMain/README.md). |
| `jvmTest` | JVM-only tests (BigDecimal views, java.time overloads, BigDecimal-exact variants). |

## Conventions in commonMain

- **Numbers are `Double`** (`Int` for years/ages/counts). This is a deliberate decision,
  not an oversight — see [jvmMain/README.md](jvmMain/README.md) for the numeric policy.
- **Dates are `kotlinx.datetime.LocalDate`.** No wall-clock access in common code:
  functions that need "today" take it as a parameter (the JS facade supplies `now()`).
- **Never use `kotlin.math.round`** — JS `Math.round` rounds ties toward +Infinity;
  use `utils.roundToPrecision` (implemented as `floor(x + 0.5)`, JS-faithful).
- Every data file keeps its `Sources` / `Revised` header comment — that is the audit
  trail for where values come from and when they were last checked.
- Some legacy quirks are preserved deliberately and commented in place (e.g. CPP rounds
  its average indexation rate to 3 digits but QPP to 2; JS `setUTCFullYear` overflows
  Feb 29 to Mar 1). Do not "fix" them without a ruling — numeric output is contractual.

## Yearly data revision workflow

1. Update the values in the relevant `commonMain` data file(s); refresh the
   `Sources` / `Revised` header.
2. Update the affected expectations in `commonTest`.
3. `./gradlew build` — all targets compile, tests pass on JVM and Node.
4. `yarn build && yarn compat` — the golden-corpus gate **fails on purpose** (values
   changed). Regenerate with `node ts-compat/deep-parity.cjs --record` and commit the
   `ts-compat/golden.json` diff: it shows reviewers exactly which values and computed
   results changed. See [../ts-compat/README.md](../ts-compat/README.md).
5. One release ships the new data to npm and Maven simultaneously (same version).
