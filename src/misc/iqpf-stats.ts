/*
 Sources
 https://www.iqpf.org/docs/default-source/outils/iqpf-normes-projection2023.pdf

 Revised
 2023-04-30
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
        SHORT_TERM: 0.023,
        FIXED_INCOME: 0.032,
        CANADIAN_EQUITIES: 0.062,
        CONSERVATIVE_PORTFOLIO: 0.027,
        BALANCED_PORTFOLIO: 0.034,
        DYNAMIC_PORTFOLIO: 0.044,
    },
    BORROWING_RATE: 0.043,
};
