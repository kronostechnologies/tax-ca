/*
Sources
    https://www.canada.ca/en/employment-social-development/programs/ei/ei-list/ei-employers/2023-maximum-insurable-earnings.html

Notes
    The URL is based on a specific year.

Revised
    2023-01-03
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
    MAX_INSURABLE_EARNINGS: 61500,
    PREMIUM_RATES: {
        CA: 0.0163,
        QC: 0.0127,
    },
};
