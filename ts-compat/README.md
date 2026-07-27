# ts-compat — npm compatibility gates

Two gates protect the JavaScript/TypeScript API. Run both with `yarn compat`
(after `yarn build`).

## 1. `smoke.ts` — type-level gate

A strict-TypeScript compile check (`tsc -p ts-compat`) of the **real consumers' import
surface**: every symbol fna-engine and kronos-fna import, used in type positions the way
their code uses them (literal `ProvinceCode` unions, `ByProvince<T>` mapped types,
object shapes). If the shipped declarations regress, this fails before any consumer sees it.

## 2. `deep-parity.cjs` + `golden.json` — behavioral gate (the golden corpus)

A **golden corpus** freezes verified behavior as data. When the legacy TypeScript
implementation was deleted, its authority was preserved by recording, from the build
that had just been proven equivalent, everything observable about the npm package:

- **`tree`** — all 75 exports fully serialized: every nested value, every own key **in
  exact order** (consumers spread and enumerate these objects), functions as position
  markers, JSON-unrepresentable values encoded (`Infinity`, `NaN`, `Date`).
- **`calls`** — 8,572 function invocations over dense input grids (every jurisdiction ×
  income × inflation; birthdates × request ages × years abroad) with their exact
  results, *including which calls throw*.

Verification (`node ts-compat/deep-parity.cjs`) rebuilds both against the current
`dist/` and reports any difference with its exact path. It then runs self-contained
**behavioral probes** for the consumer patterns that once broke the facade:
`{...QPP}` keeps its methods, mutations stick and affect subsequent method results,
a `jest.spyOn`-style method replacement is seen by internal calls, and returned
structures are fresh mutable copies.

### Trust chain

`golden.json` was recorded 2026-07-17 from the build that had just passed, in the same
session: 18,923 comparisons against the final legacy TypeScript build (0 mismatches),
the 230 historical jest specs unmodified, and the real consumers — kronos-fna 231/231,
fna-engine 689/689, financial-api 4/4. The recording *is* that certification.

### Re-recording (yearly revisions, deliberate behavior changes)

A data revision **fails this gate on purpose** — the values really changed. Regenerate:

```
node ts-compat/deep-parity.cjs --record
```

and commit `golden.json` with the data change. The PR diff then shows reviewers
**exactly which values and downstream computed results changed and nothing else** — an
unintended change (bracket typo, broken formula) appears in the same diff as something
nobody expected. Never re-record to "make CI green" without reading the diff; that is
the entire safety mechanism.

Scope note: this gate asserts "behaves identically to the certified version" — it does
not judge correctness in the abstract. Logic-level testing lives in `src/commonTest`
(runs on JVM and Node); the JVM artifact is additionally covered by `src/jvmTest`.
