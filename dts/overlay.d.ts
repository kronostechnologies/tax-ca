// Hand-maintained TypeScript declaration overlay, appended to the Kotlin-generated
// tax-ca.d.ts by the `jsNodeProductionLibraryDistribution` task (see build.gradle.kts).
//
// The facade exports all data as plain JS objects (real consumers spread and mutate
// them), so the Kotlin compiler types them `any`; the build patches each declaration to
// the types below. This section is extracted VERBATIM from the legacy package's
// declaration files (the npm compatibility contract, docs/kmp-migration/api-baseline.md)
// - if a yearly revision changes a shape, update the matching interface here.

export interface MaxWithdrawalPctByAge {
    [key: number]: number;
}

export interface SmallBalanceUnlockingRule {
    minAge: number | null;
    getThresholdPct: (age: number) => number;
}

export interface ConversionRule {
    minimumAge: number;
    maximumAge: number;
}

export interface Beneficiary {
    MAX_AGE: number;
}

export interface BritishColumbiaTrainingAndEducationSavingsGrant {
    BENEFICIARY_AGE_ALLOCATION: number;
    MAX_GRANT: number;
    getTotalForAYear: (beneficiaryAge: number) => number;
}

export interface BritishColumbiaTrainingAndEducationSavingsGrantData {
    BENEFICIARY_AGE_ALLOCATION: number;
    MAX_GRANT: number;
}

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

export interface TuitionFees {
    TuitionFeesData: ByProvince<number>;
    getTuitionFeesByProvinceCode(provinceCode: ProvinceCode): number;
}

export interface RegisteredRetirementIncomeFund {
    MIN_WITHDRAWAL_PCT: {
        [K: number]: number;
    };
}

export interface ConversionAge {
    MIN: number;
    MAX: number;
}

export interface RegisteredRetirementSavingsPlan {
    CONVERSION_AGE: ConversionAge;
    MAX_CONTRIBUTION: number;
}

export interface TaxFreeSavingsAccount {
    MAX_CONTRIBUTION: number;
    UNROUNDED_MAX_CONTRIBUTION: number;
    ROUNDING_FACTOR: number;
    UPDATE_YEAR: number;
}

export type ProvinceCode = 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'PE' | 'ON' | 'QC' | 'SK' | 'NT' | 'NU' | 'YT';

export type FederalCode = 'CA';

export type FederalName = 'CANADA';

export type ProvinceName = 'ALBERTA' | 'BRITISH_COLUMBIA' | 'MANITOBA' | 'NEW_BRUNSWICK' | 'NEWFOUNDLAND' | 'NOVA_SCOTIA' | 'PRINCE_EDWARD_ISLAND' | 'ONTARIO' | 'QUEBEC' | 'SASKATCHEWAN' | 'NORTHWEST_TERRITORIES' | 'NUNAVUT' | 'YUKON';

export type ByProvince<T> = {
    [key in ProvinceCode]: T;
};

export type ByJurisdiction<T> = {
    [key in ProvinceCode | FederalCode]: T;
};

export interface MonthlyConsumerPriceIndex {
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

export interface PPPIncreaseFactor {
    FIRST_YEAR: number;
    SECOND_YEAR: number;
    THIRD_YEAR: number;
    FOURTH_YEAR: number;
    FIFTH_YEAR: number;
    SIXTH_YEAR: number;
    SEVENTH_YEAR: number;
}

export interface DefinedBenefitPensionPlan {
    MAX_CONTRIBUTION: number;
}

export interface MoneyPurchasePensionPlan {
    MAX_CONTRIBUTION: number;
}

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

export interface SupplementalPensionPlan {
    MAX_BRIDGE_BENEFIT_AGE: number;
    MIN_AGE: number;
}

export type DividendTaxCreditRate = {
    GROSS_UP: number;
} & {
    [key in ProvinceCode | FederalCode]: number;
};

export interface PremiumRate {
    CA: number;
    QC: number;
}

export interface EmploymentInsurance {
    MAX_INSURABLE_EARNINGS: number;
    PREMIUM_RATES: PremiumRate;
}

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

export interface PremiumRates {
    SELF_EMPLOYED: number;
    SALARIED: number;
}

export interface QuebecParentalInsurancePlan {
    MAX_INSURABLE_EARNINGS: number;
    PREMIUM_RATES: PremiumRates;
}
