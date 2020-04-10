/*
Sources:
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/recovery-tax.html
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/eligibility.html (delay bonus)

Revised 2019-12-23
*/

import { addYearsToDate, getMonthsDiff, now } from '../utils/date';
import { clamp } from '../utils/math';

export = {
    getRequestDateFactor(birthDate: Date, requestDate: Date): number {
        const minRequestDate = addYearsToDate(birthDate, this.MIN_AGE);
        const maxRequestDate = addYearsToDate(birthDate, this.MAX_AGE);

        const monthsToToday = getMonthsDiff(birthDate, now());
        const monthsToMinRequestDate = getMonthsDiff(birthDate, minRequestDate);
        const monthsToMaxRequestDate = getMonthsDiff(birthDate, maxRequestDate);
        const monthsToRequestDate = getMonthsDiff(birthDate, requestDate);

        let monthsDelta = clamp(monthsToRequestDate, monthsToMinRequestDate, monthsToMaxRequestDate);
        monthsDelta -= Math.max(monthsToToday, monthsToMinRequestDate);
        const factor = 1 + (monthsDelta * this.MONTHLY_DELAY_BONUS);

        return monthsToRequestDate < monthsToMinRequestDate ? 0 : factor;
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
