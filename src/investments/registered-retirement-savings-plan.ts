/*
Sources
    https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html

Note
    Must use RRSP dollar limit and not DB limit

Revised
    2023-12-28
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
    MAX_CONTRIBUTION: 31560,
};
