/*
 Sources
 https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/registered-education-savings-plans-resps/canada-education-savings-programs-cesp/canada-education-savings-grant-cesg.html

 Last updated
 2025-02-07
 */

import { IncomeLevel, IncomeLevelType } from './income-level';

export interface SuppGrantPercent {
    LOW_INCOME: number;
    MEDIUM_INCOME: number;
}

export interface CanadaEducationSavingsGrant {
    MAX_GRANT: number;
    MAX_BENEFICIARY_AGE: number;
    MAX_AMOUNT_YEARLY_FOR_GRANT: number;
    YEARLY_GRANT_PERCENT: number;
    MAX_AMOUNT_FOR_SUPP_GRANT: number;
    SUPP_GRANT_PERCENT: SuppGrantPercent
    getTotalForAYear(
        income: number,
        contribution: number,
        totalGrantAlreadyGiven?: number,
        beneficiaryAge?: number
    ): number;
}

const MAX_GRANT = 7200;
const MAX_BENEFICIARY_AGE = 17;
const MAX_AMOUNT_YEARLY_FOR_GRANT = 2500;
const YEARLY_GRANT_PERCENT = 0.2;

const MAX_AMOUNT_FOR_SUPP_GRANT = 500;
const SUPP_GRANT_PERCENT: SuppGrantPercent = {
    LOW_INCOME: 0.2,
    MEDIUM_INCOME: 0.1,
};

const getBaseGrant = (contribution: number): number => {
    let totalGrantForAYear: number = 0;
    if (contribution > MAX_AMOUNT_YEARLY_FOR_GRANT) {
        totalGrantForAYear = YEARLY_GRANT_PERCENT * MAX_AMOUNT_YEARLY_FOR_GRANT;
    } else {
        totalGrantForAYear = YEARLY_GRANT_PERCENT * contribution;
    }

    return totalGrantForAYear;
};

const getSuppGrant = (contribution: number, incomeLevel: IncomeLevelType): number => {
    let suppGrant = 0;

    switch (incomeLevel) {
        case IncomeLevelType.LOW:
            if (contribution > MAX_AMOUNT_FOR_SUPP_GRANT) {
                suppGrant = SUPP_GRANT_PERCENT.LOW_INCOME * MAX_AMOUNT_FOR_SUPP_GRANT;
            } else {
                suppGrant = SUPP_GRANT_PERCENT.LOW_INCOME * contribution;
            }
            break;
        case IncomeLevelType.MEDIUM:
            if (contribution > MAX_AMOUNT_FOR_SUPP_GRANT) {
                suppGrant = SUPP_GRANT_PERCENT.MEDIUM_INCOME * MAX_AMOUNT_FOR_SUPP_GRANT;
            } else {
                suppGrant = SUPP_GRANT_PERCENT.MEDIUM_INCOME * contribution;
            }
            break;
    }

    return suppGrant;
};

const getTotalForAYear = (
    income: number,
    contribution: number,
    totalGrantAlreadyGiven: number = 0,
    beneficiaryAge: number = 0,
): number => {
    if (totalGrantAlreadyGiven >= MAX_GRANT || beneficiaryAge > MAX_BENEFICIARY_AGE) return 0;

    // Grant
    let totalGrantForAYear = getBaseGrant(contribution);

    // Supp. grant
    const incomeLevel = IncomeLevel.getIncomeLevel(income);
    totalGrantForAYear += getSuppGrant(contribution, incomeLevel);

    return totalGrantForAYear;
};

export const CanadaEducationSavingsGrant: CanadaEducationSavingsGrant = {
    MAX_GRANT,
    MAX_BENEFICIARY_AGE,
    MAX_AMOUNT_YEARLY_FOR_GRANT,
    YEARLY_GRANT_PERCENT,
    MAX_AMOUNT_FOR_SUPP_GRANT,
    SUPP_GRANT_PERCENT,
    getTotalForAYear,
};
