/*
 Sources
 https://www.canada.ca/en/services/benefits/education/education-savings/estimating-amounts.html#_clb_income

 Last updated
 2025-12-21
 */

const LOW_INCOME_THRESHOLD = 57375;
const MEDIUM_INCOME_THRESHOLD = 114750;

export enum IncomeLevelType {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

export interface IncomeLevel {
    LOW_INCOME_THRESHOLD: number;
    MEDIUM_INCOME_THRESHOLD: number;
    getIncomeLevel(income: number): IncomeLevelType;
}

const getIncomeLevel = (income: number): IncomeLevelType => {
    if (income <= LOW_INCOME_THRESHOLD) {
        return IncomeLevelType.LOW;
    }

    if (income <= MEDIUM_INCOME_THRESHOLD) {
        return IncomeLevelType.MEDIUM;
    }

    return IncomeLevelType.HIGH;
};

export const IncomeLevel: IncomeLevel = {
    LOW_INCOME_THRESHOLD,
    MEDIUM_INCOME_THRESHOLD,
    getIncomeLevel,
};
