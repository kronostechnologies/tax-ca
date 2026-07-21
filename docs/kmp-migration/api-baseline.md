# @equisoft/tax-ca — public API baseline (npm compatibility contract)

Generated 2026-07-16 from `yarn build` output (tsc declarations). This is the surface the KMP jsMain facade + .d.ts overlay must reproduce.

## index.d.ts
```ts
export * from './investments';
export * from './misc';
export * from './pension';
export * from './taxes';
export * from './utils';
```

## investments/index.d.ts
```ts
export * from './life-income-fund';
export * from './locked-in-retirement-account';
export * from './registered-retirement-income-fund';
export * from './registered-retirement-savings-plan';
export * from './tax-free-savings-account';
export * from './non-registered-savings-plan';
export * from './registered-education-savings-plan';
```

## investments/life-income-fund.d.ts
```ts
import { FederalCode, ProvinceCode } from '../misc';
interface MaxWithdrawalPctByAge {
    [key: number]: number;
}
export declare const province1MaxWithdrawalPct: MaxWithdrawalPctByAge;
export declare const province2MaxWithdrawalPct: MaxWithdrawalPctByAge;
export declare const othersMaxWithdrawalPct: MaxWithdrawalPctByAge;
export declare const federalMaxWithdrawalPct: MaxWithdrawalPctByAge;
export declare function getMaxWithdrawalPct(jurisdiction: ProvinceCode | FederalCode, age: number): number;
export interface SmallBalanceUnlockingRule {
    minAge: number | null;
    getThresholdPct: (age: number) => number;
}
export declare const getYMPEUnlockingSmallBalancePct: (jurisdiction: ProvinceCode, age: number) => number | null;
export {};
```

## investments/locked-in-retirement-account.d.ts
```ts
import { FederalCode, ProvinceCode } from '../misc';
export interface ConversionRule {
    minimumAge: number;
    maximumAge: number;
}
export declare const MAX_CONVERSION_AGE = 71;
export declare const getUnlockingPct: (jurisdiction: ProvinceCode | FederalCode) => number | null;
export declare const getConversionRules: (jurisdiction: ProvinceCode | FederalCode) => ConversionRule | null;
export declare const canUnlock: (jurisdiction: ProvinceCode | FederalCode) => boolean;
export declare const canConvert: (jurisdiction: ProvinceCode | FederalCode, age: number) => boolean;
```

## investments/non-registered-savings-plan.d.ts
```ts
import { Rate } from '../taxes';
export declare const CAPITAL_GAINS_BRACKETS: Rate[];
export declare function getCapitalGainsTaxableAmount(totalCapitalGains: number): number;
```

## investments/registered-education-savings-plan/beneficiary.d.ts
```ts
export interface Beneficiary {
    MAX_AGE: number;
}
export declare const Beneficiary: Beneficiary;
```

## investments/registered-education-savings-plan/british-columbia-training-and-education-savings-grant.d.ts
```ts
export interface BritishColumbiaTrainingAndEducationSavingsGrant {
    BENEFICIARY_AGE_ALLOCATION: number;
    MAX_GRANT: number;
    getTotalForAYear: (beneficiaryAge: number) => number;
}
export interface BritishColumbiaTrainingAndEducationSavingsGrantData {
    BENEFICIARY_AGE_ALLOCATION: number;
    MAX_GRANT: number;
}
export declare const BritishColumbiaTrainingAndEducationSavingsGrant: BritishColumbiaTrainingAndEducationSavingsGrant;
```

## investments/registered-education-savings-plan/canada-education-savings-grant.d.ts
```ts
import { SavingsGrant } from './savings-grant';
export declare const CanadaEducationSavingsGrant: SavingsGrant;
```

## investments/registered-education-savings-plan/canada-learning-bond.d.ts
```ts
export interface CanadaLearningBond {
    OPENING_YEAR_CLB: number;
    YEARLY_CLB: number;
    MAX_BENEFICIARY_AGE: number;
    getTotalForAYear(income: number, beneficiaryAge?: number, accountOpeningYear?: boolean): number;
}
export interface CanadaLearningBondData {
    OPENING_YEAR_CLB: number;
    YEARLY_CLB: number;
    MAX_BENEFICIARY_AGE: number;
}
export declare const CanadaLearningBond: CanadaLearningBond;
```

