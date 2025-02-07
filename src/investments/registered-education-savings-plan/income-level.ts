/*
 Sources
 https://www.canada.ca/fr/services/prestations/education/epargne-etudes/estimation-montants.html?utm_source=chatgpt.com#_faible-rev

 Last updated
 2025-02-07
 */

const LOW_INCOME_THRESHOLD = 55867;
const MEDIUM_INCOME_THRESHOLD = 111735;

export const enum IncomeLevelType {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}

export interface IncomeLevel {
    LOW_INCOME_THRESHOLD: number;
    MEDIUM_INCOME_THRESHOLD: number;
    getIncomeLevel(income: number): IncomeLevelType;
}

const getIncomeLevel = (income: number): IncomeLevelType => {
    if (income <= LOW_INCOME_THRESHOLD) {
        return IncomeLevelType.Low;
    }

    if (income <= MEDIUM_INCOME_THRESHOLD) {
        return IncomeLevelType.Medium;
    }

    return IncomeLevelType.High;
};

export const IncomeLevel: IncomeLevel = {
    LOW_INCOME_THRESHOLD,
    MEDIUM_INCOME_THRESHOLD,
    getIncomeLevel,
};
