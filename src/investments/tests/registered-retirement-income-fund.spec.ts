import { getMinimumWithdrawalPercentage } from '../registered-retirement-income-fund';

describe('getMinimumWithdrawalPercentage', () => {
    it(`should return correct percentage on age lower or equal to 70`, () => {
        const age = 70;
        const result = getMinimumWithdrawalPercentage(age);
        const calculation = 1 / (90 - age);

        expect(calculation).toBe(result);
    });
});
