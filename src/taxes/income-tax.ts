/*
Sources
    http://www.taxtips.ca/marginaltaxrates.htm
    Abattement QC: http://www.cra-arc.gc.ca/tx/ndvdls/tpcs/ncm-tx/rtrn/cmpltng/ddctns/lns409-485/440-fra.html

Revised
    2023-01-03
*/

import { FEDERAL_CODE, FederalCode, ProvinceCode } from '../misc/code-types';
import { roundToPrecision } from '../utils';
import { maxBy } from '../utils/collections';

export interface Rate {
    FROM: number;
    TO: number;
    RATE: number;
}

export interface TaxBracket {
    ABATEMENT: number;
    TAX_CREDIT_RATE: number;
    BASE_TAX_CREDIT: number;
    RATES: Rate[];
    SURTAX_RATES: Rate[];
}

export type TaxBrackets = { [key in ProvinceCode | FederalCode]: TaxBracket };

export const TAX_BRACKETS: TaxBrackets = {
    CA: {
        ABATEMENT: 0,
        TAX_CREDIT_RATE: 0.15,
        BASE_TAX_CREDIT: 15000,
        RATES: [{
            FROM: 0,
            TO: 53359,
            RATE: 0.15,
        }, {
            FROM: 53359,
            TO: 106717,
            RATE: 0.205,
        }, {
            FROM: 106717,
            TO: 165430,
            RATE: 0.26,
        }, {
            FROM: 165430,
            TO: 235675,
            RATE: 0.2932,
        }, {
            FROM: 235675,
            TO: 999999999,
            RATE: 0.33,
        }],
        SURTAX_RATES: [{
            FROM: 0,
            TO: 999999999,
            RATE: 0,
        }],
    },
    AB: {
        ABATEMENT: 0,
        TAX_CREDIT_RATE: 0.10,
        BASE_TAX_CREDIT: 21003,
        RATES: [{
            FROM: 0,
            TO: 142292,
            RATE: 0.10,
        }, {
            FROM: 142292,
            TO: 170751,
            RATE: 0.12,
        }, {
            FROM: 170751,
            TO: 227668,
            RATE: 0.13,
        }, {
            FROM: 227668,
            TO: 341502,
            RATE: 0.14,
        }, {
            FROM: 341502,
            TO: 999999999,
            RATE: 0.15,
        }],
        SURTAX_RATES: [{
            FROM: 0,
            TO: 999999999,
            RATE: 0,
        }],
    },
    BC: {
        ABATEMENT: 0,
        TAX_CREDIT_RATE: 0.0506,
        BASE_TAX_CREDIT: 11981,
        RATES: [{
            FROM: 0,
            TO: 45654,
            RATE: 0.0506,
        }, {
            FROM: 45654,
            TO: 91310,
            RATE: 0.077,
        }, {
            FROM: 91310,
            TO: 104835,
            RATE: 0.105,
        }, {
            FROM: 104835,
            TO: 127299,
            RATE: 0.1229,
        }, {
            FROM: 127299,
            TO: 172602,
            RATE: 0.147,
        }, {
            FROM: 172602,
            TO: 240716,
            RATE: 0.168,
        }, {
            FROM: 240716,
            TO: 999999999,
            RATE: 0.205,
        }],
        SURTAX_RATES: [{
            FROM: 0,
            TO: 999999999,
            RATE: 0,
        }],
    },
    MB: {
        ABATEMENT: 0,
        TAX_CREDIT_RATE: 0.108,
        BASE_TAX_CREDIT: 10855,
        RATES: [{
            FROM: 0,
            TO: 36842,
            RATE: 0.108,
        }, {
            FROM: 36842,
            TO: 79625,
            RATE: 0.1275,
        }, {
            FROM: 79625,
            TO: 999999999,
            RATE: 0.174,
        }],
        SURTAX_RATES: [{
            FROM: 0,
            TO: 999999999,
            RATE: 0,
        }],
    },
    NB: {
        ABATEMENT: 0,
        TAX_CREDIT_RATE: 0.094,
        BASE_TAX_CREDIT: 12458,
        RATES: [{
            FROM: 0,
            TO: 47715,
            RATE: 0.0940,
        }, {
            FROM: 47715,
            TO: 95431,
            RATE: 0.14,
        }, {
            FROM: 95431,
            TO: 176756,
            RATE: 0.16,
        }, {
            FROM: 176756,
            TO: 999999999,
            RATE: 0.195,
        }],
        SURTAX_RATES: [{
            FROM: 0,
            TO: 999999999,
            RATE: 0,
        }],
    },
    NL: {
        ABATEMENT: 0,
        TAX_CREDIT_RATE: 0.087,
        BASE_TAX_CREDIT: 10382,
        RATES: [{
            FROM: 0,
            TO: 41457,
            RATE: 0.087,
        }, {
            FROM: 41457,
            TO: 82913,
            RATE: 0.145,
        }, {
            FROM: 82913,
            TO: 148027,
            RATE: 0.158,
        }, {
            FROM: 148027,
            TO: 207239,
            RATE: 0.178,
        }, {
            FROM: 207239,
            TO: 264750,
            RATE: 0.198,
        }, {
            FROM: 264750,
            TO: 529500,
            RATE: 0.208,
        }, {
            FROM: 529500,
            TO: 1059000,
            RATE: 0.213,
        }, {
            FROM: 1059000,
            TO: 999999999,
            RATE: 0.218,
        }],
        SURTAX_RATES: [{
            FROM: 0,
            TO: 999999999,
            RATE: 0,
        }],
    },
    NS: {
        ABATEMENT: 0,
        TAX_CREDIT_RATE: 0.0879,
        BASE_TAX_CREDIT: 8481,
        RATES: [{
            FROM: 0,
            TO: 29590,
            RATE: 0.0879,
        }, {
            FROM: 29590,
            TO: 59180,
            RATE: 0.1495,
        }, {
            FROM: 59180,
            TO: 93000,
            RATE: 0.1667,
        }, {
            FROM: 93000,
            TO: 150000,
            RATE: 0.175,
        }, {
            FROM: 150000,
            TO: 999999999,
            RATE: 0.21,
        }],
        SURTAX_RATES: [{
            FROM: 0,
            TO: 999999999,
            RATE: 0,
        }],
    },
    PE: {
        ABATEMENT: 0,
        TAX_CREDIT_RATE: 0.098,
        BASE_TAX_CREDIT: 12000,
        RATES: [{
            FROM: 0,
            TO: 31984,
            RATE: 0.098,
        }, {
            FROM: 31984,
            TO: 63969,
            RATE: 0.138,
        }, {
            FROM: 63969,
            TO: 999999999,
            RATE: 0.167,
        }],
        SURTAX_RATES: [{
            FROM: 0,
            TO: 12500,
            RATE: 0,
        }, {
            FROM: 12500,
            TO: 999999999,
            RATE: 0.10,
        }],
    },
    ON: {
        ABATEMENT: 0,
        TAX_CREDIT_RATE: 0.0505,
        BASE_TAX_CREDIT: 11865,
        RATES: [{
            FROM: 0,
            TO: 49231,
            RATE: 0.0505,
        }, {
            FROM: 49231,
            TO: 98463,
            RATE: 0.0915,
        }, {
            FROM: 98463,
            TO: 150000,
            RATE: 0.1116,
        }, {
            FROM: 150000,
            TO: 220000,
            RATE: 0.1216,
        }, {
            FROM: 220000,
            TO: 999999999,
            RATE: 0.1316,
        }],
        SURTAX_RATES: [{
            FROM: 0,
            TO: 5315,
            RATE: 0,
        }, {
            FROM: 5315,
            TO: 6802,
            RATE: 0.20,
        }, {
            FROM: 6802,
            TO: 999999999,
            RATE: 0.56, // 0.20 + 0.36
        }],
    },
    QC: {
        ABATEMENT: 0.165,
        TAX_CREDIT_RATE: 0.15,
        BASE_TAX_CREDIT: 17183,
        RATES: [{
            FROM: 0,
            TO: 49275,
            RATE: 0.15,
        }, {
            FROM: 49275,
            TO: 98540,
            RATE: 0.20,
        }, {
            FROM: 98540,
            TO: 119910,
            RATE: 0.24,
        }, {
            FROM: 119910,
            TO: 999999999,
            RATE: 0.2575,
        }],
        SURTAX_RATES: [{
            FROM: 0,
            TO: 999999999,
            RATE: 0,
        }],
    },
    SK: {
        ABATEMENT: 0,
        TAX_CREDIT_RATE: 0.105,
        BASE_TAX_CREDIT: 17661,
        RATES: [{
            FROM: 0,
            TO: 49720,
            RATE: 0.105,
        }, {
            FROM: 49720,
            TO: 142058,
            RATE: 0.125,
        }, {
            FROM: 142058,
            TO: 999999999,
            RATE: 0.145,
        }],
        SURTAX_RATES: [{
            FROM: 0,
            TO: 999999999,
            RATE: 0,
        }],
    },
    NT: {
        ABATEMENT: 0,
        TAX_CREDIT_RATE: 0.059,
        BASE_TAX_CREDIT: 16593,
        RATES: [{
            FROM: 0,
            TO: 48326,
            RATE: 0.059,
        }, {
            FROM: 48326,
            TO: 96655,
            RATE: 0.086,
        }, {
            FROM: 96655,
            TO: 157139,
            RATE: 0.122,
        }, {
            FROM: 157139,
            TO: 999999999,
            RATE: 0.1405,
        }],
        SURTAX_RATES: [{
            FROM: 0,
            TO: 999999999,
            RATE: 0,
        }],
    },
    NU: {
        ABATEMENT: 0,
        TAX_CREDIT_RATE: 0.04,
        BASE_TAX_CREDIT: 17925,
        RATES: [{
            FROM: 0,
            TO: 50877,
            RATE: 0.04,
        }, {
            FROM: 50877,
            TO: 101754,
            RATE: 0.07,
        }, {
            FROM: 101754,
            TO: 165429,
            RATE: 0.09,
        }, {
            FROM: 165429,
            TO: 999999999,
            RATE: 0.115,
        }],
        SURTAX_RATES: [{
            FROM: 0,
            TO: 999999999,
            RATE: 0,
        }],
    },
    YT: {
        ABATEMENT: 0,
        TAX_CREDIT_RATE: 0.064,
        BASE_TAX_CREDIT: 15000,
        RATES: [{
            FROM: 0,
            TO: 53359,
            RATE: 0.064,
        }, {
            FROM: 53359,
            TO: 106717,
            RATE: 0.09,
        }, {
            FROM: 106717,
            TO: 165430,
            RATE: 0.109,
        }, {
            FROM: 165430,
            TO: 235675,
            RATE: 0.1293,
        }, {
            FROM: 235675,
            TO: 500000,
            RATE: 0.128,
        }, {
            FROM: 500000,
            TO: 999999999,
            RATE: 0.15,
        }],
        SURTAX_RATES: [{
            FROM: 0,
            TO: 999999999,
            RATE: 0,
        }],
    },
};

