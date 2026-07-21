# dts — hand-maintained TypeScript declarations

The npm package's `.d.ts` is assembled by `jsNodeProductionLibraryDistribution`
(see the patch block in `build.gradle.kts`) from three layers:

1. **Kotlin-generated declarations** — cover plain function signatures
   (`clamp(num: number, min: number, max: number): number` comes out exact).
2. **Exact-match patches** (`dtsConstTypes` / `dtsLinePatches` in `build.gradle.kts`) —
   retype what the compiler cannot express. The facade exports data as plain JS objects
   (`dynamic`), which generate as `any`; each such const is patched to its legacy type.
   Function signatures referencing Kotlin `external interface` inputs (not emitted — no
   runtime existence) or returning `dynamic` are patched to the legacy signature.
3. **`overlay.d.ts`** (this folder) — appended verbatim. Declares the type-level API:
   all 55 interfaces/types of the legacy package (extracted verbatim from its final
   declaration files), including literal unions (`ProvinceCode`), mapped types
   (`ByJurisdiction<T>`), and every interface consumers import as a type.

## Drift detection — both directions, on purpose

- A patch target the generator no longer emits → **build fails** (compiler output drifted).
- A new `export declare const X: any;` with no `dtsConstTypes` entry → **build fails**
  (nobody ships an untyped export by accident).

## Changing a shape / adding an export

If a yearly revision changes a structure (new field, new bracket shape) or a new export
is added: update the matching interface here, add/adjust the patch entry in
`build.gradle.kts`, and let `ts-compat/smoke.ts` (strict-TS consumer-surface check)
prove the result. The overlay is the **npm type contract** — treat edits like API
changes, not documentation.
