/*
Sources
    https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html

Revised
    2023-12-27
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
     * (7000 -> 7000, but 2025 will be ~7147 -> 7000)
     */
    UNROUNDED_MAX_CONTRIBUTION: 7000,
    ROUNDING_FACTOR: 500,
    UPDATE_YEAR: 2024,
};
