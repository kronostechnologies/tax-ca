import { getMinimumWithdrawalPercentage } from '../registered-retirement-income-fund';

describe('getMinimumWithdrawalPercentage', () => {
    it('should return correct percentage on age lower or equal to 70', () => {
        const age = 70;
        const result = getMinimumWithdrawalPercentage(age);

        // This is based on January 1st, but it is meant to be used with age at the end of the year, so we add one year.
        const calculation = 1 / (90 - age + 1);

        expect(calculation).toBe(result);
    });
});
