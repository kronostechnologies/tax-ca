import { CanadaLearningBond } from '../canada-learning-bond';
import { IncomeLevel } from '../income-level';

describe('CanadaLearningBond', () => {
    describe('getTotalBond', () => {
        it('should return 0 for all income level but low', () => {
            const income = IncomeLevel.LOW_INCOME_THRESHOLD + 1;
            const beneficiaryAge = CanadaLearningBond.MAX_BENEFICIARY_AGE;
            const expectedTotalBond = 0;
            const totalBond = CanadaLearningBond.getTotalForAYear(income, beneficiaryAge);
            expect(totalBond).toBe(expectedTotalBond);
        });

        it('should return 0 if beneficiary age is above max age', () => {
            const income = IncomeLevel.LOW_INCOME_THRESHOLD;
            const beneficiaryAge = CanadaLearningBond.MAX_BENEFICIARY_AGE + 1;
            const expectedTotalBond = 0;
            const totalBond = CanadaLearningBond.getTotalForAYear(income, beneficiaryAge);
            expect(totalBond).toBe(expectedTotalBond);
        });

        it('should return opening account CLB for opening year', () => {
            const income = IncomeLevel.LOW_INCOME_THRESHOLD;
            const beneficiaryAge = CanadaLearningBond.MAX_BENEFICIARY_AGE;
            const openingYearCLB = CanadaLearningBond.OPENING_YEAR_CLB;
            const totalBond = CanadaLearningBond.getTotalForAYear(income, beneficiaryAge, true);
            expect(totalBond).toBe(openingYearCLB);
        });

        it('should return yearly bond after opening year', () => {
            const income = IncomeLevel.LOW_INCOME_THRESHOLD;
            const beneficiaryAge = CanadaLearningBond.MAX_BENEFICIARY_AGE;
            const yearlyCLB = CanadaLearningBond.YEARLY_CLB;
            const totalBond = CanadaLearningBond.getTotalForAYear(income, beneficiaryAge, false);
            expect(totalBond).toBe(yearlyCLB);
        });
    });
});
