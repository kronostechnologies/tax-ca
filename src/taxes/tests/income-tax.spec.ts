import {
    getFederalBaseCredit, getFederalBaseTaxAmount,
    getFederalBasicPersonalAmount,
    getFederalTaxAmount,
    getProvincialAbatement,
    getProvincialBaseCredit,
    getProvincialBaseTaxAmount,
    getProvincialSurtaxAmount,
    getProvincialTaxAmount,
} from '../income-tax';
import { roundToPrecision } from '../../utils';

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
            const baseCredit = getFederalBaseCredit(grossIncome, inflationRate, yearsToInflate);
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

    describe('getFederalBasePersonalAmount', () => {
        it.each([
            { grossIncome: 60000, expectedBPA: 16452.00 },
            { grossIncome: 150000, expectedBPA: 16452.00 },
            { grossIncome: 181440, expectedBPA: 16452.00 },
            { grossIncome: 210000, expectedBPA: 15850.34 },
            { grossIncome: 221435, expectedBPA: 15609.45 },
            { grossIncome: 258482, expectedBPA: 14829.00 },
            { grossIncome: 300000, expectedBPA: 14829.00 },
        ])(
            'should return BPA=$expectedBPA for income $grossIncome',
            ({ grossIncome, expectedBPA }) => {
                const bpa = getFederalBasicPersonalAmount(grossIncome, 0, 0);
                expect(roundToPrecision(bpa, 2)).toBe(expectedBPA);
            },
        );
    });

    describe('getFederalBaseCredit', () => {
        it.each([
            { grossIncome: 60000, expectedCredit: 2303.28 },
            { grossIncome: 150000, expectedCredit: 2303.28 },
            { grossIncome: 181440, expectedCredit: 2303.28 },
            { grossIncome: 210000, expectedCredit: 2219.05 },
            { grossIncome: 221435, expectedCredit: 2185.32 },
            { grossIncome: 258482, expectedCredit: 2076.06 },
            { grossIncome: 300000, expectedCredit: 2076.06 },
        ])(
            'should return credit=$expectedCredit for income $grossIncome',
            ({ grossIncome, expectedCredit }) => {
                const credit = getFederalBaseCredit(grossIncome, 0, 0);
                expect(roundToPrecision(credit, 2)).toBe(expectedCredit);
            },
        );
    });
});
