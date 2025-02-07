import { CanadaEducationSavingsGrant } from '../canada-education-savings-grant';
import { IncomeLevel } from '../income-level';

describe('getTotalForAYear', () => {
    it('should return 0 if total grant already given is greater than or equal to MAX_GRANT', () => {
        const income = 50000;
        const contribution = 2000;
        const totalGrantAlreadyGiven = CanadaEducationSavingsGrant.MAX_GRANT;
        const totalGrant = CanadaEducationSavingsGrant.getTotalForAYear(income, contribution, totalGrantAlreadyGiven);
        expect(totalGrant).toBe(0);
    });

    it('should return 0 if beneficiary age is greater than MAX_BENEFICIARY_AGE', () => {
        const income = 50000;
        const contribution = 2000;
        const beneficiaryAge = CanadaEducationSavingsGrant.MAX_BENEFICIARY_AGE + 1;
        const totalGrant = CanadaEducationSavingsGrant.getTotalForAYear(income, contribution, 0, beneficiaryAge);
        expect(totalGrant).toBe(0);
    });

    it('should return the correct total grant for a year for low income level', () => {
        const income = IncomeLevel.LOW_INCOME_THRESHOLD;
        const contribution = CanadaEducationSavingsGrant.MAX_AMOUNT_YEARLY_FOR_GRANT;
        const baseGrant = contribution * CanadaEducationSavingsGrant.YEARLY_GRANT_PERCENT;
        // eslint-disable-next-line max-len
        const suppGrant = CanadaEducationSavingsGrant.MAX_AMOUNT_FOR_SUPP_GRANT * CanadaEducationSavingsGrant.SUPP_GRANT_PERCENT_FOR_LOW_INCOME;
        const expectedTotalGrant = baseGrant + suppGrant;
        const totalGrant = CanadaEducationSavingsGrant.getTotalForAYear(income, contribution);
        expect(totalGrant).toBe(expectedTotalGrant);
    });

    // eslint-disable-next-line max-len
    it('should return the correct total grant for a year for low income level with higher than max contribution', () => {
        const income = IncomeLevel.LOW_INCOME_THRESHOLD;
        const contribution = CanadaEducationSavingsGrant.MAX_AMOUNT_YEARLY_FOR_GRANT + 1;
        // eslint-disable-next-line max-len
        const baseGrant = CanadaEducationSavingsGrant.MAX_AMOUNT_YEARLY_FOR_GRANT * CanadaEducationSavingsGrant.YEARLY_GRANT_PERCENT;
        // eslint-disable-next-line max-len
        const suppGrant = CanadaEducationSavingsGrant.MAX_AMOUNT_FOR_SUPP_GRANT * CanadaEducationSavingsGrant.SUPP_GRANT_PERCENT_FOR_LOW_INCOME;
        const expectedTotalGrant = baseGrant + suppGrant;
        const totalGrant = CanadaEducationSavingsGrant.getTotalForAYear(income, contribution);
        expect(totalGrant).toBe(expectedTotalGrant);
    });

    it('should return the correct total grant for a year for medium income level', () => {
        const income = IncomeLevel.MEDIUM_INCOME_THRESHOLD;
        const contribution = CanadaEducationSavingsGrant.MAX_AMOUNT_YEARLY_FOR_GRANT;
        const baseGrant = contribution * CanadaEducationSavingsGrant.YEARLY_GRANT_PERCENT;
        // eslint-disable-next-line max-len
        const suppGrant = CanadaEducationSavingsGrant.MAX_AMOUNT_FOR_SUPP_GRANT * CanadaEducationSavingsGrant.SUPP_GRANT_PERCENT_FOR_MEDIUM_INCOME;
        const expectedTotalGrant = baseGrant + suppGrant;
        const totalGrant = CanadaEducationSavingsGrant.getTotalForAYear(income, contribution);
        expect(totalGrant).toBe(expectedTotalGrant);
    });

    // eslint-disable-next-line max-len
    it('should return the correct total grant for a year for medium income level with higher than max contribution', () => {
        const income = IncomeLevel.MEDIUM_INCOME_THRESHOLD;
        const contribution = CanadaEducationSavingsGrant.MAX_AMOUNT_YEARLY_FOR_GRANT + 1;
        // eslint-disable-next-line max-len
        const baseGrant = CanadaEducationSavingsGrant.MAX_AMOUNT_YEARLY_FOR_GRANT * CanadaEducationSavingsGrant.YEARLY_GRANT_PERCENT;
        // eslint-disable-next-line max-len
        const suppGrant = CanadaEducationSavingsGrant.MAX_AMOUNT_FOR_SUPP_GRANT * CanadaEducationSavingsGrant.SUPP_GRANT_PERCENT_FOR_MEDIUM_INCOME;
        const expectedTotalGrant = baseGrant + suppGrant;
        const totalGrant = CanadaEducationSavingsGrant.getTotalForAYear(income, contribution);
        expect(totalGrant).toBe(expectedTotalGrant);
    });

    it('should return the correct total grant for a year for high income level', () => {
        const income = IncomeLevel.MEDIUM_INCOME_THRESHOLD + 1;
        const contribution = CanadaEducationSavingsGrant.MAX_AMOUNT_YEARLY_FOR_GRANT;
        const expectedTotalGrant = contribution * CanadaEducationSavingsGrant.YEARLY_GRANT_PERCENT;
        const totalGrant = CanadaEducationSavingsGrant.getTotalForAYear(income, contribution);
        expect(totalGrant).toBe(expectedTotalGrant);
    });
});
