import { IncomeLevel, IncomeLevelType } from './income-level';

export interface CanadaLearningBond {
    OPENING_YEAR_CLB: number;
    YEARLY_CLB: number;
    MAX_BENEFICIARY_AGE: number;
    getTotalForAYear(income: number, beneficiaryAge?: number, accountOpeningYear?: boolean): number;
}

export interface CanadaLearningBondData {
    OPENING_YEAR_CLB: number;
    YEARLY_CLB: number;
    MAX_BENEFICIARY_AGE: number;
}

const canadaLearningBondData: CanadaLearningBondData = {
    OPENING_YEAR_CLB: 500,
    YEARLY_CLB: 100,
    MAX_BENEFICIARY_AGE: 15,
};

const getTotalForAYear = (income: number, beneficiaryAge: number = 0, accountOpeningYear: boolean = false): number => {
    let total = 0;
    const { MAX_BENEFICIARY_AGE, OPENING_YEAR_CLB, YEARLY_CLB } = canadaLearningBondData;

    const incomeLevel = IncomeLevel.getIncomeLevel(income);
    if (incomeLevel === IncomeLevelType.LOW && beneficiaryAge <= MAX_BENEFICIARY_AGE) {
        total = accountOpeningYear ? OPENING_YEAR_CLB : YEARLY_CLB;
    }

    return total;
};

export const CanadaLearningBond: CanadaLearningBond = {
    ...canadaLearningBondData,
    getTotalForAYear,
};