function inflate(amount: number, inflationRate: number, yearsToInflate: number): number {
    return amount * ((1 + inflationRate) ** yearsToInflate);
}

export function getTaxAmount(rates: Rate[], income: number, inflationRate: number, yearsToInflate: number): number {
    const reducer = (previous: number, current: Rate): number => {
        const bracketFrom = inflate(current.FROM, inflationRate, yearsToInflate);
        const bracketTo = inflate(current.TO, inflationRate, yearsToInflate);
        const bracketTax = bracketFrom < income ? (Math.min(income, bracketTo) - bracketFrom) * current.RATE : 0;
        return previous + bracketTax;
    };
    return rates.reduce(reducer, 0);
}

export function getRate(brackets: Rate[], grossIncome: number, inflationRate: number, yearsToInflate: number): number {
    const reducer = (previous: number, current: Rate): number => {
        const bracketFrom = inflate(current.FROM, inflationRate, yearsToInflate);
        return bracketFrom < grossIncome ? current.RATE : previous;
    };
    return brackets.reduce(reducer, 0);
}

export function getTaxRates(code: ProvinceCode | FederalCode): Rate[] {
    return TAX_BRACKETS[code].RATES;
}

function getAbatement(code: ProvinceCode | FederalCode): number {
    return TAX_BRACKETS[code].ABATEMENT;
}

