/*
 Sources
 https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/benefit-amount.html
 https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/recovery-tax.html
 https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/eligibility.html (delay bonus)
 https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments.html

 Revised
 2022-04-07
 */

import { addYearsToDate, getMonthsDiff, now } from '../utils/date';
import { clamp } from '../utils/math';

export interface Repayment {
    MAX: number;
    MIN: number;
    RATIO: number;
}

export interface OldAgeSecurity {
    MAX_AGE: number;
    MIN_AGE: number;
    INCREASE_AGE: number;
    INCREASE_RATE: number;
    MONTHLY_PAYMENT_MAX: number;
    MONTHLY_DELAY_BONUS: number;
    REPAYMENT: Repayment;

    getRequestDateFactor(birthDate: Date, requestDate: Date): number;
}

export const OAS: OldAgeSecurity = {
    getRequestDateFactor(birthDate: Date, requestDate: Date): number {
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
    INCREASE_AGE: 75,
    INCREASE_RATE: 0.1,
    MONTHLY_PAYMENT_MAX: 648.67,
    MONTHLY_DELAY_BONUS: 0.006,
    REPAYMENT: {
        MAX: 133527,
        MIN: 81761,
        RATIO: 0.15,
    },
};
