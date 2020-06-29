/*
Sources:
  http://www.taxtips.ca/marginaltaxrates.htm

Revised 2018-12-21
*/

import { FederalCode, ProvinceCode, ProvinceName } from '../misc/code-types';
import { maxBy } from '../utils/collections';

export const PROVINCIAL_CODES: { [key in ProvinceName]: ProvinceCode } = {
    ALBERTA: 'AB',
    BRITISH_COLUMBIA: 'BC',
    MANITOBA: 'MB',
    NEW_BRUNSWICK: 'NB',
    NEWFOUNDLAND: 'NL',
    NOVA_SCOTIA: 'NS',
    PRINCE_EDWARD_ISLAND: 'PE',
    ONTARIO: 'ON',
    QUEBEC: 'QC',
    SASKATCHEWAN: 'SK',
    NORTHWEST_TERRITORIES: 'NT',
    NUNAVUT: 'NU',
    YUKON: 'YT',
};

interface Rate {
    FROM: number;
    TO: number;
    RATE: number;
}

interface TaxBracketsElement {
    ABATEMENT: number;
    TAX_CREDIT_RATE: number;
    BASE_TAX_CREDIT: number;
    RATES: Rate[];
    SURTAX_RATES: Rate[];
}

export const TAX_BRACKETS: { [key in ProvinceCode | FederalCode]: TaxBracketsElement } = {
    CA: {
        ABATEMENT: 0,
        TAX_CREDIT_RATE: 0.15,
        BASE_TAX_CREDIT: 12298,
        RATES: [{
            FROM: 0,
            TO: 48535,
            RATE: 0.15,
        }, {
            FROM: 48535,
            TO: 97069,
            RATE: 0.205,
        }, {
            FROM: 97069,
            TO: 150473,
            RATE: 0.26,
        }, {
            FROM: 150473,
            TO: 214368,
            RATE: 0.29,
        }, {
            FROM: 214368,
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
        BASE_TAX_CREDIT: 10949,
        RATES: [{
            FROM: 0,
            TO: 41725,
            RATE: 0.0506,
        }, {
            FROM: 41725,
            TO: 83451,
            RATE: 0.077,
        }, {
            FROM: 83451,
            TO: 95812,
            RATE: 0.105,
        }, {
            FROM: 95812,
            TO: 116344,
            RATE: 0.1229,
        }, {
            FROM: 116344,
            TO: 157748,
            RATE: 0.147,
        }, {
            FROM: 157748,
            TO: 999999999,
            RATE: 0.168,
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
        BASE_TAX_CREDIT: 9838,
        RATES: [{
            FROM: 0,
            TO: 33389,
            RATE: 0.108,
        }, {
            FROM: 33389,
            TO: 72164,
            RATE: 0.1275,
        }, {
            FROM: 72164,
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
        TAX_CREDIT_RATE: 0.0968,
        BASE_TAX_CREDIT: 10459,
        RATES: [{
            FROM: 0,
            TO: 43401,
            RATE: 0.0968,
        }, {
            FROM: 43401,
            TO: 86803,
            RATE: 0.1482,
        }, {
            FROM: 86803,
            TO: 141122,
            RATE: 0.1652,
        }, {
            FROM: 141122,
            TO: 160776,
            RATE: 0.1784,
        }, {
            FROM: 160776,
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
        BASE_TAX_CREDIT: 9498,
        RATES: [{
            FROM: 0,
            TO: 37929,
            RATE: 0.087,
        }, {
            FROM: 37929,
            TO: 75858,
            RATE: 0.145,
        }, {
            FROM: 75858,
            TO: 135432,
            RATE: 0.158,
        }, {
            FROM: 135432,
            TO: 189604,
            RATE: 0.173,
        }, {
            FROM: 189604,
            TO: 999999999,
            RATE: 0.183,
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
        BASE_TAX_CREDIT: 10000,
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
        BASE_TAX_CREDIT: 10783,
        RATES: [{
            FROM: 0,
            TO: 44740,
            RATE: 0.0505,
        }, {
            FROM: 44740,
            TO: 89482,
            RATE: 0.0915,
        }, {
            FROM: 89482,
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
            TO: 4830,
            RATE: 0,
        }, {
            FROM: 4830,
            TO: 6182,
            RATE: 0.20,
        }, {
            FROM: 6182,
            TO: 999999999,
            RATE: 0.56, // 0.20 + 0.36
        }],
    },
    QC: {
        ABATEMENT: 0.165, // http://www.cra-arc.gc.ca/tx/ndvdls/tpcs/ncm-tx/rtrn/cmpltng/ddctns/lns409-485/440-fra.html
        TAX_CREDIT_RATE: 0.15,
        BASE_TAX_CREDIT: 15532,
        RATES: [{
            FROM: 0,
            TO: 44545,
            RATE: 0.15,
        }, {
            FROM: 44545,
            TO: 89080,
            RATE: 0.20,
        }, {
            FROM: 89080,
            TO: 108390,
            RATE: 0.24,
        }, {
            FROM: 108390,
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
        BASE_TAX_CREDIT: 16065,
        RATES: [{
            FROM: 0,
            TO: 45225,
            RATE: 0.105,
        }, {
            FROM: 45225,
            TO: 129214,
            RATE: 0.125,
        }, {
            FROM: 129214,
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
        BASE_TAX_CREDIT: 15093,
        RATES: [{
            FROM: 0,
            TO: 43957,
            RATE: 0.059,
        }, {
            FROM: 43957,
            TO: 87916,
            RATE: 0.086,
        }, {
            FROM: 87916,
            TO: 142932,
            RATE: 0.122,
        }, {
            FROM: 142932,
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
        BASE_TAX_CREDIT: 16304,
        RATES: [{
            FROM: 0,
            TO: 46277,
            RATE: 0.04,
        }, {
            FROM: 46277,
            TO: 92555,
            RATE: 0.07,
        }, {
            FROM: 92555,
            TO: 150473,
            RATE: 0.09,
        }, {
            FROM: 150473,
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
        BASE_TAX_CREDIT: 12298,
        RATES: [{
            FROM: 0,
            TO: 48535,
            RATE: 0.064,
        }, {
            FROM: 48535,
            TO: 97069,
            RATE: 0.09,
        }, {
            FROM: 97069,
            TO: 150473,
            RATE: 0.109,
        }, {
            FROM: 150473,
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

export const FEDERAL_CODE: FederalCode = 'CA';

function extractRate(rates: Rate[], income: number, inflationRate: number, yearsToInflate: number): number {
    let tax = 0;
    rates.forEach((bracket: Rate) => {
        const bracketFrom = bracket.FROM * ((1 + inflationRate) ** yearsToInflate);
        if (bracketFrom < income) {
            const bracketTo = bracket.TO * ((1 + inflationRate) ** yearsToInflate);
            tax += (Math.min(income, bracketTo) - bracketFrom) * bracket.RATE;
        }
    });
    return tax;
}

export function getFederalTaxAmount(grossIncome: number, inflationRate = 0, yearsToInflate = 0): number {
    return extractRate(TAX_BRACKETS.CA.RATES, grossIncome, inflationRate, yearsToInflate);
}

export function getProvincialTaxAmount(
    province: ProvinceCode,
    grossIncome: number,
    inflationRate = 0,
    yearsToInflate = 0,
): number {
    return extractRate(TAX_BRACKETS[province].RATES, grossIncome, inflationRate, yearsToInflate);
}

export function getProvincialSurtaxAmount(
    province: ProvinceCode,
    baseTaxAmount: number,
    inflationRate = 0,
    yearsToInflate = 0,
): number {
    return extractRate(TAX_BRACKETS[province].SURTAX_RATES, baseTaxAmount, inflationRate, yearsToInflate);
}

export function getFederalBaseCredit(inflationRate: number, yearsToInflate: number): number {
    return TAX_BRACKETS.CA.BASE_TAX_CREDIT
        * TAX_BRACKETS.CA.TAX_CREDIT_RATE
        * ((1 + inflationRate) ** yearsToInflate);
}

export function getProvincialAbatement(province: ProvinceCode, federalTaxAmount: number): number {
    return TAX_BRACKETS[province].ABATEMENT * federalTaxAmount;
}

export function getFederalMarginalRate(
    provincialCode: ProvinceCode,
    grossIncome: number,
    inflationRate = 0,
    yearsToInflate = 0,
): number {
    const fedTax = getFederalTaxAmount(grossIncome, inflationRate, yearsToInflate);
    const fedBaseCredit = getFederalBaseCredit(inflationRate, yearsToInflate);
    const fedProvAbatement = getProvincialAbatement(provincialCode, fedTax - fedBaseCredit);

    return grossIncome <= 0 ? 0 : Math.max(fedTax - fedBaseCredit - fedProvAbatement, 0) / grossIncome;
}

export function getProvincialMarginalRate(
    provincialCode: ProvinceCode,
    grossIncome: number,
    inflationRate = 0,
    yearsToInflate = 0,
): number {
    let marginalRate = 0;
    const baseTaxAmount = getProvincialTaxAmount(provincialCode, grossIncome, inflationRate, yearsToInflate);

    TAX_BRACKETS[provincialCode].RATES.forEach(bracket => {
        const bracketFrom = bracket.FROM * ((1 + inflationRate) ** yearsToInflate);
        if (bracketFrom < grossIncome) {
            marginalRate = bracket.RATE;
        }
    });

    let surtaxRate = 0;
    TAX_BRACKETS[provincialCode].SURTAX_RATES.forEach(bracket => {
        const bracketFrom = bracket.FROM * ((1 + inflationRate) ** yearsToInflate);
        if (bracketFrom < baseTaxAmount) {
            surtaxRate = bracket.RATE;
        }
    });

    return marginalRate * (1 + surtaxRate);
}

export function getProvincialBaseCredit(province: ProvinceCode, inflationRate: number, yearsToInflate: number): number {
    return TAX_BRACKETS[province].BASE_TAX_CREDIT
        * TAX_BRACKETS[province].RATES[0].RATE
        * ((1 + inflationRate) ** yearsToInflate);
}

export function getTotalMarginalRate(
    provincialCode: ProvinceCode,
    grossIncome: number,
    inflationRate = 0,
    yearsToInflate = 0,
): number {
    const provRate = getProvincialMarginalRate(provincialCode, grossIncome, inflationRate, yearsToInflate);
    const fedRate = getFederalMarginalRate(provincialCode, grossIncome, inflationRate, yearsToInflate);

    return provRate + fedRate;
}

export function getMaxProvincialMarginalRate(provincialCode: ProvinceCode): number {
    // tslint:disable-next-line:no-non-null-assertion
    const marginalRate = maxBy(TAX_BRACKETS[provincialCode].RATES, (bracket: Rate) => bracket.TO)!.RATE;
    // tslint:disable-next-line:no-non-null-assertion
    const surtaxRate = maxBy(TAX_BRACKETS[provincialCode].SURTAX_RATES, bracket => bracket.TO)!.RATE;

    return marginalRate * (1 + surtaxRate);
}

export function getMaxFederalMarginalRate(provincialCode: ProvinceCode): number {
    // tslint:disable-next-line:no-non-null-assertion
    const maxRate = maxBy(TAX_BRACKETS[FEDERAL_CODE].RATES, bracket => bracket.TO)!.RATE;
    return maxRate * (1 - TAX_BRACKETS[provincialCode].ABATEMENT);
}

export function getTotalMaxMarginalRate(provincialCode: ProvinceCode): string {
    const provRate = getMaxProvincialMarginalRate(provincialCode);
    const fedRate = getMaxFederalMarginalRate(provincialCode);

    return (provRate + fedRate).toPrecision(4);
}

export function getTotalTaxAmount(
    provincialCode: ProvinceCode,
    grossIncome: number,
    inflationRate = 0,
    yearsToInflate = 0,
): number {
    const provTax = getProvincialTaxAmount(provincialCode, grossIncome, inflationRate, yearsToInflate);
    const provSurtax = getProvincialSurtaxAmount(provincialCode, provTax, inflationRate, yearsToInflate);
    const fedTax = getFederalTaxAmount(grossIncome, inflationRate, yearsToInflate);

    return provTax + provSurtax + fedTax;
}

export function calculateEffectiveTaxRate(income: number, province: ProvinceCode): number {
    if (income <= 0) {
        return 0;
    }

    const provTax = getProvincialTaxAmount(province, income, 0, 0);
    const provBaseCredit = getProvincialBaseCredit(province, 0, 0);

    const fedTax = getFederalTaxAmount(income, 0, 0);
    const fedBaseCredit = getFederalBaseCredit(0, 0);
    const fedProvAbatement = getProvincialAbatement(province, fedTax - fedBaseCredit);

    const taxesToPay = Math.max(fedTax - fedBaseCredit - fedProvAbatement, 0)
        + Math.max(provTax - provBaseCredit, 0);

    return taxesToPay / income;
}
