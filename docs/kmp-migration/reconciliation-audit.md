# Reconciliation Audit: financial-api taxca vs tax-ca

Scope: every constant in `financial-api/api/src/main/kotlin/com/equisoft/financialapi/{infrastructure,domain}/taxca/` (15 infrastructure + 13 domain files, all read in full) compared against its counterpart in `tax-ca/src/` (all corresponding files read in full).

## Summary

| Metric | Count |
|---|---|
| File pairs compared (constants) | 12 (+ 2 repository files + 13 domain config files inspected) |
| Numeric values compared | ~101 shared constants |
| **Value mismatches (CRITICAL)** | **0** |
| Renames / naming divergences | 13 |
| Structural / behavioral divergences | 6 |
| Fields/logic only in financial-api (must be preserved) | 9 items |
| Fields only in tax-ca (in corresponding files) | ~20 field groups (plus whole tax-ca-only modules) |
| Revision-date drift flags | 4 |

File-pair mapping:

| financial-api (infrastructure/taxca/constants/) | tax-ca (src/) |
|---|---|
| pension/QuebecPensionPlan.kt | pension/quebec-pension-plan.ts |
| pension/CanadaPensionPlan.kt | pension/canada-pension-plan.ts |
| pension/OldAgeSecurity.kt | pension/old-age-security.ts |
| pension/PublicPensionPlan.kt (incl. `PensionableEarnings`, `MaxPension`, `MonthlyDelay`, `ContributionRates`) | pension/public-pension-plan.ts (+ `PENSIONABLE_EARNINGS` values embedded in cpp/qpp files) |
| pension/DefinedBenefitPensionPlan.kt | pension/defined-benefit-pension-plan.ts |
| pension/MoneyPurchasePensionPlan.kt | pension/money-purchase-pension-plan.ts |
| investments/RegisteredRetirementSavingsPlan.kt | investments/registered-retirement-savings-plan.ts |
| investments/TaxFreeSavingsAccount.kt | investments/tax-free-savings-account.ts |
| misc/IQPFStatistics.kt | misc/ipf-stats.ts |
| misc/IncreaseFactors.kt | misc/ppp-increase-factor.ts |
| misc/LifeExpectancy.kt | misc/life-expectancy.ts |
| taxes/QuebecParentalInsurancePlan.kt | taxes/quebec-parental-insurance-plan.ts |

## CRITICAL: Value mismatches

**None found.** Every shared numeric constant is identical between the two repos, including:

- QPP: RETIREMENT 18091.80, BONUS 0.0070, PENALTY 0.0060, BASE 0.063, enhancement 0.04, YEARS_TO_FULL_PENSION 40, DEFAULT_REFERENCE_AGE 65, MAX_REQUEST_AGE 72, MIN_REQUEST_AGE 60, REPLACEMENT_FACTOR 0.25
- CPP: same as QPP except BASE 0.0595 and MAX_REQUEST_AGE 70 — both sides agree on both differences
- PensionableEarnings: BASIC_EXEMPTION 3500, YMPE 74600, YMPE_AVG_5 69180, YAMPE 85000, YAMPE_AVG_5 75985
- OAS: MAX_AGE 70, MIN_AGE 65, MONTHLY_PAYMENT_MAX 751.97, MONTHLY_DELAY_BONUS 0.006, AGE_OF_MAJORITY 18, min/max residency 10/40, increase age 75, increase rate 0.1
- DB 3932.22, MP 35390, RRSP 33810, TFSA 7000
- IQPF/IPF: INFLATION 0.021, borrowing 0.044, and all 9 return rates (0.024, 0.032, 0.063, 0.064, 0.066, 0.075, 0.027, 0.034, 0.044)
- IncreaseFactors: all 7 years 0.84
- LifeExpectancy: all 42 entries (21 male + 21 female) identical
- QPIP: 103000, 0.00764, 0.0043
- Derived: financial-api `IQPFStatistics.ympeGrowthRate = inflation + 0.01 = 0.031` equals tax-ca `YMPE_GROWTH_RATE: 0.031`

## Renames & structural differences

