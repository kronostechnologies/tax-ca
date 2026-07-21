# jvmMain — JVM boundary layer & the numeric policy

## Why common code uses `Double`, not `BigDecimal` (decision D2)

The historical package is JavaScript — its numbers **are** IEEE-754 doubles, and every
consumer computation ever shipped was double math. The npm artifact's contract is
bit-for-bit parity with that behavior (enforced by the golden corpus), so common code
stores `Double`. `java.math.BigDecimal` cannot exist in `commonMain` anyway (JVM-only),
and a multiplatform decimal type would turn every npm export from `number` into an
object, breaking the TypeScript API.

This is safe for this library's math: functions are short operation chains with
explicit rounding (`roundToPrecision`) at defined points — no accumulation, no equality
comparisons. The dangers of `Double` (compounding loops, ledger sums, `==`) belong to
*consumer* code, which is exactly what this layer protects:

## `toDecimal()` — the one conversion policy

```kotlin
import com.equisoft.taxca.jvm.toDecimal
Cpp.contributionRates.base.toDecimal()   // BigDecimal("0.0595") — exact decimal literal
```

`BigDecimal.valueOf` uses `Double.toString` (shortest-round-trip) semantics, so every
stored constant converts to its exact decimal literal, not binary noise. Keeping the
conversion here means all JVM consumers apply the same audited policy.

**Scale caveat:** `valueOf(0.007)` has scale 3, while a string-constructed
`BigDecimal("0.0070")` has scale 4. They are numerically equal (`compareTo == 0`) but
differ under `equals()`/`toString()`. Compare with `compareTo`, never `equals`.

## BigDecimal-exact variants

Functions whose JVM consumers are precision-sensitive get a dedicated BigDecimal
implementation here, kept bit-for-bit identical to the consumer's original arithmetic:

- `calculateCppContributionCoverageFactorDecimal(...)` — reproduces financial-api's
  scale-10 `HALF_UP` division pipeline exactly (verified `compareTo == 0` against their
  implementation). A `Double` variant exists in common code for other platforms; the
  two agree to 10 decimal places (asserted in `jvmTest`).

## java.time overloads

Common code uses `kotlinx-datetime`; this package provides `java.time.LocalDate`
overloads (lossless conversion) for every date-taking function consumed by JVM services
— `PublicPensionPlan.getRequestDateFactor`, the full `OldAgeSecurity` surface including
the max-bound `isRequestDateValid` (ported from financial-api; additive, not part of
the legacy npm API).

Full background: decision D2/D3 in
[../../docs/kmp-migration/phase-0-decisions.md](../../docs/kmp-migration/phase-0-decisions.md).
