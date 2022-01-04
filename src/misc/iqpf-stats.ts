/*
Sources
	https://www.iqpf.org/docs/default-source/outils/iqpf-normes-projection2021.pdf

Revised
  2021-05-05
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
    RETURN_RATES: ReturnRates;
    BORROWING_RATE: number;
}

export const IQPF: IQPFStatistics = {
    INFLATION: 0.020,
    RETURN_RATES: {
        SHORT_TERM: 0.023,
        FIXED_INCOME: 0.027,
        CANADIAN_EQUITIES: 0.062,
        CONSERVATIVE_PORTFOLIO: 0.023,
        BALANCED_PORTFOLIO: 0.032,
        DYNAMIC_PORTFOLIO: 0.044,
    },
    BORROWING_RATE: 0.043,
};
