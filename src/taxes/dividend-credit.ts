/*
Sources
    Non-eligible Dividends: https://www.taxtips.ca/dtc/non-eligible-dividend-tax-credit.htm
    Eligible Dividends: https://www.taxtips.ca/dtc/eligible-dividends/eligible-dividend-tax-credit-rates.htm

Revised
    2024-12-24
*/

import { FederalCode, ProvinceCode } from '../misc';

export type DividendTaxCreditRate =
    { GROSS_UP: number; } &
    { [key in ProvinceCode | FederalCode]: number; };

export const NON_ELIGIBLE_DIVIDEND: DividendTaxCreditRate = {
    GROSS_UP: 1.15,
    CA: 0.090301,
    AB: 0.0218,
    BC: 0.0196,
    MB: 0.007835,
    NB: 0.0275,
    NL: 0.032,
    NS: 0.0299,
    NT: 0.06,
    NU: 0.0261,
    ON: 0.029863,
    PE: 0.013,
    QC: 0.0342,
    SK: 0.02938,
    YT: 0.0067,
};

export const ELIGIBLE_DIVIDEND: DividendTaxCreditRate = {
    GROSS_UP: 1.38,
    CA: 0.150198,
    AB: 0.0812,
    BC: 0.12,
    MB: 0.08,
    NB: 0.14,
    NL: 0.063,
    NS: 0.0885,
    NT: 0.115,
    NU: 0.0551,
    ON: 0.1,
    PE: 0.105,
    QC: 0.117,
    SK: 0.11,
    YT: 0.1202,
};
