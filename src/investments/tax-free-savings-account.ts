// tslint:disable:max-line-length
/*
Sources
	https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html

Revised
  2021-12-21
*/
// tslint:enable:max-line-length

export interface TaxFreeSavingsAccount {
    MAX_CONTRIBUTION: number;
    UNROUNDED_MAX_CONTRIBUTION: number;
    ROUNDING_FACTOR: number;
    UPDATE_YEAR: number;
}

export const TFSA: TaxFreeSavingsAccount = {
    MAX_CONTRIBUTION: 6000,
    // Lastest unrounded contribution change that changed rounded factor bracket (5847.32 -> 6000)
    UNROUNDED_MAX_CONTRIBUTION: 5850,
    ROUNDING_FACTOR: 500,
    UPDATE_YEAR: 2019,
};