## investments/registered-education-savings-plan/income-level.d.ts
```ts
export declare enum IncomeLevelType {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}
export interface IncomeLevel {
    LOW_INCOME_THRESHOLD: number;
    MEDIUM_INCOME_THRESHOLD: number;
    getIncomeLevel(income: number): IncomeLevelType;
}
export declare const IncomeLevel: IncomeLevel;
```

## investments/registered-education-savings-plan/index.d.ts
```ts
export * from './canada-education-savings-grant';
export * from './canada-learning-bond';
export * from './quebec-education-savings-incentive';
export * from './british-columbia-training-and-education-savings-grant';
export * from './tuition-fees';
export * from './income-level';
export * from './beneficiary';
export declare const RESP: {
    MAX_CONTRIBUTION: number;
};
```

## investments/registered-education-savings-plan/quebec-education-savings-incentive.d.ts
```ts
import { SavingsGrant } from './savings-grant';
export declare const QuebecEducationSavingsIncentive: SavingsGrant;
```

## investments/registered-education-savings-plan/savings-grant.d.ts
```ts
import { IncomeLevelType } from './income-level';
export interface SuppGrantPercent {
    LOW_INCOME: number;
    MEDIUM_INCOME: number;
}
export interface SavingsGrant {
    MAX_GRANT: number;
    MAX_BENEFICIARY_AGE: number;
    MAX_AMOUNT_YEARLY_FOR_GRANT: number;
    YEARLY_GRANT_PERCENT: number;
    MAX_AMOUNT_FOR_SUPP_GRANT: number;
    SUPP_GRANT_PERCENT: SuppGrantPercent;
    getBaseGrant(contribution: number): number;
    getSuppGrant(contribution: number, incomeLevel: IncomeLevelType): number;
    getTotalForAYear(income: number, contribution: number, totalGrantAlreadyGiven?: number, beneficiaryAge?: number): number;
}
export interface SavingsGrantConfig {
    MAX_GRANT: number;
    MAX_BENEFICIARY_AGE: number;
    MAX_AMOUNT_YEARLY_FOR_GRANT: number;
    YEARLY_GRANT_PERCENT: number;
    MAX_AMOUNT_FOR_SUPP_GRANT: number;
    SUPP_GRANT_PERCENT: SuppGrantPercent;
}
export declare function initializeSavingsGrant(SavingsGrantConfig: SavingsGrantConfig): SavingsGrant;
```

## investments/registered-education-savings-plan/tuition-fees.d.ts
```ts
import { ByProvince, ProvinceCode } from '../../misc';
export interface TuitionFees {
    TuitionFeesData: ByProvince<number>;
    getTuitionFeesByProvinceCode(provinceCode: ProvinceCode): number;
}
export declare const TuitionFees: TuitionFees;
```

## investments/registered-retirement-income-fund.d.ts
```ts
export interface RegisteredRetirementIncomeFund {
    MIN_WITHDRAWAL_PCT: {
        [K: number]: number;
    };
}
export declare const RRIF: RegisteredRetirementIncomeFund;
export declare function getMinimumWithdrawalPercentage(beginningOfYearAge: number): number;
```

## investments/registered-retirement-savings-plan.d.ts
```ts
export interface ConversionAge {
    MIN: number;
    MAX: number;
}
export interface RegisteredRetirementSavingsPlan {
    CONVERSION_AGE: ConversionAge;
    MAX_CONTRIBUTION: number;
}
export declare const RRSP: RegisteredRetirementSavingsPlan;
```

## investments/tax-free-savings-account.d.ts
```ts
export interface TaxFreeSavingsAccount {
    MAX_CONTRIBUTION: number;
    UNROUNDED_MAX_CONTRIBUTION: number;
    ROUNDING_FACTOR: number;
    UPDATE_YEAR: number;
}
export declare const TFSA: TaxFreeSavingsAccount;
```

## investments/tests/fixtures/locked-in-retirement-account.d.ts
```ts
import { ByJurisdiction, FederalCode, ProvinceCode } from '../../../misc';
import { ConversionRule } from '../../locked-in-retirement-account';
export declare const mockedUnlockingPct: ByJurisdiction<number | null>;
export declare const mockedConversionRules: ByJurisdiction<ConversionRule | null>;
export declare const jurisdictions: (ProvinceCode | FederalCode)[];
```

