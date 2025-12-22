/*
Sources
    https://www.taxtips.ca/marginal-tax-rates-in-canada.htm
    Abattement QC: http://www.cra-arc.gc.ca/tx/ndvdls/tpcs/ncm-tx/rtrn/cmpltng/ddctns/lns409-485/440-fra.html
    Yukon: https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/income-tax/reducing-remuneration-subject-income-tax.html

Revised
    2025-12-22
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
        BASE_TAX_CREDIT: 16452,
        RATES: [{
            FROM: 0,
            TO: 58523,
            RATE: 0.14,
        }, {
            FROM: 58523,
            TO: 117045,
            RATE: 0.205,
        }, {
            FROM: 117045,
            TO: 181440,
            RATE: 0.26,
        }, {
            FROM: 181440,
            TO: 258482,
            RATE: 0.2929,
        }, {
            FROM: 258482,
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
        TAX_CREDIT_RATE: 0.08,
        BASE_TAX_CREDIT: 22769,
        RATES: [{
            FROM: 0,
            TO: 61200,
            RATE: 0.08,
        }, {
            FROM: 61200,
            TO: 154259,
            RATE: 0.10,
        }, {
            FROM: 154259,
            TO: 185111,
            RATE: 0.12,
        }, {
            FROM: 185111,
            TO: 246813,
            RATE: 0.13,
        }, {
            FROM: 246813,
            TO: 370220,
            RATE: 0.14,
        }, {
            FROM: 370220,
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
        BASE_TAX_CREDIT: 13216,
        RATES: [{
            FROM: 0,
            TO: 50363,
            RATE: 0.0506,
        }, {
            FROM: 50363,
            TO: 100728,
            RATE: 0.077,
        }, {
            FROM: 100728,
            TO: 115648,
            RATE: 0.105,
        }, {
            FROM: 115648,
            TO: 140430,
            RATE: 0.1229,
        }, {
            FROM: 140430,
            TO: 190405,
            RATE: 0.147,
        }, {
            FROM: 190405,
            TO: 265545,
            RATE: 0.168,
        }, {
            FROM: 265545,
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
        BASE_TAX_CREDIT: 13664,
        RATES: [{
            FROM: 0,
            TO: 52333,
            RATE: 0.0940,
        }, {
            FROM: 52333,
            TO: 104666,
            RATE: 0.14,
        }, {
            FROM: 104666,
            TO: 193861,
            RATE: 0.16,
        }, {
            FROM: 193861,
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
        BASE_TAX_CREDIT: 11188,
        RATES: [{
            FROM: 0,
            TO: 44678,
            RATE: 0.087,
        }, {
            FROM: 44678,
            TO: 89354,
            RATE: 0.145,
        }, {
            FROM: 89354,
            TO: 159528,
            RATE: 0.158,
        }, {
            FROM: 159528,
            TO: 223340,
            RATE: 0.178,
        }, {
            FROM: 223340,
            TO: 285319,
            RATE: 0.198,
        }, {
            FROM: 285319,
            TO: 570638,
            RATE: 0.208,
        }, {
            FROM: 570638,
            TO: 1141275,
            RATE: 0.213,
        }, {
            FROM: 1141275,
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
        BASE_TAX_CREDIT: 11932,
        RATES: [{
            FROM: 0,
            TO: 30995,
            RATE: 0.0879,
        }, {
            FROM: 30995,
            TO: 61991,
            RATE: 0.1495,
        }, {
            FROM: 61991,
            TO: 97417,
            RATE: 0.1667,
        }, {
            FROM: 97417,
            TO: 157124,
            RATE: 0.175,
        }, {
            FROM: 157124,
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
        BASE_TAX_CREDIT: 15000,
        RATES: [{
            FROM: 0,
            TO: 33928,
            RATE: 0.095,
        }, {
            FROM: 33928,
            TO: 65820,
            RATE: 0.1347,
        }, {
            FROM: 65820,
            TO: 106890,
            RATE: 0.166,
        }, {
            FROM: 106890,
            TO: 142250,
            RATE: 0.1762,
        }, {
            FROM: 142250,
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
        BASE_TAX_CREDIT: 12989,
        RATES: [{
            FROM: 0,
            TO: 53891,
            RATE: 0.0505,
        }, {
            FROM: 53891,
            TO: 107785,
            RATE: 0.0915,
        }, {
            FROM: 107785,
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
            TO: 5818,
            RATE: 0,
        }, {
            FROM: 5818,
            TO: 7446,
            RATE: 0.20,
        }, {
            FROM: 7446,
            TO: 999999999,
            RATE: 0.56, // 0.20 + 0.36
        }],
    },
    QC: {
        ABATEMENT: 0.165,
        TAX_CREDIT_RATE: 0.14,
        BASE_TAX_CREDIT: 18952,
        RATES: [{
            FROM: 0,
            TO: 54345,
            RATE: 0.14,
        }, {
            FROM: 54345,
            TO: 108680,
            RATE: 0.19,
        }, {
            FROM: 108680,
            TO: 132245,
            RATE: 0.24,
        }, {
            FROM: 132245,
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
        BASE_TAX_CREDIT: 20381,
        RATES: [{
            FROM: 0,
            TO: 54532,
            RATE: 0.105,
        }, {
            FROM: 54532,
            TO: 155805,
            RATE: 0.125,
        }, {
            FROM: 155805,
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
        BASE_TAX_CREDIT: 18198,
        RATES: [{
            FROM: 0,
            TO: 53003,
            RATE: 0.059,
        }, {
            FROM: 53003,
            TO: 106009,
            RATE: 0.086,
        }, {
            FROM: 106009,
            TO: 172346,
            RATE: 0.122,
        }, {
            FROM: 172346,
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
        BASE_TAX_CREDIT: 19659,
        RATES: [{
            FROM: 0,
            TO: 55801,
            RATE: 0.04,
        }, {
            FROM: 55801,
            TO: 111602,
            RATE: 0.07,
        }, {
            FROM: 111602,
            TO: 181439,
            RATE: 0.09,
        }, {
            FROM: 181439,
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
        TAX_CREDIT_RATE: 0.14,
        BASE_TAX_CREDIT: 16452,
        RATES: [{
            FROM: 0,
            TO: 58523,
            RATE: 0.064,
        }, {
            FROM: 58523,
            TO: 117045,
            RATE: 0.09,
        }, {
            FROM: 117045,
            TO: 181440,
            RATE: 0.109,
        }, {
            FROM: 181440,
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
    return structuredClone(TAX_BRACKETS[code].RATES);
}

function getAbatement(code: ProvinceCode | FederalCode): number {
    return TAX_BRACKETS[code].ABATEMENT;
}

function getSurtaxRates(code: ProvinceCode | FederalCode): Rate[] {
    return structuredClone(TAX_BRACKETS[code].SURTAX_RATES);
}

export function getFederalTaxRates(yearsToInflate: number): Rate[] {
    const rates = getTaxRates(FEDERAL_CODE);
    const shouldUse2025Rate = yearsToInflate === 0 && now().getFullYear() === 2025;
    if (shouldUse2025Rate) {
        rates[0].RATE = CA_LOWEST_TAX_RATE_2025;
    }
    return rates;
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
