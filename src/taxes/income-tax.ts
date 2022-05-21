/*
Sources
  http://www.taxtips.ca/marginaltaxrates.htm
  Abattement QC: http://www.cra-arc.gc.ca/tx/ndvdls/tpcs/ncm-tx/rtrn/cmpltng/ddctns/lns409-485/440-fra.html

Revised
  2022-01-11
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
        BASE_TAX_CREDIT: 14398,
        RATES: [{
            FROM: 0,
            TO: 50197,
            RATE: 0.15,
        }, {
            FROM: 50197,
            TO: 100392,
            RATE: 0.205,
        }, {
            FROM: 100392,
            TO: 155625,
            RATE: 0.26,
        }, {
            FROM: 155625,
            TO: 221708,
            RATE: 0.2938,
        }, {
            FROM: 221708,
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
        BASE_TAX_CREDIT: 19369,
        RATES: [{
            FROM: 0,
            TO: 131220,
            RATE: 0.10,
        }, {
            FROM: 131220,
            TO: 157464,
            RATE: 0.12,
        }, {
            FROM: 157464,
            TO: 209952,
            RATE: 0.13,
        }, {
            FROM: 209952,
            TO: 314928,
            RATE: 0.14,
        }, {
            FROM: 314928,
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
        BASE_TAX_CREDIT: 11302,
        RATES: [{
            FROM: 0,
            TO: 43070,
            RATE: 0.0506,
        }, {
            FROM: 43070,
            TO: 86141,
            RATE: 0.077,
        }, {
            FROM: 86141,
            TO: 98901,
            RATE: 0.105,
        }, {
            FROM: 98901,
            TO: 120094,
            RATE: 0.1229,
        }, {
            FROM: 120094,
            TO: 162832,
            RATE: 0.147,
        }, {
            FROM: 162832,
            TO: 227091,
            RATE: 0.168,
        }, {
            FROM: 227091,
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
        BASE_TAX_CREDIT: 10145,
        RATES: [{
            FROM: 0,
            TO: 34431,
            RATE: 0.108,
        }, {
            FROM: 34431,
            TO: 74416,
            RATE: 0.1275,
        }, {
            FROM: 74416,
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
        BASE_TAX_CREDIT: 10817,
        RATES: [{
            FROM: 0,
            TO: 44887,
            RATE: 0.0940,
        }, {
            FROM: 44887,
            TO: 89775,
            RATE: 0.1482,
        }, {
            FROM: 89775,
            TO: 145955,
            RATE: 0.1652,
        }, {
            FROM: 145955,
            TO: 166280,
            RATE: 0.1784,
        }, {
            FROM: 166280,
            TO: 999999999,
            RATE: 0.2030,
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
        BASE_TAX_CREDIT: 9804,
        RATES: [{
            FROM: 0,
            TO: 39147,
            RATE: 0.087,
        }, {
            FROM: 39147,
            TO: 78294,
            RATE: 0.145,
        }, {
            FROM: 78294,
            TO: 139780,
            RATE: 0.158,
        }, {
            FROM: 139780,
            TO: 195693,
            RATE: 0.178,
        }, {
            FROM: 195693,
            TO: 250000,
            RATE: 0.198,
        }, {
            FROM: 250000,
            TO: 500000,
            RATE: 0.208,
        }, {
            FROM: 500000,
            TO: 1000000,
            RATE: 0.213,
        }, {
            FROM: 1000000,
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
        BASE_TAX_CREDIT: 11250,
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
        BASE_TAX_CREDIT: 11141,
        RATES: [{
            FROM: 0,
            TO: 46226,
            RATE: 0.0505,
        }, {
            FROM: 46226,
            TO: 92454,
            RATE: 0.0915,
        }, {
            FROM: 92454,
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
            TO: 4991,
            RATE: 0,
        }, {
            FROM: 4991,
            TO: 6387,
            RATE: 0.20,
        }, {
            FROM: 6387,
            TO: 999999999,
            RATE: 0.56, // 0.20 + 0.36
        }],
    },
    QC: {
        ABATEMENT: 0.165,
        TAX_CREDIT_RATE: 0.15,
        BASE_TAX_CREDIT: 16143,
        RATES: [{
            FROM: 0,
            TO: 46295,
            RATE: 0.15,
        }, {
            FROM: 46295,
            TO: 92580,
            RATE: 0.20,
        }, {
            FROM: 92580,
            TO: 112655,
            RATE: 0.24,
        }, {
            FROM: 112655,
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
        BASE_TAX_CREDIT: 16615,
        RATES: [{
            FROM: 0,
            TO: 46773,
            RATE: 0.105,
        }, {
            FROM: 46773,
            TO: 133638,
            RATE: 0.125,
        }, {
            FROM: 133638,
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
        BASE_TAX_CREDIT: 15609,
        RATES: [{
            FROM: 0,
            TO: 45462,
            RATE: 0.059,
        }, {
            FROM: 45462,
            TO: 90927,
            RATE: 0.086,
        }, {
            FROM: 90927,
            TO: 147826,
            RATE: 0.122,
        }, {
            FROM: 147826,
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
        BASE_TAX_CREDIT: 16862,
        RATES: [{
            FROM: 0,
            TO: 47862,
            RATE: 0.04,
        }, {
            FROM: 47862,
            TO: 95724,
            RATE: 0.07,
        }, {
            FROM: 95724,
            TO: 155625,
            RATE: 0.09,
        }, {
            FROM: 155625,
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
        BASE_TAX_CREDIT: 14398,
        RATES: [{
            FROM: 0,
            TO: 50197,
            RATE: 0.064,
        }, {
            FROM: 50197,
            TO: 100392,
            RATE: 0.09,
        }, {
            FROM: 100392,
            TO: 155625,
            RATE: 0.109,
        }, {
            FROM: 155625,
            TO: 221708,
            RATE: 0.1296,
        }, {
            FROM: 221708,
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

function extractRate(rates: Rate[], income: number, inflationRate: number, yearsToInflate: number): number {
    const reducer = (previous: number, current: Rate): number => {
        const bracketFrom = inflate(current.FROM, inflationRate, yearsToInflate);
        const bracketTo = inflate(current.TO, inflationRate, yearsToInflate);
        const bracketTax = bracketFrom < income ? (Math.min(income, bracketTo) - bracketFrom) * current.RATE : 0;
        return previous + bracketTax;
    };
    return rates.reduce(reducer, 0);
}

function getRate(brackets: Rate[], grossIncome: number, inflationRate: number, yearsToInflate: number): number {
    const reducer = (previous: number, current: Rate): number => {
        const bracketFrom = inflate(current.FROM, inflationRate, yearsToInflate);
        return bracketFrom < grossIncome ? current.RATE : previous;
    };
    return brackets.reduce(reducer, 0);
}

function getTaxRates(code: ProvinceCode | FederalCode): Rate[] {
    return TAX_BRACKETS[code].RATES;
}

function getAbatement(code: ProvinceCode | FederalCode): number {
    return TAX_BRACKETS[code].ABATEMENT;
}

function getSurtaxRates(code: ProvinceCode | FederalCode): Rate[] {
    return TAX_BRACKETS[code].SURTAX_RATES;
}

export function getFederalBaseTaxAmount(grossIncome: number, inflationRate = 0, yearsToInflate = 0): number {
    return extractRate(getTaxRates(FEDERAL_CODE), grossIncome, inflationRate, yearsToInflate);
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
    return extractRate(getSurtaxRates(province), baseTaxAmount, inflationRate, yearsToInflate);
}

export function getProvincialBaseTaxAmount(
    province: ProvinceCode,
    grossIncome: number,
    inflationRate = 0,
    yearsToInflate = 0,
): number {
    return extractRate(getTaxRates(province), grossIncome, inflationRate, yearsToInflate);
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
