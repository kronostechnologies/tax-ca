/*
Sources:
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/recovery-tax.html
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/eligibility.html (delay bonus)

Revised 2019-12-23
*/

import { monthsDelta } from '../utils/date';

export = {
    getAAF(birthdate: Date, requestDate: Date): number {
        let monthsDeltaFromMinAge = monthsDelta(birthdate, requestDate);

        monthsDeltaFromMinAge = Math.min(monthsDeltaFromMinAge, this.MAX_AGE * 12);
        monthsDeltaFromMinAge -= this.MIN_AGE * 12;

        return monthsDeltaFromMinAge < 0 ? 0 : 1 + (monthsDeltaFromMinAge * this.MONTHLY_DELAY_BONUS);
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