## misc/code-types.d.ts
```ts
export type ProvinceCode = 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'PE' | 'ON' | 'QC' | 'SK' | 'NT' | 'NU' | 'YT';
export type FederalCode = 'CA';
export type FederalName = 'CANADA';
export type ProvinceName = 'ALBERTA' | 'BRITISH_COLUMBIA' | 'MANITOBA' | 'NEW_BRUNSWICK' | 'NEWFOUNDLAND' | 'NOVA_SCOTIA' | 'PRINCE_EDWARD_ISLAND' | 'ONTARIO' | 'QUEBEC' | 'SASKATCHEWAN' | 'NORTHWEST_TERRITORIES' | 'NUNAVUT' | 'YUKON';
export declare const PROVINCIAL_CODES: {
    [key in ProvinceName]: ProvinceCode;
};
export declare const FEDERAL_CODE: FederalCode;
export type ByProvince<T> = {
    [key in ProvinceCode]: T;
};
export type ByJurisdiction<T> = {
    [key in ProvinceCode | FederalCode]: T;
};
```

## misc/consumer-price-index.d.ts
```ts
interface MonthlyConsumerPriceIndex {
    JAN: number;
    FEB: number;
    MAR: number;
    APR: number;
    MAY: number;
    JUN: number;
    JUL: number;
    AUG: number;
    SEP: number;
    OCT: number;
    NOV: number;
    DEC: number;
}
export interface ConsumerPriceIndex {
    2009: MonthlyConsumerPriceIndex;
    2010: MonthlyConsumerPriceIndex;
    2011: MonthlyConsumerPriceIndex;
    2012: MonthlyConsumerPriceIndex;
    2013: MonthlyConsumerPriceIndex;
    2014: MonthlyConsumerPriceIndex;
    2015: MonthlyConsumerPriceIndex;
    2016: MonthlyConsumerPriceIndex;
    2017: MonthlyConsumerPriceIndex;
    2018: MonthlyConsumerPriceIndex;
    2019: MonthlyConsumerPriceIndex;
    2020: MonthlyConsumerPriceIndex;
    2021: MonthlyConsumerPriceIndex;
    2022: MonthlyConsumerPriceIndex;
    2023: MonthlyConsumerPriceIndex;
    2024: MonthlyConsumerPriceIndex;
}
export declare const CONSUMER_PRICE_INDEX: ConsumerPriceIndex;
export {};
```

## misc/index.d.ts
```ts
export * from './code-types';
export * from './consumer-price-index';
export * from './ipf-stats';
export * from './life-expectancy';
export * from './ppp-increase-factor';
```

## misc/ipf-stats.d.ts
```ts
export interface ReturnRates {
    SHORT_TERM: number;
    FIXED_INCOME: number;
    CANADIAN_EQUITIES: number;
    US_EQUITIES: number;
    /** @deprecated Use FOREIGN_DEVELOPED_MARKET_EQUITIES instead. Will be removed in a future version. */
    INTL_DEVELOPED_MARKET_EQUITIES: number;
    FOREIGN_DEVELOPED_MARKET_EQUITIES: number;
    EMERGING_MARKET_EQUITIES: number;
    CONSERVATIVE_PORTFOLIO: number;
    BALANCED_PORTFOLIO: number;
    DYNAMIC_PORTFOLIO: number;
}
export interface IPFStatistics {
    INFLATION: number;
    PERFORMANCE_RATE: number;
    YMPE_GROWTH_RATE: number;
    RETURN_RATES: ReturnRates;
    BORROWING_RATE: number;
}
export declare const IPF: IPFStatistics;
```

## misc/iqpf-stats.d.ts
```ts
export interface ReturnRates {
    SHORT_TERM: number;
    FIXED_INCOME: number;
    CANADIAN_EQUITIES: number;
    CONSERVATIVE_PORTFOLIO: number;
    BALANCED_PORTFOLIO: number;
    DYNAMIC_PORTFOLIO: number;
}
export interface IQPFStatistics {
    INFLATION: number;
    PERFORMANCE_RATE: number;
    RETURN_RATES: ReturnRates;
    BORROWING_RATE: number;
}
export declare const IQPF: IQPFStatistics;
```

