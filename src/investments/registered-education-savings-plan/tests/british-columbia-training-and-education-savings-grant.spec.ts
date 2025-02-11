// eslint-disable-next-line max-len
import { BritishColumbiaTrainingAndEducationSavingsGrant } from '../british-columbia-training-and-education-savings-grant';

describe('getTotalForAYear', () => {
    it('should give MAX_GRANT at BENEFICIARY_AGE_ALLOCATION', () => {
        const { BENEFICIARY_AGE_ALLOCATION, MAX_GRANT } = BritishColumbiaTrainingAndEducationSavingsGrant;
        const result = BritishColumbiaTrainingAndEducationSavingsGrant.getTotalForAYear(BENEFICIARY_AGE_ALLOCATION);
        expect(result).toBe(MAX_GRANT);
    });

    it('should not give MAX_GRANT if beneficiary age > BENEFICIARY_AGE_ALLOCATION', () => {
        const { BENEFICIARY_AGE_ALLOCATION } = BritishColumbiaTrainingAndEducationSavingsGrant;
        const result = BritishColumbiaTrainingAndEducationSavingsGrant.getTotalForAYear(BENEFICIARY_AGE_ALLOCATION + 1);
        expect(result).toBe(0);
    });

    it('should not give MAX_GRANT if beneficiary age < BENEFICIARY_AGE_ALLOCATION', () => {
        const { BENEFICIARY_AGE_ALLOCATION } = BritishColumbiaTrainingAndEducationSavingsGrant;
        const result = BritishColumbiaTrainingAndEducationSavingsGrant.getTotalForAYear(BENEFICIARY_AGE_ALLOCATION - 1);
        expect(result).toBe(0);
    });
});
