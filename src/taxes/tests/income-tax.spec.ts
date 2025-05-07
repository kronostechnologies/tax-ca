import {
    getFederalBaseCredit, getFederalBaseTaxAmount,
    getFederalTaxAmount, getProvincialAbatement,
    getProvincialBaseCredit,
    getProvincialBaseTaxAmount,
    getProvincialSurtaxAmount,
    getProvincialTaxAmount,
} from '../income-tax';

describe('getTaxAMount', () => {
    describe('getProvincialTaxAmount', () => {
        it('should calculate operations in the right order', () => {
            const province = 'QC';
            const grossIncome = 100000;
            const inflationRate = 2.1;
            const yearsToInflate = 0;
            const taxCredit = 1000;
            const baseTaxAmount = getProvincialBaseTaxAmount(
                province,
                grossIncome,
                inflationRate,
                yearsToInflate,
            );
            const baseCredit = getProvincialBaseCredit(province, inflationRate, yearsToInflate);
            const tax = Math.max(baseTaxAmount - baseCredit - taxCredit, 0);
            const surTax = getProvincialSurtaxAmount(province, tax, inflationRate, yearsToInflate);

            const provincialTaxAmount = getProvincialTaxAmount(
                province,
                grossIncome,
                inflationRate,
                yearsToInflate,
                taxCredit,
            );

            expect(provincialTaxAmount).toBe(tax + surTax);
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
});
