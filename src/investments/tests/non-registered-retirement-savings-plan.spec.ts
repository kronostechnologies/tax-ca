import { getCapitalGainsTaxableAmount } from '../non-registered-savings-plan';

describe('getCapitalGainsTaxableAmount', () => {
    it('should calculate taxable amount on capital gains income', () => {
        const capitalGainsList = [
            { capitalGains: 150000, taxableAmount: 75000 },
            { capitalGains: 0, taxableAmount: 0 },
            { capitalGains: -50, taxableAmount: 0 },
            { capitalGains: 250000, taxableAmount: 125000 },
            { capitalGains: 350000, taxableAmount: 191666.66666666666 },
            { capitalGains: 350001, taxableAmount: 191667.3333333333 },
            { capitalGains: 250100, taxableAmount: 125066.66666666667 },
            { capitalGains: 249000, taxableAmount: 124500 },
            { capitalGains: 250001, taxableAmount: 125000.66666666667 },
        ];

        capitalGainsList.forEach((item) => {
            const taxableAmount = getCapitalGainsTaxableAmount(item.capitalGains);
            expect(taxableAmount).toBe(item.taxableAmount);
        });
    });
});
