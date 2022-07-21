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
    // This is based on January 1st, but it is meant to be used with age at the end of the year, so we add one year.
    MIN_WITHDRAWAL_PCT: {
        51: 0.0250,
        52: 0.0256,
        53: 0.0263,
        54: 0.0270,
        55: 0.0278,
        56: 0.0286,
        57: 0.0294,
        58: 0.0303,
        59: 0.0313,
        60: 0.0323,
        61: 0.0333,
        62: 0.0345,
        63: 0.0357,
        64: 0.0370,
        65: 0.0385,
        66: 0.0400,
        67: 0.0417,
        68: 0.0435,
        69: 0.0455,
        70: 0.0476,
        71: 0.0500,
        72: 0.0528,
        73: 0.0540,
        74: 0.0553,
        75: 0.0567,
        76: 0.0582,
        77: 0.0598,
        78: 0.0617,
        79: 0.0636,
        80: 0.0658,
        81: 0.0682,
        82: 0.0708,
        83: 0.0738,
        84: 0.0771,
        85: 0.0808,
        86: 0.0851,
        87: 0.0899,
        88: 0.0955,
        89: 0.1021,
        90: 0.1099,
        91: 0.1192,
        92: 0.1306,
        93: 0.1449,
        94: 0.1634,
        95: 0.1879,
        96: 0.20,
    },
};

export function getMinimumWithdrawalPercentage(age: number): number {
    // This is based on January 1st, but it is meant to be used with age at the end of the year, so we add one year.
    return age >= 71 ? RRIF.MIN_WITHDRAWAL_PCT[age] : 1 / (90 - age + 1);
}
