/*
Sources
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/benefit-amount.html
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/recovery-tax.html
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/eligibility.html (delay bonus)
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments.html

Revised
    2023-01-03
*/

import { addYearsToDate, getMonthsDiff, now } from '../utils/date';
import { clamp } from '../utils/math';

export interface Repayment {
    MAX: number;
    MIN: number;
    RATIO: number;
}

export interface OldAgeSecurity {
    INCREASE: {
        AGE: number;
        RATE: number;
        REPAYMENT_MAX: number;
    }
    MAX_AGE: number;
    MIN_AGE: number;
    MONTHLY_PAYMENT_MAX: number;
    MONTHLY_DELAY_BONUS: number;
    REPAYMENT: Repayment;

    getMinRequestDateFactor(birthDate: Date, requestDate: Date): number,

    getRequestDateFactor(birthDate: Date, requestDate: Date): number;

    getRepaymentMax(startOfYearAge: number): number;
}

export const OAS: OldAgeSecurity = {
    getMinRequestDateFactor(birthDate: Date, requestDate: Date): number {
        const minRequestDate = addYearsToDate(birthDate, this.MIN_AGE);
        const maxRequestDate = addYearsToDate(birthDate, this.MAX_AGE);

        const monthsToToday = getMonthsDiff(birthDate, now());
        const monthsToLastBirthDay = monthsToToday - (monthsToToday % 12);
        const monthsToMinRequestDate = getMonthsDiff(birthDate, minRequestDate);
        const monthsToMaxRequestDate = getMonthsDiff(birthDate, maxRequestDate);
        const monthsToRequestDate = getMonthsDiff(birthDate, requestDate);

        const receivingOASPayment = monthsToRequestDate >= monthsToMinRequestDate && monthsToRequestDate
            <= monthsToMaxRequestDate && monthsToRequestDate <= monthsToToday;

        if (monthsToLastBirthDay < monthsToMinRequestDate || monthsToLastBirthDay > monthsToMaxRequestDate
            || receivingOASPayment) {
            return 1;
        }

        const monthsDelta = monthsToLastBirthDay - monthsToMinRequestDate;
        return 1 + (monthsDelta * this.MONTHLY_DELAY_BONUS);
    },
    getRequestDateFactor(birthDate: Date, requestDate: Date): number {
        const minRequestDate = addYearsToDate(birthDate, this.MIN_AGE);
        const maxRequestDate = addYearsToDate(birthDate, this.MAX_AGE);

        const monthsToToday = getMonthsDiff(birthDate, now());
        const monthsToLastBirthDay = monthsToToday - (monthsToToday % 12);
        const monthsToMinRequestDate = getMonthsDiff(birthDate, minRequestDate);
        const monthsToMaxRequestDate = getMonthsDiff(birthDate, maxRequestDate);
        const monthsToRequestDate = getMonthsDiff(birthDate, requestDate);
        const clampedMonthsToRequestDate = clamp(monthsToRequestDate, monthsToMinRequestDate, monthsToMaxRequestDate);
        const deltaMonthsFromMinRequestDate = clampedMonthsToRequestDate - monthsToMinRequestDate;
        const receivingOASPayment = monthsToRequestDate >= monthsToMinRequestDate && monthsToRequestDate
            <= monthsToMaxRequestDate && monthsToRequestDate <= monthsToToday;

        if (monthsToLastBirthDay > monthsToMaxRequestDate || receivingOASPayment) {
            return 1;
        }

        if (monthsToRequestDate < monthsToMinRequestDate) {
            return 0;
        }

        return 1 + (deltaMonthsFromMinRequestDate * this.MONTHLY_DELAY_BONUS);
    },
    getRepaymentMax(startOfYearAge: number): number {
        return startOfYearAge >= OAS.INCREASE.AGE - 1 ? OAS.INCREASE.REPAYMENT_MAX : OAS.REPAYMENT.MAX;
    },
    MAX_AGE: 70,
    MIN_AGE: 65,
    INCREASE: {
        AGE: 75,
        RATE: 0.1,
        REPAYMENT_MAX: 147418,
    },
    MONTHLY_PAYMENT_MAX: 691.00,
    MONTHLY_DELAY_BONUS: 0.006,
    REPAYMENT: {
        MAX: 141917,
        MIN: 86912,
        RATIO: 0.15,
    },
};
