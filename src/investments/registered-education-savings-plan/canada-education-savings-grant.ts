import { getIncomeLevel, IncomeLevel } from './income-level';

const CESGMaximumAmountForGrant = 2500;
const CESGGrantPercent = 20/100;

const CESGMaximumAmountForSuppGrant = 500;
const CESGSuppGrantPercentForLowIncome = 20/100;
const CESGSuppGrantPercentForMediumIncome = 10/100;

const getCESGBaseGrant = (contribution: number): number => {
    let totalGrantForAYear: number = 0;
    if (contribution > CESGMaximumAmountForGrant) {
        totalGrantForAYear = CESGGrantPercent * CESGMaximumAmountForGrant;
    } else {
        totalGrantForAYear = CESGGrantPercent * contribution;
    }

    return totalGrantForAYear;
}

const getCESGSuppGrant = (contribution: number, baseGrant: number, incomeLevel: IncomeLevel): number => {
    if (incomeLevel === IncomeLevel.Low) {
        if (contribution > CESGMaximumAmountForSuppGrant) {
            baseGrant += CESGSuppGrantPercentForLowIncome * CESGMaximumAmountForSuppGrant;
        } else {
            baseGrant += CESGSuppGrantPercentForLowIncome * contribution;
        }
    } else if (incomeLevel === IncomeLevel.Medium) {
        if (contribution > CESGMaximumAmountForSuppGrant) {
            baseGrant += CESGSuppGrantPercentForMediumIncome * CESGMaximumAmountForSuppGrant;
        } else {
            baseGrant += CESGSuppGrantPercentForMediumIncome * contribution;
        }
    }

    return baseGrant;
}

export const getTotalCESGForAYear = (income: number, contribution: number, totalGrantAlreadyGiven: number = 0, beneficiaryAge: number = 0): number => {
    if(totalGrantAlreadyGiven >= 7200 || beneficiaryAge > 17) return 0;

    //Grant
    let totalGrantForAYear = getCESGBaseGrant(contribution);

    //Supp. grant
    const incomeLevel = getIncomeLevel(income);
    totalGrantForAYear = getCESGSuppGrant(contribution, totalGrantForAYear, incomeLevel);

    return totalGrantForAYear;
}
