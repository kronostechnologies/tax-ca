/*
Sources
    https://www.rqap.gouv.qc.ca/fr/a-propos-du-regime/information-generale/cotisations-et-revenu-maximal-assurable

Revised
    2025-12-22
*/

export interface PremiumRates {
    SELF_EMPLOYED: number;
    SALARIED: number;
}

export interface QuebecParentalInsurancePlan {
    MAX_INSURABLE_EARNINGS: number;
    PREMIUM_RATES: PremiumRates;
}

export const QPIP: QuebecParentalInsurancePlan = {
    MAX_INSURABLE_EARNINGS: 103000,
    PREMIUM_RATES: {
        SELF_EMPLOYED: 0.00764,
        SALARIED: 0.0043,
    },
};
