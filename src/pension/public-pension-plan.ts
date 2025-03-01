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

export type IndexationRateReferenceYear =
    2007
    | 2008
    | 2009
    | 2010
    | 2011
    | 2012
    | 2013
    | 2014
    | 2015
    | 2016
    | 2017
    | 2018
    | 2019
    | 2020
    | 2021
    | 2022
    | 2023
    | 2024;
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
    PENSIONABLE_EARNINGS: PensionableEarnings,
    CONTRIBUTION_RATES: ContributionRates,
    DEATH_BENEFIT: DeathBenefit;
    DEFAULT_REFERENCE_AGE: number;
    FLAT_BENEFIT: FlatBenefit;
    INDEXATION_RATE_REFERENCES: IndexationRateReference[];
    MAX_PENSION: MaxPension;
    MAX_INCOME: { [K: number]: number };
    MAX_REQUEST_AGE: number;
    MIN_REQUEST_AGE: number;
    MONTHLY_DELAY: MonthlyDelay;
    REPLACEMENT_FACTOR: number;
    SURVIVOR_RATES: SurvivorRate;
    YEARS_TO_FULL_PENSION: number;

    getRequestDateFactor(birthDate: Date, requestDate: Date, customReferenceDate?: Date): number;

    getAverageIndexationRate(): number;
}
