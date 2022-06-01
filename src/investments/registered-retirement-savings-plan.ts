/*
 Sources
 https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html

 Revised
 2021-12-21
 */

export interface ConversionAge {
    MIN: number;
    MAX: number;
}

export interface RegisteredRetirementSavingsPlan {
    CONVERSION_AGE: ConversionAge;
    MAX_CONTRIBUTION: number;
}

export const RRSP: RegisteredRetirementSavingsPlan = {
    CONVERSION_AGE: {
        MIN: 0,
        MAX: 71,
    },
    MAX_CONTRIBUTION: 29210,
};
