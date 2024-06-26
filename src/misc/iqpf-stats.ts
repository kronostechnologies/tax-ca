/*
 Sources
 https://institutpf.org/assets/Documents/Normes-projection/InstitutPF-NHP-2024.pdf
 Revised
 2023-04-25
 */

export interface ReturnRates {
    SHORT_TERM: number;
    FIXED_INCOME: number;
    CANADIAN_EQUITIES: number;
    CONSERVATIVE_PORTFOLIO: number;
    BALANCED_PORTFOLIO: number;
    DYNAMIC_PORTFOLIO: number;
}

export interface IQPFStatistics {
    INFLATION: number;
    PERFORMANCE_RATE: number;
    RETURN_RATES: ReturnRates;
    BORROWING_RATE: number;
}

export const IQPF: IQPFStatistics = {
    INFLATION: 0.021,
    PERFORMANCE_RATE: 0.01,
    RETURN_RATES: {
        SHORT_TERM: 0.024,
        FIXED_INCOME: 0.034,
        CANADIAN_EQUITIES: 0.064,
        CONSERVATIVE_PORTFOLIO: 0.028,
        BALANCED_PORTFOLIO: 0.035,
        DYNAMIC_PORTFOLIO: 0.045,
    },
    BORROWING_RATE: 0.044,
};
