/*
Sources
    https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html
    https://www.taxtips.ca/tfsa/tfsa-contribution-rules-and-limits.htm

Revised
    2024-12-23
 */

export interface TaxFreeSavingsAccount {
    MAX_CONTRIBUTION: number;
    UNROUNDED_MAX_CONTRIBUTION: number;
    ROUNDING_FACTOR: number;
    UPDATE_YEAR: number;
}

export const TFSA: TaxFreeSavingsAccount = {
    MAX_CONTRIBUTION: 7000,
    /**
     * Latest unrounded contribution change that changed rounded factor bracket
     * (6751 -> 7000, but 2025 will be ~6893 -> 7000)
     */
    UNROUNDED_MAX_CONTRIBUTION: 6893,
    ROUNDING_FACTOR: 500,
    UPDATE_YEAR: 2024,
};