| # | financial-api | tax-ca | Type | Files |
|---|---|---|---|---|
| 1 | `ENHANCEMENT_STEP_TWO` | `ENHANCEMENT_STEP_2` | Rename | PublicPensionPlan.kt (`ContributionRates`) vs public-pension-plan.ts |
| 2 | `BURROWING_RATE` | `BORROWING_RATE` | Rename — tax-ca spelling is correct; financial-api's own domain class already uses `borrowingRate` | IQPFStatistics.kt vs ipf-stats.ts |
| 3 | `CANADIAN_EQUITY` | `CANADIAN_EQUITIES` | Rename (singular vs plural) | IQPFStatistics.kt vs ipf-stats.ts |
| 4 | `US_EQUITY` | `US_EQUITIES` | Rename (singular vs plural) | IQPFStatistics.kt vs ipf-stats.ts |
| 5 | `MIN_RESIDENCY_REQUIRED` / `MAX_RESIDENCY_REQUIRED` | `MIN_RESIDENCY` / `MAX_RESIDENCY` | Rename | OldAgeSecurity.kt vs old-age-security.ts |
| 6 | `INCREASE_AGE`, `INCREASE_RATE` (flat) | `INCREASE: { AGE, RATE, REPAYMENT_MAX }` (nested) | Structural (flattened; financial-api also lacks REPAYMENT_MAX) | OldAgeSecurity.kt vs old-age-security.ts |
| 7 | `IQPFStatistics` object | `IPF` / `IPFStatistics` | Object rename | IQPFStatistics.kt vs ipf-stats.ts |
| 8 | `IncreaseFactors` object | `PPP_INCREASE_FACTOR` | Object rename | IncreaseFactors.kt vs ppp-increase-factor.ts |
| 9 | `calculateRequestDateFactor(birthDate, requestDate, customReferenceDate)` | `getRequestDateFactor(...)` / `getPublicPensionRequestDateFactor(...)` | Function rename (logic equivalent) | PublicPensionPlan.kt vs public-pension-plan.ts |
| 10 | `isRequestDateValid(...): Boolean` (checks min AND max) | `validateRequestDate(...): void` (throws; checks min only) | Rename + behavioral difference | OldAgeSecurity.kt vs old-age-security.ts |
| 11 | Shared singleton `PensionableEarnings` object used by both plans | `PENSIONABLE_EARNINGS` embedded per plan (duplicated in cpp and qpp) | Structural (values identical) | PublicPensionPlan.kt vs canada/quebec-pension-plan.ts |
| 12 | `ympeGrowthRate` computed at runtime (`inflation + 0.01`) | Stored constants `YMPE_GROWTH_RATE: 0.031` and `PERFORMANCE_RATE: 0.01` | Structural (same result today; drifts if either side updates one input only) | domain/taxca/IQPFStatistics.kt vs ipf-stats.ts |
| 13 | `BigDecimal` (string-constructed) everywhere; `YEARS_TO_FULL_PENSION = BigDecimal("40")` | `number`; `YEARS_TO_FULL_PENSION: 40` | Type-system structural difference (relevant for KMP: BigDecimal is JVM-only) | all files |

Behavioral divergences beyond naming (same constants, different logic):

- **OAS age-75 increase (potential bug divergence)**: financial-api `getMonthlyOASAmount` multiplies the **full-residency** amount by `increaseFromAge` (1.1 after 75); tax-ca applies `increaseFromAge` **only on the partial-residency path** — the full-residency early return (`old-age-security.ts` line 157-159) never applies the 10% increase. Also, eligibility test differs: financial-api uses `monthsDiff(75th birthday, requestDate) > 0`; tax-ca uses `getAge(...) > INCREASE.AGE` (effectively age 76+).
- **`getRequestDateMonthsDeferred`**: tax-ca validates the request date then uses `Math.abs(...)`; financial-api skips validation and uses `max(0, ...)`.
- **OAS "already receiving payment" logic**: tax-ca's `getRequestDateFactor`/`getMinRequestDateFactor` depend on `now()` (ABF-13000 change, commit 6b4103e) and return 1 when payments have started; financial-api has no equivalent of these two functions at all.
- **CPP `calculateContributionCoverageFactor`**: overridden with real logic in financial-api's CanadaPensionPlan (default returns ONE); no equivalent function exists anywhere in tax-ca (see next section).

## Fields only in financial-api (must be added to unified library)

Searched all of `tax-ca/src/pension/*.ts` (including public-pension-plan.ts, canada-pension-plan.ts, old-age-security.ts) — `MAX_REQUEST_AGE`, `MIN_REQUEST_AGE`, `YEARS_TO_FULL_PENSION`, `REPLACEMENT_FACTOR`, `MAX_PENSION`, `MONTHLY_DELAY`, `DEFAULT_REFERENCE_AGE` **do exist in tax-ca** (public-pension-plan.ts interface, values in cpp/qpp files) and match. The following, however, exist **only** in financial-api:

