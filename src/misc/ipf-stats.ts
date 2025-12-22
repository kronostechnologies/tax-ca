/*
Sources
    https://institutpf.org/assets/Documents/Normes-projection/InstitutPF-NHP-feuillet_fr.pdf
 
Revised
    2025-04-25
 */

export interface ReturnRates {
    SHORT_TERM: number;
    FIXED_INCOME: number;
    CANADIAN_EQUITIES: number;
    US_EQUITIES: number;
    INTL_DEVELOPED_MARKET_EQUITIES: number;
    EMERGING_MARKET_EQUITIES: number;
    CONSERVATIVE_PORTFOLIO: number;
    BALANCED_PORTFOLIO: number;
    DYNAMIC_PORTFOLIO: number;
}

export interface IPFStatistics {
    INFLATION: number;
    PERFORMANCE_RATE: number;
    RETURN_RATES: ReturnRates;
    BORROWING_RATE: number;
}

export const IPF: IPFStatistics = {
    INFLATION: 0.021,
    PERFORMANCE_RATE: 0.01,
    RETURN_RATES: {
        SHORT_TERM: 0.024,
        FIXED_INCOME: 0.034,
        CANADIAN_EQUITIES: 0.066,
        US_EQUITIES: 0.066,
        INTL_DEVELOPED_MARKET_EQUITIES: 0.069,
        EMERGING_MARKET_EQUITIES: 0.08,
        CONSERVATIVE_PORTFOLIO: 0.028,
        BALANCED_PORTFOLIO: 0.035,
        DYNAMIC_PORTFOLIO: 0.045,
    },
    BORROWING_RATE: 0.044,
};
