import { getCapitalGainsTaxableAmount } from '../non-registered-savings-plan';

describe('getCapitalGainsTaxableAmount', () => {
    it('should calculate taxable amount on capital gains income', () => {
        const capitalGainsList = [
            { capitalGains: 150000, taxableAmount: 75000 },
            { capitalGains: 0, taxableAmount: 0 },
            { capitalGains: -50, taxableAmount: 0 },
            { capitalGains: 250000, taxableAmount: 125000 },
            { capitalGains: 350000, taxableAmount: 125000 + 66700 },
            { capitalGains: 350001, taxableAmount: 125000 + 66700.667 },
            { capitalGains: 250100, taxableAmount: 125000 + 66.7 },
            { capitalGains: 249000, taxableAmount: 124500 },
        ];

        capitalGainsList.forEach((item) => {
            let taxableAmount = 0;
            taxableAmount = getCapitalGainsTaxableAmount(item.capitalGains);
            expect(taxableAmount).toBe(item.taxableAmount);
        });
    });
});
