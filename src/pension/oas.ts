/*
Sources:
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/recovery-tax.html
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/eligibility.html (delay bonus)

Revised 2019-12-23
*/

import { getBirthdayAtAge, getLatestBirthday, getMonthsDiff } from '../utils/date';

export = {
    getRequestDateFactor(birthDate: Date, requestDate: Date): number {
        const birthdayAtMinAge = getBirthdayAtAge(birthDate, this.MIN_AGE);
        // when request date is before the min date, return factor 0 as no income should be received before the min date
        if (requestDate < birthdayAtMinAge) {
            return 0;
        }

        const latestBirthday = getLatestBirthday(birthDate);
        const birthdayAtMaxAge = getBirthdayAtAge(birthDate, this.MAX_AGE);
        // when latest birthday is after max date, no factor is applied as the income is received as is
        if (latestBirthday >= birthdayAtMaxAge) {
            return 1;
        }

        let referenceDate = birthdayAtMinAge;
        if (latestBirthday > birthdayAtMinAge) {
            referenceDate = latestBirthday;
        }
        const monthsDiff = getMonthsDiff(referenceDate, requestDate);
        return 1 + (monthsDiff * this.MONTHLY_DELAY_BONUS);
    },
    MAX_AGE: 70,
    MIN_AGE: 65,
    MONTHLY_PAYMENT_MAX: 613.53,
    MONTHLY_DELAY_BONUS: 0.006,
    REPAYMENT: {
        MAX: 126058,
        MIN: 77580,
        RATIO: 0.15,
    },
};
