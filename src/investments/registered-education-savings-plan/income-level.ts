const lowIncomeThreshold = 55867;
const mediumIncomeThreshold = 111735;

export const enum IncomeLevel {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}

export const getIncomeLevel = (income: number): IncomeLevel => {
    if(income <= lowIncomeThreshold) {
        return IncomeLevel.Low;
    } else if (income > lowIncomeThreshold && income <= mediumIncomeThreshold) {
        return IncomeLevel.Medium;
    } else {
        return IncomeLevel.High;
    }
}