## misc/life-expectancy.d.ts
```ts
export interface IndividualLifeExpectancy {
    0: number;
    5: number;
    10: number;
    15: number;
    20: number;
    25: number;
    30: number;
    35: number;
    40: number;
    45: number;
    50: number;
    55: number;
    60: number;
    65: number;
    70: number;
    75: number;
    80: number;
    85: number;
    90: number;
    95: number;
    100: number;
}
export interface CombinedLifeExpectancy {
    MALE: IndividualLifeExpectancy;
    FEMALE: IndividualLifeExpectancy;
}
export declare const LIFE_EXPECTANCY: CombinedLifeExpectancy;
```

## misc/ppp-increase-factor.d.ts
```ts
export interface PPPIncreaseFactor {
    FIRST_YEAR: number;
    SECOND_YEAR: number;
    THIRD_YEAR: number;
    FOURTH_YEAR: number;
    FIFTH_YEAR: number;
    SIXTH_YEAR: number;
    SEVENTH_YEAR: number;
}
export declare const PPP_INCREASE_FACTOR: PPPIncreaseFactor;
```

## pension/canada-pension-plan.d.ts
```ts
import { PublicPensionPlan } from './public-pension-plan';
export declare const CPP: PublicPensionPlan;
```

## pension/defined-benefit-pension-plan.d.ts
```ts
export interface DefinedBenefitPensionPlan {
    MAX_CONTRIBUTION: number;
}
export declare const DEFINED_BENEFIT: DefinedBenefitPensionPlan;
```

## pension/index.d.ts
```ts
export * from './canada-pension-plan';
export * from './old-age-security';
export * from './public-pension-plan';
export * from './quebec-pension-plan';
export * from './supplemental-pension-plan';
export * from './defined-benefit-pension-plan';
export * from './money-purchase-pension-plan';
```

## pension/money-purchase-pension-plan.d.ts
```ts
export interface MoneyPurchasePensionPlan {
    MAX_CONTRIBUTION: number;
}
export declare const MONEY_PURCHASE: MoneyPurchasePensionPlan;
```

## pension/old-age-security.d.ts
```ts
export interface Repayment {
    MAX: number;
    MIN: number;
    RATIO: number;
}
export interface OldAgeSecurity {
    INCREASE: {
        AGE: number;
        RATE: number;
        REPAYMENT_MAX: number;
    };
    MAX_AGE: number;
    MIN_AGE: number;
    AGE_OF_MAJORITY: number;
    MIN_RESIDENCY: number;
    MAX_RESIDENCY: number;
    MONTHLY_PAYMENT_MAX: number;
    MONTHLY_DELAY_BONUS: number;
    REPAYMENT: Repayment;
    getMinRequestDateFactor(birthDate: Date, requestDate: Date): number;
    getRequestDateFactor(birthDate: Date, requestDate: Date): number;
    getRepaymentMax(startOfYearAge: number): number;
    getMinimumRequestAge(yearsOutsideCanada: number): number;
    getMinimumRequestDate(birthDate: Date, yearsOutsideCanadaAtRequest: number): Date;
    validateRequestDate(requestDate: Date, birthDate: Date, yearsOutsideCanadaAtRequest: number): void;
    getResidencyYearsAtRequest(birthDate: Date, requestDate: Date, yearsOutsideCanadaAtRequest: number): number;
    getRequestDateMonthsDeferred(birthDate: Date, requestDate: Date, yearsOutsideCanadaAtRequest: number): number;
    isFullResidencyAtMinOASAge(birthDate: Date, yearsOutsideCanadaAtRequest: number): boolean;
    getMonthlyOASAmount(birthDate: Date, requestDate: Date, yearsOutsideCanadaAtRequest: number): number;
    getDeferredRequestAmount(monthsDeferred: number, ratio?: number): number;
}
export declare const OAS: OldAgeSecurity;
```

