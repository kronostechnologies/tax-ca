export interface Factor {
    FROM: number;
    TO: number;
    FACTOR: number;
}

export interface Rate {
    FROM: number;
    TO: number;
    RATE: number;
}

export interface PensionableEarnings {
    MAX: number;
    MIN: number;
    AVG_MAX: number;
    SUP_MAX: number;
    SUP_FACTORS: Factor[];
}

export interface Rates {
    BASE: number;
    ENHANCEMENT_STEP_1: Rate[];
    ENHANCEMENT_STEP_2: number;
}

export interface Contributions {
    PENSIONABLE_EARNINGS: PensionableEarnings;
    RATES: Rates;
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

export type IndexationRateReference = [number, number];

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
    CONTRIBUTIONS: Contributions;
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
    getRequestDateFactor(a: Date, b: Date): number;
    getAverageIndexationRate(): number;
}
