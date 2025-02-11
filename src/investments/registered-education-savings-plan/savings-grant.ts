import { IncomeLevel, IncomeLevelType } from './income-level';

export interface SuppGrantPercent {
    LOW_INCOME: number;
    MEDIUM_INCOME: number;
}
export interface SavingsGrant {
    MAX_GRANT: number;
    MAX_BENEFICIARY_AGE: number;
    MAX_AMOUNT_YEARLY_FOR_GRANT: number;
    YEARLY_GRANT_PERCENT: number;
    MAX_AMOUNT_FOR_SUPP_GRANT: number;
    SUPP_GRANT_PERCENT: SuppGrantPercent;
    getBaseGrant(contribution: number): number;
    getSuppGrant(contribution: number, incomeLevel: IncomeLevelType): number;
    getTotalForAYear(
        income: number,
        contribution: number,
        totalGrantAlreadyGiven?: number,
        beneficiaryAge?: number
    ): number;
}

export function initializeSavingsGrant(
    MAX_GRANT: number,
    MAX_BENEFICIARY_AGE: number,
    MAX_AMOUNT_YEARLY_FOR_GRANT: number,
    YEARLY_GRANT_PERCENT: number,
    MAX_AMOUNT_FOR_SUPP_GRANT: number,
    SUPP_GRANT_PERCENT: { LOW_INCOME: number; MEDIUM_INCOME: number; },
): SavingsGrant {
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

    return {
        MAX_AMOUNT_FOR_SUPP_GRANT,
        MAX_AMOUNT_YEARLY_FOR_GRANT,
        MAX_BENEFICIARY_AGE,
        MAX_GRANT,
        SUPP_GRANT_PERCENT,
        YEARLY_GRANT_PERCENT,
        getBaseGrant,
        getSuppGrant,
        getTotalForAYear,
    };
}
