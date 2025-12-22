/*
Sources
    https://www.canada.ca/en/employment-social-development/programs/ei/ei-list/ei-employers/premium-reduction-program/2026-maximum-insurable-earnings.html

Notes
    The URL is based on a specific year.

Revised
    2025-12-22
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
    MAX_INSURABLE_EARNINGS: 68900,
    PREMIUM_RATES: {
        CA: 0.0163,
        QC: 0.013,
    },
};
