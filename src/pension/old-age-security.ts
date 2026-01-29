/*
Sources
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/benefit-amount.html
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/recovery-tax.html
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/benefit-amount.html (delay bonus)

Revised
    2026-01-05
*/

import { addYearsToDate, getAge, getMonthsDiff, now, removeTime } from '../utils/date';
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
    AGE_OF_MAJORITY: number;
    MIN_RESIDENCY: number;
    MAX_RESIDENCY: number;
    MONTHLY_PAYMENT_MAX: number;
    MONTHLY_DELAY_BONUS: number;
    REPAYMENT: Repayment;
    getMinRequestDateFactor(birthDate: Date, requestDate: Date): number,
    getRequestDateFactor(birthDate: Date, requestDate: Date): number;
    getRepaymentMax(startOfYearAge: number): number;
    getMinimumRequestAge(yearsOutsideCanada: number): number;
    getMinimumRequestDate(birthDate: Date, yearsOutsideCanadaAtRequest: number): Date;
    validateRequestDate(requestDate: Date, birthDate: Date, yearsOutsideCanadaAtRequest: number): void;
    getResidencyYearsAtRequest(birthDate: Date, requestDate: Date, yearsOutsideCanadaAtRequest: number): number;
    getRequestDateMonthsDeferred(birthDate: Date, requestDate: Date, yearsOutsideCanadaAtRequest: number): number;
    isFullResidencyAtMinOASAge(birthDate: Date, yearsOutsideCanadaAtRequest: number): boolean;
    getMonthlyOASAmount(birthDate: Date, requestDate: Date, yearsOutsideCanadaAtRequest: number): number;
    getDeferredRequestAmount(monthsDeferred: number, ratio?: number): number;
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
    getMinimumRequestAge(yearsOutsideCanada: number): number {
        const effectiveResidencyStart = this.AGE_OF_MAJORITY + yearsOutsideCanada;
        const minAgeForResidency = effectiveResidencyStart + this.MIN_RESIDENCY;

        return Math.max(minAgeForResidency, this.MIN_AGE);
    },
    getMinimumRequestDate(birthDate: Date, yearsOutsideCanadaAtRequest: number = 0): Date {
        return addYearsToDate(birthDate, this.getMinimumRequestAge(yearsOutsideCanadaAtRequest));
    },
    validateRequestDate(
        requestDate: Date,
        birthDate: Date,
        yearsOutsideCanadaAtRequest: number,
    ): void {
        const minRequestDate = this.getMinimumRequestDate(birthDate, yearsOutsideCanadaAtRequest);
        const requestDateFormatted = removeTime(requestDate);
        const minRequestDateFormatted = removeTime(minRequestDate);
        if (requestDateFormatted < minRequestDateFormatted) {
            throw new Error('Invalid request date');
        }
    },
    getResidencyYearsAtRequest(
        birthDate: Date,
        requestDate: Date,
        yearsOutsideCanadaAtRequest: number,
    ): number {
        const ageAtRequest = getAge(birthDate, requestDate) as number;
        const residencyYearsAtRequest = ageAtRequest - this.AGE_OF_MAJORITY - yearsOutsideCanadaAtRequest;

        return Math.max(residencyYearsAtRequest, 0);
    },
    getRequestDateMonthsDeferred(
        birthDate: Date,
        requestDate: Date,
        yearsOutsideCanadaAtRequest: number = 0,
    ): number {
        this.validateRequestDate(requestDate, birthDate, yearsOutsideCanadaAtRequest);

        const minRequestDate = this.getMinimumRequestDate(birthDate, yearsOutsideCanadaAtRequest);
        const maximumAgeDeferredDate = addYearsToDate(birthDate, this.MAX_AGE);
        const maxDeferredDate = new Date(Math.min(maximumAgeDeferredDate.getTime(), requestDate.getTime()));
        return Math.abs(getMonthsDiff(maxDeferredDate, minRequestDate));
    },
    isFullResidencyAtMinOASAge(birthDate: Date, yearsOutsideCanadaAtRequest: number): boolean {
        const minRequestDate = addYearsToDate(birthDate, OAS.MIN_AGE);
        const residencyYearsAtMinRequestAge = this.getResidencyYearsAtRequest(
            birthDate,
            minRequestDate,
            yearsOutsideCanadaAtRequest,
        );
        return residencyYearsAtMinRequestAge >= OAS.MAX_RESIDENCY;
    },
    getDeferredRequestAmount(monthsDeferred: number, ratio: number = 1): number {
        return (ratio * OAS.MONTHLY_PAYMENT_MAX) * (1 + (OAS.MONTHLY_DELAY_BONUS * monthsDeferred));
    },
    getMonthlyOASAmount(birthDate: Date, requestDate: Date, yearsOutsideCanadaAtRequest: number = 0): number {
        this.validateRequestDate(requestDate, birthDate, yearsOutsideCanadaAtRequest);

        const monthsDeferred = this.getRequestDateMonthsDeferred(birthDate, requestDate, yearsOutsideCanadaAtRequest);

        const isFullResidency = this.isFullResidencyAtMinOASAge(birthDate, yearsOutsideCanadaAtRequest);
        if (isFullResidency) {
            return this.getDeferredRequestAmount(monthsDeferred);
        }

        // PSV partielle
        // Solution pour report de la date de demande
        const minRequestDate = this.getMinimumRequestDate(birthDate, yearsOutsideCanadaAtRequest) as Date;
        const residencyYearsAtMinRequest = this.getResidencyYearsAtRequest(
            birthDate,
            minRequestDate,
            yearsOutsideCanadaAtRequest,
        );
        const ratioAtMinRequestDate = Math.min(residencyYearsAtMinRequest / OAS.MAX_RESIDENCY, 1);
        const requestDateReportAmount = this.getDeferredRequestAmount(monthsDeferred, ratioAtMinRequestDate);

        // Solution pour report année de résidence
        const residencyYearsAtRequest = this.getResidencyYearsAtRequest(
            birthDate,
            requestDate,
            yearsOutsideCanadaAtRequest,
        );
        const ratioAtRequestDate = Math.min(residencyYearsAtRequest / OAS.MAX_RESIDENCY, 1);
        const deferredResidenceRequestAmount = OAS.MONTHLY_PAYMENT_MAX * ratioAtRequestDate;

        return Math.max(deferredResidenceRequestAmount, requestDateReportAmount);
    },
    MAX_AGE: 70,
    MIN_AGE: 65,
    AGE_OF_MAJORITY: 18,
    MIN_RESIDENCY: 10,
    MAX_RESIDENCY: 40,
    INCREASE: {
        AGE: 75,
        RATE: 0.1,
        REPAYMENT_MAX: 157923,
    },
    MONTHLY_PAYMENT_MAX: 742.31,
    MONTHLY_DELAY_BONUS: 0.006,
    REPAYMENT: {
        MAX: 152062,
        MIN: 93454,
        RATIO: 0.15,
    },
};
