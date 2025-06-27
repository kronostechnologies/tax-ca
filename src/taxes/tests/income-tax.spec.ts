import {
    getFederalBaseCredit, getFederalBaseTaxAmount,
    getFederalTaxAmount, getProvincialAbatement,
    getProvincialBaseCredit,
    getProvincialBaseTaxAmount,
    getProvincialSurtaxAmount,
    getProvincialTaxAmount,
    getFederalTaxCreditRate,
    getFederalTaxRates,
} from '../income-tax';

import * as Date from '../../utils/date';

describe('getTaxAMount', () => {
    describe('getProvincialTaxAmount', () => {
        it('should calculate operations in the right order for ON', () => {
            const province = 'ON';
            const grossIncome = 207000;
            const inflationRate = 0.021;
            const yearsToInflate = 0;
            const taxCredit = 20700;
            const baseTaxAmount = getProvincialBaseTaxAmount(
                province,
                grossIncome,
                inflationRate,
                yearsToInflate,
            );
            const baseCredit = getProvincialBaseCredit(province, inflationRate, yearsToInflate);
            const tax = Math.max(baseTaxAmount - baseCredit, 0);
            const surTax = getProvincialSurtaxAmount(province, tax, inflationRate, yearsToInflate);
            const expectedTax = Math.max(tax + surTax - taxCredit, 0);

            const provincialTaxAmount = getProvincialTaxAmount(
                province,
                grossIncome,
                inflationRate,
                yearsToInflate,
                taxCredit,
            );

            expect(provincialTaxAmount).toBe(expectedTax);
        });

        it('should calculate operations in the right order for QC', () => {
            const province = 'QC';
            const grossIncome = 209000;
            const inflationRate = 0.021;
            const yearsToInflate = 0;
            const taxCredit = 20900;
            const baseTaxAmount = getProvincialBaseTaxAmount(
                province,
                grossIncome,
                inflationRate,
                yearsToInflate,
            );
            const baseCredit = getProvincialBaseCredit(province, inflationRate, yearsToInflate);
            const tax = Math.max(baseTaxAmount - baseCredit, 0);
            const surTax = getProvincialSurtaxAmount(province, tax, inflationRate, yearsToInflate);
            const expectedTax = Math.max(tax + surTax - taxCredit, 0);

            const provincialTaxAmount = getProvincialTaxAmount(
                province,
                grossIncome,
                inflationRate,
                yearsToInflate,
                taxCredit,
            );

            expect(provincialTaxAmount).toBe(expectedTax);
        });
    });

    describe('getFederalTaxAmount', () => {
        it('should calculate operations in the right order', () => {
            const province = 'QC';
            const grossIncome = 100000;
            const inflationRate = 2.1;
            const yearsToInflate = 0;
            const taxCredit = 1000;
            const federalBaseTaxAmount = getFederalBaseTaxAmount(grossIncome, inflationRate, yearsToInflate);
            const baseCredit = getFederalBaseCredit(inflationRate, yearsToInflate);
            const federalTax = Math.max(federalBaseTaxAmount - baseCredit - taxCredit, 0);
            const abatement = getProvincialAbatement(province, federalTax);

            const federalTaxAmount = getFederalTaxAmount(
                province,
                grossIncome,
                inflationRate,
                yearsToInflate,
                taxCredit,
            );

            expect(federalTaxAmount).toBe(federalTax - abatement);
        });
    });

    describe('getFederalTaxCreditRate', () => {
        beforeEach(() => {
            jest.restoreAllMocks();
        });

        it('should return special tax credit rate when now is 2025', () => {
            const yearsToInflate = 0;

            jest.spyOn(Date, 'now').mockImplementation(() => new global.Date(2025, 0, 1));

            const result = getFederalTaxCreditRate(yearsToInflate);

            expect(result).toBe(0.145);
        });

        it('should return special tax credit rate when now is 2025 but inflating', () => {
            const yearsToInflate = 1;

            jest.spyOn(Date, 'now').mockImplementation(() => new global.Date(2025, 0, 1));

            const result = getFederalTaxCreditRate(yearsToInflate);

            expect(result).toBe(0.14);
        });

        it('should return regular tax credit rate when now is after 2025', () => {
            const yearsToInflate = 0;

            jest.spyOn(Date, 'now').mockImplementation(() => new global.Date(2026, 0, 1));

            const result = getFederalTaxCreditRate(yearsToInflate);

            expect(result).toBe(0.14);
        });
    });

    describe('getFederalTaxRates', () => {
        beforeEach(() => {
            jest.restoreAllMocks();
        });

        it('should return the correct rate for the first bracket when now is 2025', () => {
            const yearsToInflate = 0;

            jest.spyOn(Date, 'now').mockImplementation(() => new global.Date(2025, 0, 1));

            const result = getFederalTaxRates(yearsToInflate);

            expect(result[0].RATE).toBe(0.145);
        });

        it('should return the correct rate for the first bracket when now is 2025 but inflating', () => {
            const yearsToInflate = 1;

            jest.spyOn(Date, 'now').mockImplementation(() => new global.Date(2025, 0, 1));

            const result = getFederalTaxRates(yearsToInflate);

            expect(result[0].RATE).toBe(0.14);
        });

        it('should return the correct rate for the first bracket when now is after 2025', () => {
            const yearsToInflate = 0;

            jest.spyOn(Date, 'now').mockImplementation(() => new global.Date(2026, 0, 1));

            const result = getFederalTaxRates(yearsToInflate);

            expect(result[0].RATE).toBe(0.14);
        });
    });
});
