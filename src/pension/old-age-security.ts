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

    getMinRequestDateFactor(birthDate: Date): number,
    getRequestDateFactor(birthDate: Date, requestDate: Date): number;

    getRepaymentMax(startOfYearAge: number): number;
}

export const OAS: OldAgeSecurity = {
    getMinRequestDateFactor(birthDate: Date): number {
        const minRequestDate = addYearsToDate(birthDate, this.MIN_AGE);
        const maxRequestDate = addYearsToDate(birthDate, this.MAX_AGE);

        const monthsToToday = getMonthsDiff(birthDate, now());
        const monthsToLastBirthDay = monthsToToday - (monthsToToday % 12);
        const monthsToMinRequestDate = getMonthsDiff(birthDate, minRequestDate);
        const monthsToMaxRequestDate = getMonthsDiff(birthDate, maxRequestDate);

        if (monthsToLastBirthDay < monthsToMinRequestDate || monthsToLastBirthDay > monthsToMaxRequestDate) {
            return 1;
        }

        const monthsDelta = monthsToLastBirthDay - monthsToMinRequestDate;
        return 1 + (monthsDelta * this.MONTHLY_DELAY_BONUS);
    },
    getRequestDateFactor(birthDate: Date, requestDate: Date): number {
        const minRequestDate = addYearsToDate(birthDate, this.MIN_AGE);

        const monthsToToday = getMonthsDiff(birthDate, now());
        const monthsToLastBirthDay = monthsToToday - (monthsToToday % 12);
        const monthsToMinRequestDate = getMonthsDiff(birthDate, minRequestDate);
        const monthsToRequestDate = getMonthsDiff(birthDate, requestDate);
        const deltaMonthsFromtMinRequestDate = monthsToRequestDate - monthsToMinRequestDate;

        if (monthsToLastBirthDay > monthsToRequestDate) {
            return 1;
        }

        return 1 + (deltaMonthsFromtMinRequestDate * this.MONTHLY_DELAY_BONUS);
    },
    getRepaymentMax(startOfYearAge: number): number {
        return startOfYearAge >= OAS.INCREASE.AGE - 1 ? OAS.INCREASE.REPAYMENT_MAX : OAS.REPAYMENT.MAX;
    },
    MAX_AGE: 70,
    MIN_AGE: 65,
    INCREASE: {
        AGE: 75,
        RATE: 0.1,
        REPAYMENT_MAX: 137331,
    },
    MONTHLY_PAYMENT_MAX: 685.50,
    MONTHLY_DELAY_BONUS: 0.006,
    REPAYMENT: {
        MAX: 134626,
        MIN: 81761,
        RATIO: 0.15,
    },
};
