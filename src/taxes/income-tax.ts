/*
Sources
    http://www.taxtips.ca/marginaltaxrates.htm
    Abattement QC: http://www.cra-arc.gc.ca/tx/ndvdls/tpcs/ncm-tx/rtrn/cmpltng/ddctns/lns409-485/440-fra.html

Revised
    2024-12-24
*/

import { FEDERAL_CODE, FederalCode, ProvinceCode } from '../misc';
import { maxBy, now, roundToPrecision } from '../utils';

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

export const CA_LOWEST_TAX_RATE_2025 = 0.145;

export const TAX_BRACKETS: TaxBrackets = {
    CA: {
        ABATEMENT: 0,
        TAX_CREDIT_RATE: 0.14,
        BASE_TAX_CREDIT: 16129,
        RATES: [{
            FROM: 0,
            TO: 57375,
            RATE: 0.14,
        }, {
            FROM: 57375,
            TO: 114750,
            RATE: 0.205,
        }, {
            FROM: 114750,
            TO: 177882,
            RATE: 0.26,
        }, {
            FROM: 177882,
            TO: 253414,
            RATE: 0.2932,
        }, {
            FROM: 253414,
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
        BASE_TAX_CREDIT: 22323,
        RATES: [{
            FROM: 0,
            TO: 151234,
            RATE: 0.10,
        }, {
            FROM: 151234,
            TO: 181481,
            RATE: 0.12,
        }, {
            FROM: 181481,
            TO: 241974,
            RATE: 0.13,
        }, {
            FROM: 241974,
            TO: 362961,
            RATE: 0.14,
        }, {
            FROM: 362961,
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
        BASE_TAX_CREDIT: 12932,
        RATES: [{
            FROM: 0,
            TO: 49279,
            RATE: 0.0506,
        }, {
            FROM: 49279,
            TO: 98560,
            RATE: 0.077,
        }, {
            FROM: 98560,
            TO: 113158,
            RATE: 0.105,
        }, {
            FROM: 113158,
            TO: 137407,
            RATE: 0.1229,
        }, {
            FROM: 137407,
            TO: 186306,
            RATE: 0.147,
        }, {
            FROM: 186306,
            TO: 259829,
            RATE: 0.168,
        }, {
            FROM: 259829,
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
        BASE_TAX_CREDIT: 15969,
        RATES: [{
            FROM: 0,
            TO: 47564,
            RATE: 0.108,
        }, {
            FROM: 47564,
            TO: 101200,
            RATE: 0.1275,
        }, {
            FROM: 101200,
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
        BASE_TAX_CREDIT: 13396,
        RATES: [{
            FROM: 0,
            TO: 51306,
            RATE: 0.0940,
        }, {
            FROM: 51306,
            TO: 102614,
            RATE: 0.14,
        }, {
            FROM: 102614,
            TO: 190060,
            RATE: 0.16,
        }, {
            FROM: 190060,
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
        BASE_TAX_CREDIT: 11067,
        RATES: [{
            FROM: 0,
            TO: 44192,
            RATE: 0.087,
        }, {
            FROM: 44192,
            TO: 88382,
            RATE: 0.145,
        }, {
            FROM: 88382,
            TO: 157792,
            RATE: 0.158,
        }, {
            FROM: 157792,
            TO: 220910,
            RATE: 0.178,
        }, {
            FROM: 220910,
            TO: 282214,
            RATE: 0.198,
        }, {
            FROM: 282214,
            TO: 564429,
            RATE: 0.208,
        }, {
            FROM: 564429,
            TO: 1128858,
            RATE: 0.213,
        }, {
            FROM: 1128858,
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
        BASE_TAX_CREDIT: 8744,
        RATES: [{
            FROM: 0,
            TO: 30507,
            RATE: 0.0879,
        }, {
            FROM: 30507,
            TO: 61015,
            RATE: 0.1495,
        }, {
            FROM: 61015,
            TO: 95883,
            RATE: 0.1667,
        }, {
            FROM: 95883,
            TO: 154650,
            RATE: 0.175,
        }, {
            FROM: 154650,
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
        TAX_CREDIT_RATE: 0.095,
        BASE_TAX_CREDIT: 14250,
        RATES: [{
            FROM: 0,
            TO: 33328,
            RATE: 0.095,
        }, {
            FROM: 33328,
            TO: 64656,
            RATE: 0.1347,
        }, {
            FROM: 64656,
            TO: 105000,
            RATE: 0.166,
        }, {
            FROM: 105000,
            TO: 140000,
            RATE: 0.1762,
        }, {
            FROM: 140000,
            TO: 999999999,
            RATE: 0.19,
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
        BASE_TAX_CREDIT: 12747,
        RATES: [{
            FROM: 0,
            TO: 52886,
            RATE: 0.0505,
        }, {
            FROM: 52886,
            TO: 105775,
            RATE: 0.0915,
        }, {
            FROM: 105775,
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
            TO: 5710,
            RATE: 0,
        }, {
            FROM: 5710,
            TO: 7307,
            RATE: 0.20,
        }, {
            FROM: 7307,
            TO: 999999999,
            RATE: 0.56, // 0.20 + 0.36
        }],
    },
    QC: {
        ABATEMENT: 0.165,
        TAX_CREDIT_RATE: 0.14,
        BASE_TAX_CREDIT: 18571,
        RATES: [{
            FROM: 0,
            TO: 53255,
            RATE: 0.14,
        }, {
            FROM: 53255,
            TO: 106495,
            RATE: 0.19,
        }, {
            FROM: 106495,
            TO: 129590,
            RATE: 0.24,
        }, {
            FROM: 129590,
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
        BASE_TAX_CREDIT: 18991,
        RATES: [{
            FROM: 0,
            TO: 53463,
            RATE: 0.105,
        }, {
            FROM: 53463,
            TO: 152750,
            RATE: 0.125,
        }, {
            FROM: 152750,
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
        BASE_TAX_CREDIT: 17842,
        RATES: [{
            FROM: 0,
            TO: 51964,
            RATE: 0.059,
        }, {
            FROM: 51964,
            TO: 103930,
            RATE: 0.086,
        }, {
            FROM: 103930,
            TO: 168967,
            RATE: 0.122,
        }, {
            FROM: 168967,
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
        BASE_TAX_CREDIT: 19274,
        RATES: [{
            FROM: 0,
            TO: 54707,
            RATE: 0.04,
        }, {
            FROM: 54707,
            TO: 109413,
            RATE: 0.07,
        }, {
            FROM: 109413,
            TO: 177881,
            RATE: 0.09,
        }, {
            FROM: 177881,
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
        BASE_TAX_CREDIT: 14538,
        RATES: [{
            FROM: 0,
            TO: 57375,
            RATE: 0.064,
        }, {
            FROM: 57375,
            TO: 114750,
            RATE: 0.09,
        }, {
            FROM: 114750,
            TO: 177882,
            RATE: 0.109,
        }, {
            FROM: 177882,
            TO: 253414,
            RATE: 0.1293,
        }, {
            FROM: 253414,
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

export function getFederalTaxRates(yearsToInflate: number): Rate[] {
    const shouldUse2025Rate = yearsToInflate === 0 && now().getFullYear() === 2025;
    if (shouldUse2025Rate) {
        return getTaxRates(FEDERAL_CODE).map(
            (rate, index) => ({ ...rate, RATE: index === 0 ? CA_LOWEST_TAX_RATE_2025 : rate.RATE }),
        );
    }
    return getTaxRates(FEDERAL_CODE);
}

export function getFederalBaseTaxAmount(grossIncome: number, inflationRate = 0, yearsToInflate = 0): number {
    return getTaxAmount(getFederalTaxRates(yearsToInflate), grossIncome, inflationRate, yearsToInflate);
}

export function getFederalTaxCreditRate(yearsToInflate: number): number {
    const shouldUse2025Rate = yearsToInflate === 0 && now().getFullYear() === 2025;
    return shouldUse2025Rate ? CA_LOWEST_TAX_RATE_2025 : TAX_BRACKETS.CA.TAX_CREDIT_RATE;
}

export function getFederalBaseCredit(inflationRate: number, yearsToInflate: number): number {
    const baseTaxCredit = TAX_BRACKETS.CA.BASE_TAX_CREDIT * getFederalTaxCreditRate(yearsToInflate);
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
    taxCredit = 0,
): number {
    const federalBaseTaxAmount = getFederalBaseTaxAmount(grossIncome, inflationRate, yearsToInflate);
    const baseCredit = getFederalBaseCredit(inflationRate, yearsToInflate);
    const federalTax = Math.max(federalBaseTaxAmount - baseCredit - taxCredit, 0);
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
    taxCredit = 0,
): number {
    const baseTaxAmount = getProvincialBaseTaxAmount(province, grossIncome, inflationRate, yearsToInflate);
    const baseCredit = getProvincialBaseCredit(province, inflationRate, yearsToInflate);
    const tax = Math.max(baseTaxAmount - baseCredit, 0);
    const surTax = getProvincialSurtaxAmount(province, tax, inflationRate, yearsToInflate);
    return Math.max(tax + surTax - taxCredit, 0);
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
