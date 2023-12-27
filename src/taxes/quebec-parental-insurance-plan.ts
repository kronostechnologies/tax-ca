/*
Sources
    https://www.rqap.gouv.qc.ca/fr/a-propos-du-regime/information-generale/cotisations-et-revenu-maximal-assurable

Revised
    2023-12-27
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
    MAX_INSURABLE_EARNINGS: 94000,
    PREMIUM_RATES: {
        SELF_EMPLOYED: 0.00878,
        SALARIED: 0.00494,
    },
};
