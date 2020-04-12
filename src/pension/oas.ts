/*
Sources:
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/recovery-tax.html
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/eligibility.html (delay bonus)

Revised 2019-12-23
*/

import { addYearsToDate, getMonthsDiff, now } from '../utils/date';
import { clamp } from '../utils/math';

export = {
    getRequestDateFactor(paramBirthDate: Date | string, paramRequestDate: Date | string): number {
        const birthDate = typeof paramBirthDate === 'string' ? new Date(paramBirthDate) : paramBirthDate;
        const requestDate = typeof paramRequestDate === 'string' ? new Date(paramRequestDate) : paramRequestDate;

        const minRequestDate = addYearsToDate(birthDate, this.MIN_AGE);
        const maxRequestDate = addYearsToDate(birthDate, this.MAX_AGE);

        const monthsToToday = getMonthsDiff(birthDate, now());
        const monthsToMinRequestDate = getMonthsDiff(birthDate, minRequestDate);
        const monthsToMaxRequestDate = getMonthsDiff(birthDate, maxRequestDate);
        const monthsToRequestDate = getMonthsDiff(birthDate, requestDate);
        const monthsToLastBirthDay = monthsToToday - (monthsToToday % 12);

        // Request date is before minimum request date
        if (monthsToRequestDate < monthsToMinRequestDate) {
            return 0;
        }
        // Analysis date is after the maximum request date OR request date is in the past
        if (monthsToMaxRequestDate < monthsToToday || monthsToRequestDate < monthsToLastBirthDay) {
            return 1;
        }

        let monthsDelta = clamp(monthsToRequestDate, monthsToMinRequestDate, monthsToMaxRequestDate);
        monthsDelta -= Math.max(monthsToLastBirthDay, monthsToMinRequestDate);

        return 1 + (monthsDelta * this.MONTHLY_DELAY_BONUS);
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