function getSurtaxRates(code: ProvinceCode | FederalCode): Rate[] {
    return TAX_BRACKETS[code].SURTAX_RATES;
}

export function getFederalBaseTaxAmount(grossIncome: number, inflationRate = 0, yearsToInflate = 0): number {
    return getTaxAmount(getTaxRates(FEDERAL_CODE), grossIncome, inflationRate, yearsToInflate);
}

export function getFederalBaseCredit(inflationRate: number, yearsToInflate: number): number {
    const baseTaxCredit = TAX_BRACKETS.CA.BASE_TAX_CREDIT * TAX_BRACKETS.CA.TAX_CREDIT_RATE;
    return inflate(baseTaxCredit, inflationRate, yearsToInflate);
}

export function getProvincialAbatement(province: ProvinceCode, federalTaxAmount: number): number {
    return getAbatement(province) * federalTaxAmount;
}

export function getFederalTaxAmount(
    provincialCode: ProvinceCode,
    grossIncome: number,
    inflationRate = 0,
    yearsToInflate = 0,
): number {
    const federalBaseTaxAmount = getFederalBaseTaxAmount(grossIncome, inflationRate, yearsToInflate);
    const baseCredit = getFederalBaseCredit(inflationRate, yearsToInflate);
    const federalTax = Math.max(federalBaseTaxAmount - baseCredit, 0);
    const abatement = getProvincialAbatement(provincialCode, federalTax);
    return Math.max(federalTax - abatement, 0);
}

export function getProvincialSurtaxAmount(
    province: ProvinceCode,
    baseTaxAmount: number,
    inflationRate = 0,
    yearsToInflate = 0,
): number {
    return getTaxAmount(getSurtaxRates(province), baseTaxAmount, inflationRate, yearsToInflate);
}