| Field / member | Value | financial-api file | Notes |
|---|---|---|---|
| `CanadaPensionPlan.MONTHS_AT_MAJORITY` | 216 (18 yrs) | constants/pension/CanadaPensionPlan.kt | private; input to contribution coverage |
| `CanadaPensionPlan.CONTRIBUTION_MAX_AGE_IN_MONTHS` | 840 (70 yrs) | constants/pension/CanadaPensionPlan.kt | private |
| `CanadaPensionPlan.CPP_START_DATE` | 1966-01-01 | constants/pension/CanadaPensionPlan.kt | private |
| `CanadaPensionPlan.DROP_OUT_RATIO` | 0.17 | constants/pension/CanadaPensionPlan.kt | 17% general drop-out; **no drop-out/coverage concept anywhere in tax-ca** (grep confirmed) |
| `CanadaPensionPlan.MIN_DENOMINATOR_MONTHS` | 120 | constants/pension/CanadaPensionPlan.kt | private |
| `CanadaPensionPlan.calculateContributionCoverageFactor(...)` | function (CPP override; interface default = 1) | constants/pension/CanadaPensionPlan.kt + PublicPensionPlan.kt | consumed via `PPPConfig`; must be ported |
| `PublicPensionPlan.MONTHS_IN_YEAR` | 12 | constants/pension/PublicPensionPlan.kt | companion const |
| `OldAgeSecurity.getMaximumRequestAge/getMaximumRequestDate` | functions (`18 + yearsOutsideCanada + 40`, floor 70) | constants/pension/OldAgeSecurity.kt | private; used by `isRequestDateValid` |
| `OldAgeSecurity.isRequestDateValid(...)` (max-bound check) | function returning Boolean | constants/pension/OldAgeSecurity.kt | tax-ca only validates the min bound (and throws) |

Also financial-api-only, non-numeric: the whole `domain/taxca/` config layer (PPPConfig, PPPAgeConstraints, PPPMaxPension, PPPMonthlyDelay, PensionableEarnings, ContributionsRates, OldAgeSecurityConfig, IQPFStatistics, IncreaseFactorsConfig, IQPF*ReturnRates, QuebecParentalInsurancePlanConfig, PremiumRates) — camelCase immutable classes decoupling consumers from the constants. `DIVISION_SCALE = 10` (rounding scale) appears in both CanadaPensionPlan.kt and OldAgeSecurity.kt as a JVM BigDecimal artifact.

## Fields only in tax-ca (informational)

Within the corresponding files: CPP/QPP `DEATH_BENEFIT.RATE` (0.5), `FLAT_BENEFIT` (7 survivor/disability amounts each, values differ between CPP and QPP), `INDEXATION_RATE_REFERENCES` (17 year-rate pairs) + `getAverageIndexationRate()`, `MAX_INCOME` (61-year YMPE history 1966-2026), `MAX_PENSION.COMBINED_RETIREMENT_SURVIVOR` (18378.72 CPP / 18091.80 QPP), `MAX_PENSION.DEATH_BENEFIT` (2500), `SURVIVOR_RATES` (0.6 / 0.375); OAS `REPAYMENT` clawback block (MAX 155109, MIN 95323, RATIO 0.15), `INCREASE.REPAYMENT_MAX` (161088), `getRepaymentMax()`, `getMinRequestDateFactor()`, `getRequestDateFactor()`; RRSP `CONVERSION_AGE` (MIN 0, MAX 71); TFSA `UNROUNDED_MAX_CONTRIBUTION` (6893), `ROUNDING_FACTOR` (500), `UPDATE_YEAR` (2024); IPF `PERFORMANCE_RATE` (0.01), `YMPE_GROWTH_RATE` (0.031), deprecated `INTL_DEVELOPED_MARKET_EQUITIES` alias; and `supplemental-pension-plan.ts` (SPP, marked "NOT USED IN FNA-ENGINE").

