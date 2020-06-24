// tslint:disable:max-line-length
/*
Sources:
	https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html
	http://www.rrq.gouv.qc.ca/SiteCollectionDocuments/www.rrq.gouv.qc/Francais/pdf/rcr/annexe06.pdf

Revised 2019-12-23
*/
// tslint:enable:max-line-length

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
        MIN: 55,
        MAX: 71,
    },
    MAX_CONTRIBUTION: 27230,
};
