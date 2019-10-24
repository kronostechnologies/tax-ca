/*
Sources:
  http://www.taxtips.ca/marginaltaxrates.htm

Revised 2018-12-21
*/

import { maxBy } from '../utils/collections';

export type ProvinceName =
    'ALBERTA'
    | 'BRITISH_COLUMBIA'
    | 'MANITOBA'
    | 'NEW_BRUNSWICK'
    | 'NEWFOUNDLAND'
    | 'NOVA_SCOTIA'
    | 'PRINCE_EDWARD_ISLAND'
    | 'ONTARIO'
    | 'QUEBEC'
    | 'SASKATCHEWAN'
    | 'NORTHWEST_TERRITORIES'
    | 'NUNAVUT'
    | 'YUKON';
export type ProvinceCode = 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'PE' | 'ON' | 'QC' | 'SK' | 'NT' | 'NU' | 'YT';
export type FederalCode = 'CA';

const PROVINCIAL_CODES: { [key in ProvinceName]: ProvinceCode } = {
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

export interface Rate {
    FROM: number;
    TO: number;
    RATE: number;
}

export interface TaxBracketsElement {
    ABATEMENT: number;
    TAX_CREDIT_RATE: number;
    BASE_TAX_CREDIT: number;
    RATES: Rate[];
    SURTAX_RATES: Rate[];
}

const TAX_BRACKETS: { [key in ProvinceCode | FederalCode]: TaxBracketsElement } = {
    CA: {
        ABATEMENT: 0,
        TAX_CREDIT_RATE: 0.15,
        BASE_TAX_CREDIT: 12069,
        RATES: [{
            FROM: 0,
            TO: 47630,
            RATE: 0.15,
        }, {
            FROM: 47630,
            TO: 95259,
            RATE: 0.205,
        }, {
            FROM: 95259,
            TO: 147667,
            RATE: 0.26,
        }, {
            FROM: 147667,
            TO: 210371,
            RATE: 0.29,
        }, {
            FROM: 210371,
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
        BASE_TAX_CREDIT: 10682,
        RATES: [{
            FROM: 0,
            TO: 40707,
            RATE: 0.0506,
        }, {
            FROM: 40707,
            TO: 81416,
            RATE: 0.077,
        }, {
            FROM: 81416,
            TO: 93476,
            RATE: 0.105,
        }, {
            FROM: 93476,
            TO: 113506,
            RATE: 0.1229,
        }, {
            FROM: 113506,
            TO: 153900,
            RATE: 0.147,
        }, {
            FROM: 153900,
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
        BASE_TAX_CREDIT: 9626,
        RATES: [{
            FROM: 0,
            TO: 32670,
            RATE: 0.108,
        }, {
            FROM: 32670,
            TO: 70610,
            RATE: 0.1275,
        }, {
            FROM: 70610,
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
        BASE_TAX_CREDIT: 10264,
        RATES: [{
            FROM: 0,
            TO: 42592,
            RATE: 0.0968,
        }, {
            FROM: 42592,
            TO: 85184,
            RATE: 0.1482,
        }, {
            FROM: 85184,
            TO: 138491,
            RATE: 0.1652,
        }, {
            FROM: 138491,
            TO: 157778,
            RATE: 0.1784,
        }, {
            FROM: 157778,
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
        BASE_TAX_CREDIT: 9414,
        RATES: [{
            FROM: 0,
            TO: 37591,
            RATE: 0.087,
        }, {
            FROM: 37591,
            TO: 75181,
            RATE: 0.145,
        }, {
            FROM: 75181,
            TO: 134224,
            RATE: 0.158,
        }, {
            FROM: 134224,
            TO: 187913,
            RATE: 0.173,
        }, {
            FROM: 187913,
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
        BASE_TAX_CREDIT: 9160,
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
        BASE_TAX_CREDIT: 10582,
        RATES: [{
            FROM: 0,
            TO: 43906,
            RATE: 0.0505,
        }, {
            FROM: 43906,
            TO: 87813,
            RATE: 0.0915,
        }, {
            FROM: 87813,
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
            TO: 4740,
            RATE: 0,
        }, {
            FROM: 4740,
            TO: 6067,
            RATE: 0.20,
        }, {
            FROM: 6067,
            TO: 999999999,
            RATE: 0.56, // 0.20 + 0.36
        }],
    },
    QC: {
        ABATEMENT: 0.165, // http://www.cra-arc.gc.ca/tx/ndvdls/tpcs/ncm-tx/rtrn/cmpltng/ddctns/lns409-485/440-fra.html
        TAX_CREDIT_RATE: 0.15,
        BASE_TAX_CREDIT: 15269,
        RATES: [{
            FROM: 0,
            TO: 43790,
            RATE: 0.15,
        }, {
            FROM: 43790,
            TO: 87575,
            RATE: 0.20,
        }, {
            FROM: 87575,
            TO: 106555,
            RATE: 0.24,
        }, {
            FROM: 106555,
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
        BASE_TAX_CREDIT: 14811,
        RATES: [{
            FROM: 0,
            TO: 43137,
            RATE: 0.059,
        }, {
            FROM: 43137,
            TO: 86277,
            RATE: 0.086,
        }, {
            FROM: 86277,
            TO: 140267,
            RATE: 0.122,
        }, {
            FROM: 140267,
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
        BASE_TAX_CREDIT: 13618,
        RATES: [{
            FROM: 0,
            TO: 45414,
            RATE: 0.04,
        }, {
            FROM: 45414,
            TO: 90829,
            RATE: 0.07,
        }, {
            FROM: 90829,
            TO: 147667,
            RATE: 0.09,
        }, {
            FROM: 147667,
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
        BASE_TAX_CREDIT: 12069,
        RATES: [{
            FROM: 0,
            TO: 47630,
            RATE: 0.064,
        }, {
            FROM: 47630,
            TO: 95259,
            RATE: 0.09,
        }, {
            FROM: 95259,
            TO: 147667,
            RATE: 0.109,
        }, {
            FROM: 147667,
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

export const INCOME_TAX = {
    FEDERAL_CODE: 'CA' as FederalCode,
    calculateEffectiveTaxRate(income: number, province: ProvinceCode): number {
        if (income <= 0) {
            return 0;
        }

        const provTax = this.getProvincialTaxAmount(province, income, 0, 0);
        const provBaseCredit = this.getProvincialBaseCredit(province, 0, 0);

        const fedTax = this.getFederalTaxAmount(income, 0, 0);
        const fedBaseCredit = this.getFederalBaseCredit(0, 0);
        const fedProvAbatement = this.getProvincialAbatement(province, fedTax - fedBaseCredit);

        const taxesToPay = Math.max(fedTax - fedBaseCredit - fedProvAbatement, 0)
            + Math.max(provTax - provBaseCredit, 0);

        return taxesToPay / income;
    },
    getFederalMarginalRate(
        provincialCode: ProvinceCode,
        grossIncome: number,
        inflationRate = 0,
        yearsToInflate = 0,
    ): number {
        const fedTax = this.getFederalTaxAmount(grossIncome, inflationRate, yearsToInflate);
        const fedBaseCredit = this.getFederalBaseCredit(inflationRate, yearsToInflate);
        const fedProvAbatement = this.getProvincialAbatement(provincialCode, fedTax - fedBaseCredit);

        return grossIncome <= 0 ? 0 : Math.max(fedTax - fedBaseCredit - fedProvAbatement, 0) / grossIncome;
    },
    getFederalTaxAmount(grossIncome: number, inflationRate = 0, yearsToInflate = 0): number {
        let fedTax = 0;
        this.TAX_BRACKETS.CA.RATES.forEach(bracket => {
            const bracketFrom = bracket.FROM * ((1 + inflationRate) ** yearsToInflate);
            if (bracketFrom < grossIncome) {
                const bracketTo = bracket.TO * ((1 + inflationRate) ** yearsToInflate);
                fedTax += (Math.min(grossIncome, bracketTo) - bracketFrom) * bracket.RATE;
            }
        });
        return fedTax;
    },
    getFederalBaseCredit(inflationRate: number, yearsToInflate: number): number {
        return this.TAX_BRACKETS.CA.BASE_TAX_CREDIT
            * this.TAX_BRACKETS.CA.TAX_CREDIT_RATE
            * ((1 + inflationRate) ** yearsToInflate);
    },
    getProvincialAbatement(province: ProvinceCode, federalTaxAmount: number): number {
        return this.TAX_BRACKETS[province].ABATEMENT * federalTaxAmount;
    },
    getProvincialTaxAmount(
        provincialCode: ProvinceCode,
        grossIncome: number,
        inflationRate = 0,
        yearsToInflate = 0,
    ): number {
        let provTax = 0;
        this.TAX_BRACKETS[provincialCode].RATES.forEach(bracket => {
            const bracketFrom = bracket.FROM * ((1 + inflationRate) ** yearsToInflate);
            if (bracketFrom < grossIncome) {
                const bracketTo = bracket.TO * ((1 + inflationRate) ** yearsToInflate);
                provTax += (Math.min(grossIncome, bracketTo) - bracketFrom) * bracket.RATE;
            }
        });
        return provTax;
    },
    getProvincialSurtaxAmount(
        province: ProvinceCode,
        baseTaxAmount: number,
        inflationRate = 0,
        yearsToInflate = 0,
    ): number {
        let surtaxAmount = 0;
        this.TAX_BRACKETS[province].SURTAX_RATES.forEach(bracket => {
            const bracketFrom = bracket.FROM * ((1 + inflationRate) ** yearsToInflate);
            if (bracketFrom < baseTaxAmount) {
                const bracketTo = bracket.TO * ((1 + inflationRate) ** yearsToInflate);
                surtaxAmount += (Math.min(baseTaxAmount, bracketTo) - bracketFrom) * (bracket.RATE);
            }
        });
        return surtaxAmount;
    },
    getProvincialMarginalRate(
        provincialCode: ProvinceCode,
        grossIncome: number,
        inflationRate = 0,
        yearsToInflate = 0,
    ): number {
        let marginalRate = 0;
        const baseTaxAmount = this.getProvincialTaxAmount(provincialCode, grossIncome, inflationRate, yearsToInflate);

        this.TAX_BRACKETS[provincialCode].RATES.forEach(bracket => {
            const bracketFrom = bracket.FROM * ((1 + inflationRate) ** yearsToInflate);
            if (bracketFrom < grossIncome) {
                marginalRate = bracket.RATE;
            }
        });

        let surtaxRate = 0;
        this.TAX_BRACKETS[provincialCode].SURTAX_RATES.forEach(bracket => {
            const bracketFrom = bracket.FROM * ((1 + inflationRate) ** yearsToInflate);
            if (bracketFrom < baseTaxAmount) {
                surtaxRate = bracket.RATE;
            }
        });

        return marginalRate * (1 + surtaxRate);
    },
    getProvincialBaseCredit(province: ProvinceCode, inflationRate: number, yearsToInflate: number): number {
        return this.TAX_BRACKETS[province].BASE_TAX_CREDIT
            * this.TAX_BRACKETS[province].RATES[0].RATE
            * ((1 + inflationRate) ** yearsToInflate);
    },
    getTotalMarginalRate(
        provincialCode: ProvinceCode,
        grossIncome: number,
        inflationRate = 0,
        yearsToInflate = 0,
    ): number {
        const provRate = this.getProvincialMarginalRate(provincialCode, grossIncome, inflationRate, yearsToInflate);
        const fedRate = this.getFederalMarginalRate(provincialCode, grossIncome, inflationRate, yearsToInflate);

        return provRate + fedRate;
    },
    getMaxProvincialMarginalRate(provincialCode: ProvinceCode): number {
        // tslint:disable-next-line:no-non-null-assertion
        const marginalRate = maxBy(this.TAX_BRACKETS[provincialCode].RATES, (bracket: Rate) => bracket.TO)!.RATE;
        // tslint:disable-next-line:no-non-null-assertion
        const surtaxRate = maxBy(this.TAX_BRACKETS[provincialCode].SURTAX_RATES, bracket => bracket.TO)!.RATE;

        return marginalRate * (1 + surtaxRate);
    },
    getMaxFederalMarginalRate(provincialCode: ProvinceCode): number {
        // tslint:disable-next-line:no-non-null-assertion
        const maxRate = maxBy(this.TAX_BRACKETS[this.FEDERAL_CODE].RATES, bracket => bracket.TO)!.RATE;
        return maxRate * (1 - this.TAX_BRACKETS[provincialCode].ABATEMENT);
    },
    getTotalMaxMarginalRate(provincialCode: ProvinceCode): string {
        const provRate = this.getMaxProvincialMarginalRate(provincialCode);
        const fedRate = this.getMaxFederalMarginalRate(provincialCode);

        return (provRate + fedRate).toPrecision(4);
    },
    getTotalTaxAmount(
        provincialCode: ProvinceCode,
        grossIncome: number,
        inflationRate = 0,
        yearsToInflate = 0,
    ): number {
        const provTax = this.getProvincialTaxAmount(provincialCode, grossIncome, inflationRate, yearsToInflate);
        const provSurtax = this.getProvincialSurtaxAmount(provincialCode, provTax, inflationRate, yearsToInflate);
        const fedTax = this.getFederalTaxAmount(grossIncome, inflationRate, yearsToInflate);

        return provTax + provSurtax + fedTax;
    },
    PROVINCIAL_CODES,
    TAX_BRACKETS,
};
