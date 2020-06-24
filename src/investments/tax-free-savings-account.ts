// tslint:disable:max-line-length
/*
Sources:
	https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html

Revised 2019-12-23
*/
// tslint:enable:max-line-length

export interface TaxFreeSavingsAccount {
    MAX_CONTRIBUTION: number;
    ROUNDING_FACTOR: number;
}

export const TFSA: TaxFreeSavingsAccount = {
    MAX_CONTRIBUTION: 6000,
    ROUNDING_FACTOR: 500,
};
