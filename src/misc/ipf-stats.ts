/*
Sources
https://institutpf.org/assets/Documents/Normes-projection/InstitutPF-NHP-feuillet_fr.pdf

Revised
2026-04-23
*/

export interface ReturnRates {
    SHORT_TERM: number;
    FIXED_INCOME: number;
    CANADIAN_EQUITIES: number;
    US_EQUITIES: number;
    /** @deprecated Use FOREIGN_DEVELOPED_MARKET_EQUITIES instead. Will be removed in a future version. */
    INTL_DEVELOPED_MARKET_EQUITIES: number;
    FOREIGN_DEVELOPED_MARKET_EQUITIES: number;
    EMERGING_MARKET_EQUITIES: number;
    CONSERVATIVE_PORTFOLIO: number;
    BALANCED_PORTFOLIO: number;
    DYNAMIC_PORTFOLIO: number;
}

export interface IPFStatistics {
    INFLATION: number;
    PERFORMANCE_RATE: number;
    YMPE_GROWTH_RATE: number;
    RETURN_RATES: ReturnRates;
    BORROWING_RATE: number;
}

export const IPF: IPFStatistics = {
    INFLATION: 0.021,
    PERFORMANCE_RATE: 0.01,
    YMPE_GROWTH_RATE: 0.031,
    RETURN_RATES: {
        SHORT_TERM: 0.024,
        FIXED_INCOME: 0.032,
        CANADIAN_EQUITIES: 0.063,
        US_EQUITIES: 0.064,
        INTL_DEVELOPED_MARKET_EQUITIES: 0.065,
        FOREIGN_DEVELOPED_MARKET_EQUITIES: 0.065,
        EMERGING_MARKET_EQUITIES: 0.075,
        CONSERVATIVE_PORTFOLIO: 0.027,
        BALANCED_PORTFOLIO: 0.034,
        DYNAMIC_PORTFOLIO: 0.044,
    },
    BORROWING_RATE: 0.044,
};
