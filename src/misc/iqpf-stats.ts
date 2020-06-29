/*
Sources:
	https://www.iqpf.org/docs/default-source/outils/iqpf-normes-projection2020.pdf

Revised 2020-05-04
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
        SHORT_TERM: 0.024,
        FIXED_INCOME: 0.029,
        CANADIAN_EQUITIES: 0.061,
        CONSERVATIVE_PORTFOLIO: 0.024,
        BALANCED_PORTFOLIO: 0.033,
        DYNAMIC_PORTFOLIO: 0.043,
    },
    BORROWING_RATE: 0.044,
};