## pension/public-pension-plan.d.ts
```ts
export interface Factor {
    FROM: number;
    TO: number;
    FACTOR: number;
}
export interface PensionableEarnings {
    BASIC_EXEMPTION: number;
    YMPE: number;
    YMPE_AVG_5: number;
    YAMPE: number;
    YAMPE_AVG_5: number;
}
export interface ContributionRates {
    BASE: number;
    ENHANCEMENT_STEP_2: number;
}
export interface DeathBenefit {
    RATE: number;
}
export interface FlatBenefit {
    ORPHAN: number;
    DISABILITY: number;
    UNDER_45: number;
    UNDER_45_WITH_CHILD: number;
    UNDER_45_DISABLED: number;
    FROM_45_TO_64: number;
    OVER_64_WITHOUT_PENSION: number;
}
export type IndexationRateReferenceYear = 2007 | 2008 | 2009 | 2010 | 2011 | 2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024;
export type IndexationRateReference = [IndexationRateReferenceYear, number];
export interface MaxPension {
    RETIREMENT: number;
    COMBINED_RETIREMENT_SURVIVOR: number;
    DEATH_BENEFIT: number;
}
export interface MonthlyDelay {
    BONUS: number;
    PENALTY: number;
}
export interface SurvivorRate {
    OVER_64: number;
    UNDER_65: number;
}
export interface PublicPensionPlan {
    PENSIONABLE_EARNINGS: PensionableEarnings;
    CONTRIBUTION_RATES: ContributionRates;
    DEATH_BENEFIT: DeathBenefit;
    DEFAULT_REFERENCE_AGE: number;
    FLAT_BENEFIT: FlatBenefit;
    INDEXATION_RATE_REFERENCES: IndexationRateReference[];
    MAX_PENSION: MaxPension;
    MAX_INCOME: {
        [K: number]: number;
    };
    MAX_REQUEST_AGE: number;
    MIN_REQUEST_AGE: number;
    MONTHLY_DELAY: MonthlyDelay;
    REPLACEMENT_FACTOR: number;
    SURVIVOR_RATES: SurvivorRate;
    YEARS_TO_FULL_PENSION: number;
    getRequestDateFactor(birthDate: Date, requestDate: Date, customReferenceDate?: Date): number;
    getAverageIndexationRate(): number;
}
/**
 * Deferral/penalty factor applied to a CPP/QPP retirement pension, anchored at the reference age
 * (65 by default, or `customReferenceDate`).
 *
 * The factor is a pure function of the birth date and the request date: it does not depend on the
 * current date. For each month the request is deferred past the reference age it adds
 * `MONTHLY_DELAY.BONUS` (up to `MAX_REQUEST_AGE`); for each month before the reference age it removes
 * `MONTHLY_DELAY.PENALTY` (down to `MIN_REQUEST_AGE`).
 *
 * Returns 0 when the request date is before the minimum request age.
 */
export declare function getPublicPensionRequestDateFactor(plan: PublicPensionPlan, birthDate: Date, requestDate: Date, customReferenceDate?: Date): number;
```

## pension/quebec-pension-plan.d.ts
```ts
import { PublicPensionPlan } from './public-pension-plan';
export declare const QPP: PublicPensionPlan;
```

## pension/supplemental-pension-plan.d.ts
```ts
export interface SupplementalPensionPlan {
    MAX_BRIDGE_BENEFIT_AGE: number;
    MIN_AGE: number;
}
export declare const SPP: SupplementalPensionPlan;
```

## taxes/dividend-credit.d.ts
```ts
import { FederalCode, ProvinceCode } from '../misc';
export type DividendTaxCreditRate = {
    GROSS_UP: number;
} & {
    [key in ProvinceCode | FederalCode]: number;
};
export declare const NON_ELIGIBLE_DIVIDEND: DividendTaxCreditRate;
export declare const ELIGIBLE_DIVIDEND: DividendTaxCreditRate;
```

## taxes/employment-insurance.d.ts
```ts
export interface PremiumRate {
    CA: number;
    QC: number;
}
export interface EmploymentInsurance {
    MAX_INSURABLE_EARNINGS: number;
    PREMIUM_RATES: PremiumRate;
}
export declare const EI: EmploymentInsurance;
```

