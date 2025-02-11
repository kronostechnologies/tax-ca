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

export interface SavingsGrantConfig {
    MAX_GRANT: number;
    MAX_BENEFICIARY_AGE: number;
    MAX_AMOUNT_YEARLY_FOR_GRANT: number;
    YEARLY_GRANT_PERCENT: number;
    MAX_AMOUNT_FOR_SUPP_GRANT: number;
    SUPP_GRANT_PERCENT: SuppGrantPercent;
}

export function initializeSavingsGrant(SavingsGrantConfig: SavingsGrantConfig): SavingsGrant {
    const {
        MAX_GRANT,
        MAX_BENEFICIARY_AGE,
        MAX_AMOUNT_YEARLY_FOR_GRANT,
        YEARLY_GRANT_PERCENT,
        SUPP_GRANT_PERCENT,
        MAX_AMOUNT_FOR_SUPP_GRANT,
    } = SavingsGrantConfig;

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
        const cappedContribution = Math.min(contribution, MAX_AMOUNT_FOR_SUPP_GRANT);

        switch (incomeLevel) {
            case IncomeLevelType.LOW:
                suppGrant = SUPP_GRANT_PERCENT.LOW_INCOME * cappedContribution;
                break;
            case IncomeLevelType.MEDIUM:
                suppGrant = SUPP_GRANT_PERCENT.MEDIUM_INCOME * cappedContribution;
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