**tax-ca-only modules** (no financial-api counterpart at all): `taxes/income-tax.ts` (full federal + all-province bracket tables), `taxes/dividend-credit.ts`, `taxes/employment-insurance.ts`, `investments/life-income-fund.ts`, `locked-in-retirement-account.ts`, `non-registered-savings-plan.ts`, `registered-retirement-income-fund.ts`, the whole `registered-education-savings-plan/` module, `misc/consumer-price-index.ts`, `misc/code-types.ts`, and `utils/` (date/math/collections helpers). These carry over to the unified library from tax-ca as-is.

## Revision-date drift

| File pair | tax-ca Revised | financial-api Revised | Verdict |
|---|---|---|---|
| tax-free-savings-account.ts / TaxFreeSavingsAccount.kt | 2025-12-22 | **2024-12-30** | financial-api header ~1 year stale; value (7000) still matches |
| ipf-stats.ts / IQPFStatistics.kt | 2026-04-23 | **header: 2024-04** (inner comment: 2026-04-22) | financial-api file header stale; values current; inner/outer dates inconsistent within the same file |
| (PENSIONABLE_EARNINGS in cpp/qpp .ts, rev 2026-01-05 / 2025-12-22) / PublicPensionPlan.kt | 2026-01-05 | **2025-01-08** | financial-api header ~1 year stale; values (YMPE 74600 etc.) are current 2026 figures |
| life-expectancy.ts / LifeExpectancy.kt | 2022-04-30 | **no header at all** | financial-api has no source/revision comment; values match |
| quebec/canada-pension-plan, old-age-security, defined-benefit, money-purchase, rrsp, ppp-increase-factor, qpip | 2025-12-22 / 2026-01-05 / 2026-06-30 / 2026-01-06 / 2026-01-06 / 2025-12-22 / 2025-12-22 / 2025-12-22 | identical dates | In sync |

## Minimum JVM API surface consumed via TaxCARepository

From `domain/taxca/TaxCARepository.kt` and its sole implementation `infrastructure/taxca/TaxCAConstantRepository.kt`, the service consumes exactly:

1. `getIQPFStatistics()` → INFLATION, BURROWING_RATE, all 9 RETURN_RATES, derived ympeGrowthRate (inflation + 0.01)
2. `getOldAgeSecurityConfig()` → MAX_AGE, MIN_AGE, MIN/MAX_RESIDENCY_REQUIRED, INCREASE_RATE, INCREASE_AGE, MONTHLY_DELAY_BONUS (+ implicitly MONTHLY_PAYMENT_MAX and AGE_OF_MAJORITY inside the 7 exposed functions: getMinimumRequestDate, getMinimumRequestAge, getRequestDateMonthsDeferred, isFullResidencyAtMinOASAge, isRequestDateValid, getResidencyYearsAtRequest, getMonthlyOASAmount)
3. `getTFSAMaxContribution()` → TFSA.MAX_CONTRIBUTION
4. `getRRSPMaxContribution()` → RRSP.MAX_CONTRIBUTION
5. `getMPMaxContribution()` → MoneyPurchase.MAX_CONTRIBUTION
6. `getDBMaxContribution()` → DefinedBenefit.MAX_CONTRIBUTION
7. `getIQPFLifeExpectancyTable(gender)` → LifeExpectancy.MALE / FEMALE maps
8. `getQPPConfig()` / 9. `getCPPConfig()` → per plan: DEFAULT_REFERENCE_AGE, MIN/MAX_REQUEST_AGE, YEARS_TO_FULL_PENSION, REPLACEMENT_FACTOR, MAX_PENSION.RETIREMENT, MONTHLY_DELAY.BONUS/PENALTY, CONTRIBUTION_RATES.BASE/ENHANCEMENT_STEP_TWO, PensionableEarnings (all 5), `calculateRequestDateFactor`, `calculateContributionCoverageFactor`
10. `getPensionableEarnings()` → BASIC_EXEMPTION, YMPE, YMPE_AVG_5, YAMPE, YAMPE_AVG_5
11. `getIncreaseFactors()` → FIRST through SEVENTH_YEAR
12. `getQuebecParentalInsurancePlanConfig()` → MAX_INSURABLE_EARNINGS, PREMIUM_RATES.SELF_EMPLOYED/SALARIED

Not consumed by the repository (dead weight if ported blindly): nothing — every financial-api constant object is reachable through the repository except the private CCF/OAS helpers, which are consumed indirectly through the exposed functions.

## Recommended rulings

