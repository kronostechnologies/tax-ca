import { getCapitalGainsTaxableAmount } from '../non-registered-savings-plan';

describe('getCapitalGainsTaxableAmount', () => {
    it('should calculate taxable amount on capital gains income', () => {
        const capitalGainsList = [
            { capitalGains: 150000, taxableAmount: 75000 },
            { capitalGains: 0, taxableAmount: 0 },
            { capitalGains: -50, taxableAmount: 0 },
            { capitalGains: 250000, taxableAmount: 125000 },
            { capitalGains: 350000, taxableAmount: 175000 },
            { capitalGains: 249000, taxableAmount: 124500 },
            { capitalGains: 250001, taxableAmount: 125000.5 },
        ];

        capitalGainsList.forEach((item) => {
            const taxableAmount = getCapitalGainsTaxableAmount(item.capitalGains);
            expect(taxableAmount).toBe(item.taxableAmount);
        });
    });
});
