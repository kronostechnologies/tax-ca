# Phase 2 porting conventions (tax-ca TS → Kotlin Multiplatform)

Follow these recipes exactly. They were established by the walking skeleton
(`utils/math`, `DEFINED_BENEFIT`) and validated by the parity gate. When in doubt, look
at the existing files listed under "Reference examples".

## Layout

| Content | Location |
|---|---|
| Data + logic (idiomatic Kotlin) | `src/commonMain/kotlin/com/equisoft/taxca/<module>/<PascalCaseName>.kt` (module = `utils`, `misc`, `pension`, `taxes`, `investments`, `investments/resp`) |
| Ported jest specs | `src/commonTest/kotlin/com/equisoft/taxca/<module>/<Name>Test.kt` |
| JS compatibility facade | `src/jsMain/kotlin/<Module>Facade.kt` — **root package** (no `package` line) so exports are flat |

One commonMain file per legacy TS file. Keep the legacy `Sources`/`Revised` header
comment verbatim at the top of each ported data file.

## Common code (idiomatic Kotlin)

- Numbers are `Double`. Years, ages, month counts are `Int`.
- `interface Foo { UPPER: number }` + `const FOO: Foo = {...}` becomes
  `data class Foo(val upper: Double)` + `val Foo: Foo = Foo(upper = ...)` — camelCase
  properties, top-level `val` instance named like the TS const but PascalCase
  (`CPP` → `Cpp`, `TAX_BRACKETS` → `TaxBrackets`).
- Year-keyed tables `{ [K: number]: number }` become `Map<Int, Double>`.
- Tuple arrays `[number, number][]` become `List<Pair<Int, Double>>`.
- `ProvinceCode | FederalCode` becomes `com.equisoft.taxca.misc.Jurisdiction` (enum with
  `code`, `isProvince`, `Jurisdiction.fromCode(code)`). `ProvinceCode` alone: still
  `Jurisdiction`; validate with `require(j.isProvince)` only if the TS code did.
- The union `BASIC_PERSONAL_AMOUNT: number | { MIN, MAX }` becomes
  `data class BasicPersonalAmount(val min: Double, val max: Double, val isRange: Boolean)`
  — plain numbers use `min = max = value, isRange = false`.
- Dates are `kotlinx.datetime.LocalDate`. Use existing helpers in
  `com.equisoft.taxca.utils` (`getMonthsDiff`, `addYearsToDate`, `getAge`, `clamp`,
  `roundToPrecision`, `maxBy`). Functions that default to "today" take an explicit
  `today: LocalDate` parameter in common code (no clock access in commonMain); the JS
  facade supplies `now()`.
- **Never use `kotlin.math.round`** — JS `Math.round` rounds ties toward +Infinity.
  Always go through `roundToPrecision` (already JS-faithful) or `floor(x + 0.5)`.
- `Math.trunc(a / b)` on positives/negatives = Kotlin `Int` division (truncates toward
  zero) — a comment noting this is enough.
- Preserve computation order and rounding call sites exactly; the parity gate compares
  against the legacy JS build bit-for-bit.

## JS facade (compatibility layer)

Every legacy export (see `docs/kmp-migration/api-baseline.md` for the contract) gets a
facade declaration in the module's `<Module>Facade.kt`:

- File header: `@file:OptIn(ExperimentalJsExport::class)` and
  `@file:Suppress("ClassName", "PropertyName", "NON_EXPORTABLE_TYPE")` as needed.
- Import common declarations with aliases to avoid name clashes:
  `import com.equisoft.taxca.utils.clamp as commonClamp`.
- **Data objects** (the `DEFINED_BENEFIT` recipe): an `@JsExport` class with
  SCREAMING_CASE `val`s and `internal constructor`, plus a top-level `@JsExport val`:

  ```kotlin
  @JsExport
  class DefinedBenefitPensionPlan internal constructor(val MAX_CONTRIBUTION: Double)

  @JsExport
  val DEFINED_BENEFIT: DefinedBenefitPensionPlan =
      DefinedBenefitPensionPlan(MAX_CONTRIBUTION = DefinedBenefit.maxContribution)
  ```

  Nested TS objects become nested exported classes (each with its own exported class).
- **Function outputs** use exported classes (arrays: `Array<ExportedClass>`).
- **Structured function inputs** (e.g. `getTaxAmount(rates: Rate[], ...)`) must accept
  plain JS objects from consumers. Kotlin class property access is compiled/mangled, so
  inputs use `external interface` instead:

  ```kotlin
  external interface RateInput { val FROM: Double; val TO: Double; val RATE: Double }
  ```

  Convert to the common data class before delegating.
- **Year-keyed tables and union-typed fields** are exported as `dynamic`, built with the
  helpers in `src/jsMain/kotlin/JsInterop.kt` (`yearMapToJsObject`, `pairsToJsArray`,
  `basicPersonalAmountToJs`). Their precise TS types come later from the hand-written
  d.ts overlay (Phase 3) — runtime shape must match the legacy build exactly.
- **JS `Date` parameters**: take `kotlin.js.Date`, convert with `toLocalDateUtc()` from
  `com.equisoft.taxca.interop`; optional date params default to `now()`.
- Enum-typed params: accept `String`, convert with `Jurisdiction.fromCode(code)`.
- Deprecated legacy aliases (e.g. `INTL_DEVELOPED_MARKET_EQUITIES`) must still be
  exported, pointing at the same value.

## Tests

- Port every `describe`/`it` case; `it.each` tables become a `List` of cases iterated
  with `assertEquals(expected, actual, "label")` (see `MathTest.kt`, `DateTest.kt`).
- Tests live in commonTest (run on JVM and JS). Only use jvmTest/jsTest for
  platform-specific behavior.
- Specs that rely on the legacy `now()` test clock (2020-01-01T12:00:00Z under
  NODE_ENV=test) pass `LocalDate(2020, 1, 1)` explicitly as `today`.

## Verification

Run `./gradlew build` (compiles all targets + runs commonTest on JVM and Node). If a
concurrent Gradle build holds the lock, it waits — that's fine. Do not modify
`build.gradle.kts`, `gradle.properties`, existing skeleton files, or the legacy `src/**/*.ts`.

## Reference examples

- Data module: `src/commonMain/.../pension/DefinedBenefitPensionPlan.kt` + its facade in `src/jsMain/kotlin/TaxCa.kt`
- Logic + types: `src/commonMain/.../pension/PublicPensionPlan.kt`
- Date boundary: `src/jsMain/kotlin/UtilsFacade.kt`, `src/jsMain/kotlin/DateInterop.kt`
- Tests: `src/commonTest/.../utils/MathTest.kt`, `DateTest.kt`
