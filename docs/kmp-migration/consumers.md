# @equisoft/tax-ca — npm consumer inventory (Phase 0)

Generated 2026-07-16 from local checkouts under `~/kronos/projects`. GitHub CLI was
not available on this machine, so this list should be confirmed with an org-wide
GitHub code search for `"@equisoft/tax-ca"` before cutover.

Kotlin-side consumer (financial-api) is covered by the reconciliation audit; it does
not consume the npm package.

## Summary

| Consumer | Version pinned | Module system | Import style | Distinct symbols |
|---|---|---|---|---|
| fna-engine | `2026.9.1` | CommonJS (TS) | 41 root imports + **18 deep imports** of `@equisoft/tax-ca/dist/misc/code-types` | 32 |
| kronos-fna | `2026.9.1` | CommonJS (plain JS, bundled) | 19 root imports only | 19 |

Published versioning is **CalVer** (`2026.9.1`), not SemVer — the local `package.json`
version (`0.0.1`) is a CI-replaced placeholder. The plan's "major version bump" for the
KMP release translates here to a new CalVer release plus explicit release notes; there
is no semver-range protection for consumers, so the cutover must be coordinated.

## Compatibility constraints derived from usage

1. **CommonJS required.** Both consumers are CJS. The Kotlin/JS build must emit CJS or
   dual CJS/ESM output (Kotlin/JS IR supports `commonjs`; a dual-format wrapper is the
   safer choice).
2. **Deep-import path must survive or be shimmed.** fna-engine imports
   `@equisoft/tax-ca/dist/misc/code-types` in 18 files. Options: (a) keep a
   `dist/misc/code-types.{js,d.ts}` re-export shim in the published package, or
   (b) codemod fna-engine to root imports at cutover (18 mechanical edits). Option (b)
   is cleaner; (a) buys independence from fna-engine's release schedule.
3. **Aliased re-exports are used** (`CanadaEducationSavingsGrant as CESG`, etc.) —
   no constraint beyond exact export names.

## Minimum JS API surface (union of both consumers)

Data constants:
`CPP`, `QPP`, `OAS`, `EI`, `QPIP`, `IPF`, `RESP`, `RRSP`, `TFSA`, `TAX_BRACKETS`,
`PROVINCIAL_CODES`, `FEDERAL_CODE`, `LIFE_EXPECTANCY`, `PPP_INCREASE_FACTOR`,
`ELIGIBLE_DIVIDEND`, `NON_ELIGIBLE_DIVIDEND`, `CanadaEducationSavingsGrant`,
`CanadaLearningBond`, `BritishColumbiaTrainingAndEducationSavingsGrant`,
`QuebecEducationSavingsIncentive`, `TuitionFees`

Types/interfaces:
`ProvinceCode`, `FederalCode`, `Rate`, `ContributionRates`, `PensionableEarnings`,
`PublicPensionPlan`, `Beneficiary`

Functions:
`canConvert`, `canUnlock`, `getCapitalGainsTaxableAmount`, `getConversionRules`,
`getEffectiveRate`, `getFederalBasicPersonalAmount`, `getMonthsDiff`, `getRate`,
`getTotalMaxMarginalRate`

Everything else in the package is currently unconsumed by these two projects, but the
compatibility gates (existing jest suite + golden parity corpus) still cover the full
surface in `api-baseline.md`; this list is the "cannot break under any circumstance"
core.

## Follow-ups

- [ ] Org-wide GitHub code search to confirm no other consumers (needs `gh` or web UI).
- [ ] Decide deep-import strategy: shim in package vs codemod fna-engine.
- [ ] Confirm kronos-fna's bundler handles the new package output (it consumes the
      package from plain JS through webpack; CJS output makes this a non-issue).