## taxes/income-tax.d.ts
```ts
import { FederalCode, ProvinceCode } from '../misc';
export interface Rate {
    FROM: number;
    TO: number;
    RATE: number;
}
export interface TaxBracket {
    ABATEMENT: number;
    TAX_CREDIT_RATE: number;
    BASIC_PERSONAL_AMOUNT: number | {
        MIN: number;
        MAX: number;
    };
    RATES: Rate[];
    SURTAX_RATES: Rate[];
}
export type TaxBrackets = {
    [key in ProvinceCode | FederalCode]: TaxBracket;
};
export declare const TAX_BRACKETS: TaxBrackets;
export declare function getTaxAmount(rates: Rate[], income: number, inflationRate: number, yearsToInflate: number): number;
export declare function getRate(brackets: Rate[], grossIncome: number, inflationRate: number, yearsToInflate: number): number;
export declare function getTaxRates(code: ProvinceCode | FederalCode): Rate[];
export declare function getFederalTaxRates(): Rate[];
export declare function getFederalBaseTaxAmount(grossIncome: number, inflationRate?: number, yearsToInflate?: number): number;
export declare function getFederalTaxCreditRate(): number;
export declare function getFederalBasicPersonalAmount(grossIncome: number, inflationRate: number, yearsToInflate: number): number;
export declare function getFederalBaseCredit(grossIncome: number, inflationRate: number, yearsToInflate: number): number;
export declare function getProvincialAbatement(province: ProvinceCode, federalTaxAmount: number): number;
export declare function getFederalTaxAmount(provincialCode: ProvinceCode, grossIncome: number, inflationRate?: number, yearsToInflate?: number, taxCredit?: number): number;
export declare function getProvincialSurtaxAmount(province: ProvinceCode, baseTaxAmount: number, inflationRate?: number, yearsToInflate?: number): number;
export declare function getProvincialBaseTaxAmount(province: ProvinceCode, grossIncome: number, inflationRate?: number, yearsToInflate?: number): number;
export declare function getProvincialBaseCredit(province: ProvinceCode, inflationRate: number, yearsToInflate: number): number;
export declare function getProvincialTaxAmount(province: ProvinceCode, grossIncome: number, inflationRate?: number, yearsToInflate?: number, taxCredit?: number): number;
export declare function getFederalMarginalRate(provincialCode: ProvinceCode, grossIncome: number, inflationRate?: number, yearsToInflate?: number): number;
export declare function getProvincialMarginalRate(provincialCode: ProvinceCode, grossIncome: number, inflationRate?: number, yearsToInflate?: number): number;
export declare function getTotalMarginalRate(provincialCode: ProvinceCode, grossIncome: number, inflationRate?: number, yearsToInflate?: number): number;
export declare function getMaxProvincialMarginalRate(provincialCode: ProvinceCode): number;
export declare function getMaxFederalMarginalRate(provincialCode: ProvinceCode): number;
export declare function getTotalMaxMarginalRate(provincialCode: ProvinceCode): number;
export declare function getTotalTaxAmount(provincialCode: ProvinceCode, grossIncome: number, inflationRate?: number, yearsToInflate?: number): number;
export declare function getEffectiveRate(province: ProvinceCode, income: number, inflationRate?: number, yearsToInflate?: number): number;
```

## taxes/index.d.ts
```ts
export * from './dividend-credit';
export * from './employment-insurance';
export * from './income-tax';
export * from './quebec-parental-insurance-plan';
```

## taxes/quebec-parental-insurance-plan.d.ts
```ts
export interface PremiumRates {
    SELF_EMPLOYED: number;
    SALARIED: number;
}
export interface QuebecParentalInsurancePlan {
    MAX_INSURABLE_EARNINGS: number;
    PREMIUM_RATES: PremiumRates;
}
export declare const QPIP: QuebecParentalInsurancePlan;
```

## utils/collections.d.ts
```ts
export declare function maxBy<T>(values: T[], mapFn: ((item: T) => number)): T | undefined;
```

## utils/date.d.ts
```ts
export declare function getMonthsDiff(firstDate: Date, secondDate: Date): number;
export declare function addYearsToDate(date: Date, years: number): Date;
export declare function now(): Date;
export declare const resetTime: (date: Date) => Date;
export declare function getAge(birthDate: Date, atDate?: Date): number;
```

## utils/index.d.ts
```ts
export * from './collections';
export * from './date';
export * from './math';
```

## utils/math.d.ts
```ts
export declare function clamp(num: number, min: number, max: number): number;
export declare function roundToPrecision(value: number, precision?: number): number;
```

