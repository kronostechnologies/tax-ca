/*
Sources
    http://www.taxtips.ca/marginaltaxrates.htm
    Abattement QC: http://www.cra-arc.gc.ca/tx/ndvdls/tpcs/ncm-tx/rtrn/cmpltng/ddctns/lns409-485/440-fra.html

Revised
    2023-12-27
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
        BASE_TAX_CREDIT: 15705,
        RATES: [{
            FROM: 0,
            TO: 55867,
            RATE: 0.15,
        }, {
            FROM: 55867,
            TO: 111733,
            RATE: 0.205,
        }, {
            FROM: 111733,
            TO: 173205,
            RATE: 0.26,
        }, {
            FROM: 173205,
            TO: 246752,
            RATE: 0.2932,
        }, {
            FROM: 246752,
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
        BASE_TAX_CREDIT: 21885,
        RATES: [{
            FROM: 0,
            TO: 148269,
            RATE: 0.10,
        }, {
            FROM: 148269,
            TO: 177922,
            RATE: 0.12,
        }, {
            FROM: 177922,
            TO: 237230,
            RATE: 0.13,
        }, {
            FROM: 237230,
            TO: 355845,
            RATE: 0.14,
        }, {
            FROM: 355845,
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
        BASE_TAX_CREDIT: 12580,
        RATES: [{
            FROM: 0,
            TO: 47937,
            RATE: 0.0506,
        }, {
            FROM: 47937,
            TO: 95875,
            RATE: 0.077,
        }, {
            FROM: 95875,
            TO: 110076,
            RATE: 0.105,
        }, {
            FROM: 110076,
            TO: 133664,
            RATE: 0.1229,
        }, {
            FROM: 133664,
            TO: 181232,
            RATE: 0.147,
        }, {
            FROM: 181232,
            TO: 252752,
            RATE: 0.168,
        }, {
            FROM: 252752,
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
        BASE_TAX_CREDIT: 15780,
        RATES: [{
            FROM: 0,
            TO: 47000,
            RATE: 0.108,
        }, {
            FROM: 47000,
            TO: 100000,
            RATE: 0.1275,
        }, {
            FROM: 100000,
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
        BASE_TAX_CREDIT: 13044,
        RATES: [{
            FROM: 0,
            TO: 49958,
            RATE: 0.0940,
        }, {
            FROM: 49958,
            TO: 99916,
            RATE: 0.14,
        }, {
            FROM: 99916,
            TO: 185064,
            RATE: 0.16,
        }, {
            FROM: 185064,
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
        BASE_TAX_CREDIT: 10818,
        RATES: [{
            FROM: 0,
            TO: 43198,
            RATE: 0.087,
        }, {
            FROM: 43198,
            TO: 86395,
            RATE: 0.145,
        }, {
            FROM: 86395,
            TO: 154244,
            RATE: 0.158,
        }, {
            FROM: 154244,
            TO: 215943,
            RATE: 0.178,
        }, {
            FROM: 215943,
            TO: 275870,
            RATE: 0.198,
        }, {
            FROM: 275870,
            TO: 551739,
            RATE: 0.208,
        }, {
            FROM: 551739,
            TO: 1103478,
            RATE: 0.213,
        }, {
            FROM: 1103478,
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
        TAX_CREDIT_RATE: 0.0965,
        BASE_TAX_CREDIT: 13500,
        RATES: [{
            FROM: 0,
            TO: 32656,
            RATE: 0.0965,
        }, {
            FROM: 32656,
            TO: 64313,
            RATE: 0.1363,
        }, {
            FROM: 64313,
            TO: 105000,
            RATE: 0.1665,
        }, {
            FROM: 105000,
            TO: 140000,
            RATE: 0.18,
        }, {
            FROM: 140000,
            TO: 999999999,
            RATE: 0.1875,
        }],
        SURTAX_RATES: [{
            FROM: 0,
            TO: 999999999,
            RATE: 0,
        }],
    },
    ON: {
        ABATEMENT: 0,
        TAX_CREDIT_RATE: 0.0505,
        BASE_TAX_CREDIT: 12399,
        RATES: [{
            FROM: 0,
            TO: 51446,
            RATE: 0.0505,
        }, {
            FROM: 51446,
            TO: 102894,
            RATE: 0.0915,
        }, {
            FROM: 102894,
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
            TO: 5554,
            RATE: 0,
        }, {
            FROM: 5554,
            TO: 7108,
            RATE: 0.20,
        }, {
            FROM: 7108,
            TO: 999999999,
            RATE: 0.56, // 0.20 + 0.36
        }],
    },
    QC: {
        ABATEMENT: 0.165,
        TAX_CREDIT_RATE: 0.14,
        BASE_TAX_CREDIT: 18056,
        RATES: [{
            FROM: 0,
            TO: 51780,
            RATE: 0.14,
        }, {
            FROM: 51780,
            TO: 103545,
            RATE: 0.19,
        }, {
            FROM: 103545,
            TO: 126000,
            RATE: 0.24,
        }, {
            FROM: 126000,
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
        BASE_TAX_CREDIT: 18491,
        RATES: [{
            FROM: 0,
            TO: 52057,
            RATE: 0.105,
        }, {
            FROM: 52057,
            TO: 148734,
            RATE: 0.125,
        }, {
            FROM: 148734,
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
        BASE_TAX_CREDIT: 17373,
        RATES: [{
            FROM: 0,
            TO: 50597,
            RATE: 0.059,
        }, {
            FROM: 50597,
            TO: 101198,
            RATE: 0.086,
        }, {
            FROM: 101198,
            TO: 164525,
            RATE: 0.122,
        }, {
            FROM: 164525,
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
        BASE_TAX_CREDIT: 18767,
        RATES: [{
            FROM: 0,
            TO: 53268,
            RATE: 0.04,
        }, {
            FROM: 53268,
            TO: 106537,
            RATE: 0.07,
        }, {
            FROM: 106537,
            TO: 173205,
            RATE: 0.09,
        }, {
            FROM: 173205,
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
        BASE_TAX_CREDIT: 15705,
        RATES: [{
            FROM: 0,
            TO: 55867,
            RATE: 0.064,
        }, {
            FROM: 55867,
            TO: 111733,
            RATE: 0.09,
        }, {
            FROM: 111733,
            TO: 173205,
            RATE: 0.109,
        }, {
            FROM: 173205,
            TO: 246752,
            RATE: 0.1293,
        }, {
            FROM: 246752,
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
