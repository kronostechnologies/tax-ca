/*
 Sources
 http://www.getsmarteraboutmoney.ca/en/managing-your-money/investing/rrifs-and-annuities/Pages/Making-withdrawals-from-your-RRIF.aspx

 Revised
 2021-12-21
 */

export interface RegisteredRetirementIncomeFund {
    MIN_WITHDRAWAL_PCT: { [K: number]: number };
}

export const RRIF: RegisteredRetirementIncomeFund = {
    MIN_WITHDRAWAL_PCT: {
        50: 0.0250,
        51: 0.0256,
        52: 0.0263,
        53: 0.0270,
        54: 0.0278,
        55: 0.0286,
        56: 0.0294,
        57: 0.0303,
        58: 0.0313,
        59: 0.0323,
        60: 0.0333,
        61: 0.0345,
        62: 0.0357,
        63: 0.0370,
        64: 0.0385,
        65: 0.0400,
        66: 0.0417,
        67: 0.0435,
        68: 0.0455,
        69: 0.0476,
        70: 0.0500,
        71: 0.0528,
        72: 0.0540,
        73: 0.0553,
        74: 0.0567,
        75: 0.0582,
        76: 0.0598,
        77: 0.0617,
        78: 0.0636,
        79: 0.0658,
        80: 0.0682,
        81: 0.0708,
        82: 0.0738,
        83: 0.0771,
        84: 0.0808,
        85: 0.0851,
        86: 0.0899,
        87: 0.0955,
        88: 0.1021,
        89: 0.1099,
        90: 0.1192,
        91: 0.1306,
        92: 0.1449,
        93: 0.1634,
        94: 0.1879,
        95: 0.20,
    },
};

export function getMinimumWithdrawalPercentage(beginningOfYearAge: number): number {
    return beginningOfYearAge >= 71 ? RRIF.MIN_WITHDRAWAL_PCT[beginningOfYearAge] : 1 / (90 - beginningOfYearAge);
}
