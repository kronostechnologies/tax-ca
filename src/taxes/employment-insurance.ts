/*
 Sources
 https://www.canada.ca/en/employment-social-development/programs/ei/ei-list/ei-employers/2022-maximum-insurable-earnings.html

 Revised
 2021-12-22
 */

export interface PremiumRate {
    CA: number;
    QC: number;
}

export interface EmploymentInsurance {
    MAX_INSURABLE_EARNINGS: number;
    PREMIUM_RATES: PremiumRate;
}

export const EI: EmploymentInsurance = {
    MAX_INSURABLE_EARNINGS: 60300,
    PREMIUM_RATES: {
        CA: 0.0158,
        QC: 0.0120,
    },
};
