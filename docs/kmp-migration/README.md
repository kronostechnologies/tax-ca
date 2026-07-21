# KMP migration — document index

History and decisions of the 2026 migration from the TypeScript-only library to Kotlin
Multiplatform (npm + Maven from one code base). The migration replaced the duplicated
Kotlin constants in financial-api and kept the npm package a verified drop-in.

| Document | What it holds |
|---|---|
| [phase-0-decisions.md](phase-0-decisions.md) | The decision memo: D1–D6 with rulings and status. **D2 (Double/BigDecimal) and D5 (deep-import shim) are the ones people ask about.** |
| [reconciliation-audit.md](reconciliation-audit.md) | Field-by-field audit of financial-api's duplicated constants vs tax-ca: 0 value mismatches, 13 renames, 3 logic deltas (incl. the D1 OAS divergence). |
| [consumers.md](consumers.md) | npm consumer inventory (fna-engine, kronos-fna): imports, deep-import usage, CalVer notes. |
| [api-baseline.md](api-baseline.md) | Frozen declaration files of the last legacy TypeScript build — the npm API contract the facade reproduces. |
| [porting-conventions.md](porting-conventions.md) | The TS→Kotlin porting recipes (historical, but the facade rules remain current — see `src/jsMain/README.md`). |
| [testing-in-consumers.md](testing-in-consumers.md) | How to validate a branch build inside kronos-fna / fna-engine / financial-api. |
| [financial-api-parity-test.kt.txt](financial-api-parity-test.kt.txt) | Ready-made JVM parity test comparing the Maven artifact against financial-api's duplicated code — first step of their cutover. |

## Validation summary (as of 2026-07-17)

- Golden corpus recorded from a build verified against the final legacy build
  (18,923 checks, 0 mismatches) — see `ts-compat/README.md`.
- Real consumers: kronos-fna **231/231**, fna-engine **689/689** (incl. the 18
  `dist/misc/code-types` deep imports via the shipped shim), financial-api **4/4**.
- 230 historical jest specs passed unmodified against the built package before their
  removal; all 14 suites live on in `src/commonTest`.

## Still open

- **D1** — OAS age-75 increase behavior: tax-ca (ported verbatim) vs financial-api
  differ; needs a domain ruling, then a deliberate, release-noted change + golden
  re-record.
- **D4** — Maven registry values (`MAVEN_REPOSITORY_URL` + credentials) to activate the
  CI `publish-maven` job.
- Org-wide GitHub code search for `"@equisoft/tax-ca"` to rule out unknown consumers
  before rollout.
- financial-api cutover: `financial-api/docs/tax-ca-kmp-cutover-plan.md`.