export function getProvincialBaseTaxAmount(
    province: ProvinceCode,
    grossIncome: number,
    inflationRate = 0,
    yearsToInflate = 0,
): number {
    return getTaxAmount(getTaxRates(province), grossIncome, inflationRate, yearsToInflate);
}

export function getProvincialBaseCredit(province: ProvinceCode, inflationRate: number, yearsToInflate: number): number {
    const baseTaxCredit = TAX_BRACKETS[province].BASE_TAX_CREDIT * TAX_BRACKETS[province].RATES[0].RATE;
    return inflate(baseTaxCredit, inflationRate, yearsToInflate);
}

export function getProvincialTaxAmount(
    province: ProvinceCode,
    grossIncome: number,
    inflationRate = 0,
    yearsToInflate = 0,
): number {
    const baseTaxAmount = getProvincialBaseTaxAmount(province, grossIncome, inflationRate, yearsToInflate);
    const baseCredit = getProvincialBaseCredit(province, inflationRate, yearsToInflate);
    const tax = Math.max(baseTaxAmount - baseCredit, 0);
    const surTax = getProvincialSurtaxAmount(province, tax, inflationRate, yearsToInflate);
    return tax + surTax;
}

export function getFederalMarginalRate(
    provincialCode: ProvinceCode,
    grossIncome: number,
    inflationRate = 0,
    yearsToInflate = 0,
): number {
    const brackets = getTaxRates(FEDERAL_CODE);
    const rate = getRate(brackets, grossIncome, inflationRate, yearsToInflate);
    return rate * (1 - getAbatement(provincialCode));
}

export function getProvincialMarginalRate(
    provincialCode: ProvinceCode,
    grossIncome: number,
    inflationRate = 0,
    yearsToInflate = 0,
): number {
    const taxAmount = getProvincialTaxAmount(provincialCode, grossIncome, inflationRate, yearsToInflate);
    const taxCredit = getProvincialBaseCredit(provincialCode, inflationRate, yearsToInflate);
    const provincialTaxAmount = Math.max(taxAmount - taxCredit, 0);

    const taxBrackets = getTaxRates(provincialCode);
    const surtaxBrackets = getSurtaxRates(provincialCode);

    const taxRate = getRate(taxBrackets, grossIncome, inflationRate, yearsToInflate);
    const surtaxRate = getRate(surtaxBrackets, provincialTaxAmount, inflationRate, yearsToInflate);

    return taxRate + (taxRate * surtaxRate);
}

export function getTotalMarginalRate(
    provincialCode: ProvinceCode,
    grossIncome: number,
    inflationRate = 0,
    yearsToInflate = 0,
): number {
    const provRate = getProvincialMarginalRate(provincialCode, grossIncome, inflationRate, yearsToInflate);
    const fedRate = getFederalMarginalRate(provincialCode, grossIncome, inflationRate, yearsToInflate);

    return roundToPrecision(provRate + fedRate, 4);
}

export function getMaxProvincialMarginalRate(provincialCode: ProvinceCode): number {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const marginalRate = maxBy(getTaxRates(provincialCode), (bracket: Rate) => bracket.TO)!.RATE;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const surtaxRate = maxBy(getSurtaxRates(provincialCode), (bracket) => bracket.TO)!.RATE;

    return marginalRate + (marginalRate * surtaxRate);
}

export function getMaxFederalMarginalRate(provincialCode: ProvinceCode): number {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const maxRate = maxBy(getTaxRates(FEDERAL_CODE), (bracket) => bracket.TO)!.RATE;

    return maxRate * (1 - getAbatement(provincialCode));
}

export function getTotalMaxMarginalRate(provincialCode: ProvinceCode): number {
    const provRate = getMaxProvincialMarginalRate(provincialCode);
    const fedRate = getMaxFederalMarginalRate(provincialCode);

    return roundToPrecision(provRate + fedRate, 4);
}

export function getTotalTaxAmount(
    provincialCode: ProvinceCode,
    grossIncome: number,
    inflationRate = 0,
    yearsToInflate = 0,
): number {
    const provTax = getProvincialTaxAmount(provincialCode, grossIncome, inflationRate, yearsToInflate);
    const fedTax = getFederalTaxAmount(provincialCode, grossIncome, inflationRate, yearsToInflate);
    return Math.max(provTax, 0) + Math.max(fedTax, 0);
}

export function getEffectiveRate(
    province: ProvinceCode,
    income: number,
    inflationRate = 0,
    yearsToInflate = 0,
): number {
    if (income <= 0) {
        return 0;
    }
    return (getTotalTaxAmount(province, income, inflationRate, yearsToInflate)) / income;
}
