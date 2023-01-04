/*
Sources
    https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html

Revised
    2023-01-03
 */

export interface TaxFreeSavingsAccount {
    MAX_CONTRIBUTION: number;
    UNROUNDED_MAX_CONTRIBUTION: number;
    ROUNDING_FACTOR: number;
    UPDATE_YEAR: number;
}

export const TFSA: TaxFreeSavingsAccount = {
    MAX_CONTRIBUTION: 6500,
    /**
     * Latest unrounded contribution change that changed rounded factor bracket
     * (6500 -> 6500, but 2024 will be ~6637 -> 6500)
     */
    UNROUNDED_MAX_CONTRIBUTION: 6500,
    ROUNDING_FACTOR: 500,
    UPDATE_YEAR: 2023,
};
