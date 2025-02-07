/*
 Sources
 https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/registered-education-savings-plans-resps/canada-education-savings-programs-cesp/canada-education-savings-grant-cesg.html

 Last updated
 2025-02-07
 */

import { IncomeLevel, IncomeLevelType } from './income-level';

export interface CanadaEducationSavingsGrant {
    MAXIMUM_AMOUNT_YEARLY_FOR_GRANT: number;
    YEARLY_GRANT_PERCENT: number;
    MAX_AMOUNT_FOR_SUPP_GRANT: number;
    SUPP_GRANT_PERCENT_FOR_LOW_INCOME: number;
    SUPP_GRANT_PERCENT_FOR_MEDIUM_INCOME: number;
    getTotalForAYear(
        income: number,
        contribution: number,
        totalGrantAlreadyGiven?: number,
        beneficiaryAge?: number
    ): number;
}

const MAXIMUM_AMOUNT_YEARLY_FOR_GRANT = 2500;
const YEARLY_GRANT_PERCENT = 0.2;

const MAX_AMOUNT_FOR_SUPP_GRANT = 500;
const SUPP_GRANT_PERCENT_FOR_LOW_INCOME = 0.2;
const SUPP_GRANT_PERCENT_FOR_MEDIUM_INCOME = 0.1;

const getBaseGrant = (contribution: number): number => {
    let totalGrantForAYear: number = 0;
    if (contribution > MAXIMUM_AMOUNT_YEARLY_FOR_GRANT) {
        totalGrantForAYear = YEARLY_GRANT_PERCENT * MAXIMUM_AMOUNT_YEARLY_FOR_GRANT;
    } else {
        totalGrantForAYear = YEARLY_GRANT_PERCENT * contribution;
    }

    return totalGrantForAYear;
};

const getSuppGrant = (contribution: number, baseGrant: number, incomeLevel: IncomeLevelType): number => {
    let suppGrant = baseGrant;

    if (incomeLevel === IncomeLevelType.Low) {
        if (contribution > MAX_AMOUNT_FOR_SUPP_GRANT) {
            suppGrant = SUPP_GRANT_PERCENT_FOR_LOW_INCOME * MAX_AMOUNT_FOR_SUPP_GRANT;
        } else {
            suppGrant = SUPP_GRANT_PERCENT_FOR_LOW_INCOME * contribution;
        }
    } else if (incomeLevel === IncomeLevelType.Medium) {
        if (contribution > MAX_AMOUNT_FOR_SUPP_GRANT) {
            suppGrant = SUPP_GRANT_PERCENT_FOR_MEDIUM_INCOME * MAX_AMOUNT_FOR_SUPP_GRANT;
        } else {
            suppGrant = SUPP_GRANT_PERCENT_FOR_MEDIUM_INCOME * contribution;
        }
    }

    return suppGrant;
};

const getTotalForAYear = (
    income: number,
    contribution: number,
    totalGrantAlreadyGiven: number = 0,
    beneficiaryAge: number = 0,
): number => {
    if (totalGrantAlreadyGiven >= 7200 || beneficiaryAge > 17) return 0;

    // Grant
    let totalGrantForAYear = getBaseGrant(contribution);

    // Supp. grant
    const incomeLevel = IncomeLevel.getIncomeLevel(income);
    totalGrantForAYear += getSuppGrant(contribution, totalGrantForAYear, incomeLevel);

    return totalGrantForAYear;
};

export const CanadaEducationSavingsGrant: CanadaEducationSavingsGrant = {
    MAXIMUM_AMOUNT_YEARLY_FOR_GRANT,
    YEARLY_GRANT_PERCENT,
    MAX_AMOUNT_FOR_SUPP_GRANT,
    SUPP_GRANT_PERCENT_FOR_LOW_INCOME,
    SUPP_GRANT_PERCENT_FOR_MEDIUM_INCOME,
    getTotalForAYear,
};