| Item | Ruling | Rationale |
|---|---|---|
| `ENHANCEMENT_STEP_2` vs `ENHANCEMENT_STEP_TWO` | **tax-ca wins** (`ENHANCEMENT_STEP_2`) | tax-ca is the declared source of truth; `_2` is the original public API naming; financial-api's domain class already abstracts it as `enhancementStepTwo` so nothing breaks |
| `BURROWING_RATE` vs `BORROWING_RATE` | **tax-ca wins** (`BORROWING_RATE`) | "Burrowing" is a typo; financial-api's own domain layer already spells it `borrowingRate` |
| `CANADIAN_EQUITY`/`US_EQUITY` vs `CANADIAN_EQUITIES`/`US_EQUITIES` | **tax-ca wins** (plural) | Consistent with `FOREIGN_DEVELOPED_MARKET_EQUITIES`/`EMERGING_MARKET_EQUITIES` which are plural on both sides |
| `MIN/MAX_RESIDENCY` vs `MIN/MAX_RESIDENCY_REQUIRED` | **financial-api wins** (`_REQUIRED`) | More self-documenting; low blast radius since tax-ca's OAS residency fields are newer API; acceptable either way, but pick one and alias |
| OAS `INCREASE` nested vs flat `INCREASE_AGE`/`INCREASE_RATE` | **tax-ca wins** (nested), and unified library must include `REPAYMENT_MAX`/`REPAYMENT` | tax-ca structure carries the clawback data financial-api lacks; flat Kotlin properties can be generated from the nested model |
| Shared vs per-plan `PENSIONABLE_EARNINGS` | **financial-api wins** (single shared object) | Values are identical for CPP/QPP by construction; duplication in tax-ca is a drift hazard — model once, reference from both plans |
| `ympeGrowthRate` computed vs `YMPE_GROWTH_RATE`+`PERFORMANCE_RATE` stored | **financial-api wins** (derive it) | tax-ca stores three numbers where `YMPE_GROWTH_RATE = INFLATION + PERFORMANCE_RATE` must hold; deriving removes an invariant that can silently break |
| `calculateContributionCoverageFactor` + CPP constants (216, 840, 1966-01-01, 0.17, 120) | **financial-api wins — must be added** | Exists nowhere in tax-ca; dropping it would break financial-api's CPP projections. Port to common code (constants are platform-neutral; only BigDecimal/LocalDate need KMP equivalents) |
| OAS `isRequestDateValid` (Boolean, min+max) vs `validateRequestDate` (throws, min only) | **financial-api wins** (Boolean, both bounds) | Total function, checks the upper residency-shifted bound tax-ca ignores; keep a throwing wrapper for tax-ca compatibility |
| OAS age-75 increase on full-residency path | **financial-api wins — treat tax-ca as buggy, confirm with domain owners** | The 10% OAS increase at 75 applies regardless of residency ratio; tax-ca only applies it on the partial path. Reconcile the eligibility test too (financial-api: after 75th birthday; tax-ca: age > 75). This is the single item needing a human ruling before merge |
| OAS `getRequestDateFactor`/`getMinRequestDateFactor` (now()-dependent, ABF-13000) | **tax-ca wins — carry over** | Newer business logic (in-payment handling) absent from financial-api; unified library needs it for tax-ca consumers |
| `IncreaseFactors` vs `PPP_INCREASE_FACTOR` naming | **tax-ca wins** (`PPP_INCREASE_FACTOR` / `PppIncreaseFactor`) | "IncreaseFactors" is ambiguous; the PPP prefix says what it applies to |
| Number representation | **Neither as-is: KMP decision needed** | `java.math.BigDecimal` is JVM-only; a KMP library needs `expect/actual` decimal or string-backed constants with per-platform decimal types. Do not regress financial-api to Double |
| Stale headers (TFSA 2024-12-30, IQPFStatistics 2024-04, PublicPensionPlan 2025-01-08, LifeExpectancy missing) | **tax-ca dates win** | Values already match; adopt tax-ca's revision metadata (and its source URLs for LifeExpectancy) in the unified library |
| All ~101 shared numeric values | **No action** | Bit-for-bit identical; either side can seed the unified library's values |

Bottom line: the two repos are numerically in lockstep (zero value mismatches), so the merge risk is entirely in naming, structure, and three logic deltas — CPP contribution coverage (financial-api-only, must port), OAS max-bound validation (financial-api-only, should port), and the OAS age-75 increase discrepancy (needs a domain ruling, financial-api's behavior appears correct).
