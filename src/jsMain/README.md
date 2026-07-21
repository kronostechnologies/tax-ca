# jsMain — the npm compatibility facade

This source set makes the Kotlin build a **drop-in continuation** of the historical
TypeScript package. Files here use the **root package** (no `package` declaration) so
exports land flat at the module root, matching
`import { CPP, getEffectiveRate } from '@equisoft/tax-ca'`.

The facade's shape was driven by testing against the real consumers (kronos-fna,
fna-engine) — their test suites revealed usage patterns that value-equality checks
cannot see. These are now hard rules:

## Rules (violations break real consumers)

1. **Exported data objects are plain JS objects** (`@JsExport val X: dynamic` built via
   `js("{}")`), never `@JsExport` class instances. Consumers spread them (`{ ...QPP }`)
   and mutate them in tests (`OAS.MONTHLY_PAYMENT_MAX = 1000`); Kotlin class instances
   keep properties on the prototype as read-only getters and break both *silently*.
2. **Property order matches the legacy build** — consumers enumerate keys; the golden
   corpus asserts the exact own-key sequence.
3. **Methods re-read the object's current property values on every call** (rebuild the
   common data class from the JS object, e.g. `Oas.copy(monthlyPaymentMax = o.MONTHLY_PAYMENT_MAX ...)`)
   so consumer mutations affect computations, like legacy `this.X` reads did.
4. **Methods dispatch through the object where legacy used `this.method()`**
   (see `OasFacade.kt`): consumer suites `jest.spyOn` individual methods and expect
   internal calls to hit the mock. Where legacy used closure-captured helpers instead
   (RESP savings grants), delegate to common code — mocking must NOT intercept there.
5. **Structured inputs use `external interface`** (no name mangling on plain JS
   objects); **structured outputs are fresh plain objects per call** (legacy
   `structuredClone` semantics — mutating a returned rate must not corrupt the source).
   Functions that legacy read from module state at call time (e.g. income-tax reading
   `TAX_BRACKETS`) must read the exported object's *current* state, not a snapshot.
6. **JS `Date` converts at the boundary** via `toLocalDateUtc()` (UTC fields, like the
   legacy code); `now()` keeps the legacy `NODE_ENV === 'test'` frozen-clock hook;
   `resetTime`/`validateRequestDate` keep their legacy *local-time* semantics.

## Adding a new export

1. Implement in `commonMain`; add the facade declaration here (plain-object recipe).
2. Type it: entry in `dtsConstTypes`/`dtsLinePatches` in `build.gradle.kts` + interface
   in `dts/overlay.d.ts` ([../../dts/README.md](../../dts/README.md)). An untyped `any`
   export fails the build on purpose.
3. Re-record the golden corpus ([../../ts-compat/README.md](../../ts-compat/README.md))
   and, if consumers will import it, add it to `ts-compat/smoke.ts`.
