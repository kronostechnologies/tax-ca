# KMP migration — Phase 0 decision memo

Status: draft for review — 2026-07-16
Inputs: [api-baseline.md](api-baseline.md), [consumers.md](consumers.md), [reconciliation-audit.md](reconciliation-audit.md)

## Headline findings

1. **Zero value mismatches.** All ~101 constants shared between tax-ca and financial-api
   are bit-for-bit identical. The merge risk is entirely naming, structure, and three
   logic deltas — not data.
2. **financial-api is NOT constants-only.** Its `TaxCARepository` exposes calculation
   logic too: `calculateRequestDateFactor`, `calculateContributionCoverageFactor` (CPP),
   and seven OAS functions. The unified library's JVM surface must include functions,
   not just data. This settles a Phase 0 open question without needing a meeting.
3. **financial-api has logic that tax-ca lacks** and that must be ported into the
   unified library or financial-api regresses: CPP contribution coverage factor (+5
   private constants), OAS max-request-age validation.
4. **One genuine behavioral conflict** (OAS age-75 increase) needs a domain ruling —
   see D1. Everything else is mechanically resolvable.

## Blocking decisions

### D1 — OAS age-75 increase: which behavior is correct? (domain ruling required)
tax-ca applies the 10% increase at 75 only on the partial-residency path
(`old-age-security.ts:157`); financial-api applies it on the full-residency path too.
Eligibility test also differs (financial-api: after 75th birthday; tax-ca: age > 75).
The audit's assessment is that financial-api is correct and tax-ca has a bug.
**Consequence either way:** if financial-api is right, fixing this *changes numeric
output* for fna-engine/kronos-fna — the change must be its own release (or a flagged
line in the KMP release notes) and the golden-parity corpus must encode the ruled
behavior, not blind old-output equality.
**Owner: domain/actuarial owner of OAS logic. Blocks: Phase 2 port of OAS.**

### D2 — Number representation across platforms
Proposal (unchanged from plan, sharpened by the audit):
- `commonMain`: `Double` (+ `Int` for years/ages) — required for bit-identical JS output.
- `jvmMain`: BigDecimal **view layer** — same constants exposed as `BigDecimal` via
  `BigDecimal.valueOf(double)` (string-round-trip semantics; for these magnitudes the
  result is exactly the decimal literal, e.g. `0.0595` → `0.0595`). financial-api keeps
  its BigDecimal-typed domain layer; only its `TaxCAConstantRepository` implementation
  changes.
- Functions on JVM: primary signatures in Double; where financial-api needs BigDecimal
  in/out (e.g. `calculateContributionCoverageFactor`), `jvmMain` provides BigDecimal
  overloads that convert at the edge, keeping one implementation in common code.
- Rejected: multiplatform BigDecimal library in common code (breaks the JS `number`
  API and buys nothing — the constants are exact in Double).
**Owner: tax-ca maintainers + financial-api team sign-off. Blocks: Phase 1 skeleton.**

### D3 — JVM date types
Common code uses `kotlinx-datetime` (`LocalDate`/`Instant`). financial-api's ported
functions currently take `java.time.LocalDate`. `jvmMain` ships `java.time` overloads
(kotlinx-datetime converts losslessly). JS facade converts JS `Date` at the boundary.
**Owner: financial-api team preference (kotlinx vs java.time as primary). Blocks: Phase 2.**

### D4 — Maven coordinates and registry
Proposed: `com.equisoft:tax-ca` (or `com.equisoft.taxca:tax-ca`), published to the same
internal registry financial-api already pulls from. **Owner: platform/infra. Blocks: Phase 4.**

### D5 — fna-engine deep imports (18 files import `@equisoft/tax-ca/dist/misc/code-types`)
Options: (a) ship a `dist/misc/code-types` re-export shim in the new package;
(b) codemod fna-engine to root imports at cutover. Recommendation: **(b)** — mechanical,
18 lines, removes a private-path dependency; do (a) only if release schedules can't align.
**Owner: fna-engine maintainers. Blocks: Phase 5 only.**

### D6 — Release/versioning coordination
Published versioning is CalVer (`2026.9.1`), so there is no semver protection. The first
KMP release is the next CalVer version with explicit release notes; both npm consumers
pin exact versions, so nothing breaks until they opt in. Maven and npm share the same
version string. **Owner: tax-ca maintainers. Blocks: Phase 4.**

## Proposed rulings (approve or veto — full rationale in reconciliation-audit.md)

| Topic | Ruling |
|---|---|
| `ENHANCEMENT_STEP_2` naming | tax-ca wins |
| `BORROWING_RATE` spelling | tax-ca wins (financial-api has typo `BURROWING_RATE`) |
| `CANADIAN_EQUITIES`/`US_EQUITIES` plural | tax-ca wins |
| `MIN/MAX_RESIDENCY_REQUIRED` | financial-api wins (self-documenting) |
| OAS `INCREASE` nested block (incl. clawback data) | tax-ca wins |
| Single shared `PENSIONABLE_EARNINGS` object | financial-api wins (removes CPP/QPP duplication) |
| Derive `ympeGrowthRate = INFLATION + PERFORMANCE_RATE` | financial-api wins (removes silent-drift invariant) |
| Port CPP contribution-coverage factor + constants | financial-api wins — must be added |
| OAS request-date validation: Boolean, min+max bounds | financial-api wins (throwing wrapper kept for TS compat) |
| OAS in-payment logic (`getRequestDateFactor`, ABF-13000) | tax-ca wins — carry over |
| `PPP_INCREASE_FACTOR` naming | tax-ca wins |
| Revision headers/source URLs | tax-ca wins (financial-api headers are stale in 4 files) |

Naming rulings affect the **common/idiomatic layer**; the JS facade still reproduces
today's TS names exactly (api-baseline.md is the contract), and financial-api's domain
layer already abstracts the constant names, so both consumers are insulated.

## Checklist to exit Phase 0

- [ ] D1 ruled by domain owner (only blocks the behavior fix, not the port — the KMP
      library currently reproduces tax-ca's legacy OAS behavior verbatim)
- [x] D2/D3 acknowledged by financial-api team — signed off 2026-07-16 by Jean-Simon
      Garneau (financial-api). Cutover steps captured in a standalone plan to be run
      inside financial-api: `financial-api/docs/tax-ca-kmp-cutover-plan.md`
- [ ] D4 coordinates + registry confirmed
- [ ] Org-wide GitHub code search for `"@equisoft/tax-ca"` (rule out unknown consumers; `gh` not installed locally)
- [ ] Proposed rulings table approved
