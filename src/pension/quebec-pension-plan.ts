/*
Sources
    https://www.retraitequebec.gouv.qc.ca/en/landing/indexation/Pages/montants-donnees-base.aspx

Revised
    2025-12-22
*/

import { addYearsToDate, getMonthsDiff, now } from '../utils/date';
import { clamp, roundToPrecision } from '../utils/math';
import { PublicPensionPlan } from './public-pension-plan';

export const QPP: PublicPensionPlan = {
    PENSIONABLE_EARNINGS: {
        BASIC_EXEMPTION: 3500,
        // Year's maximum pensionable earnings (YMPE)
        YMPE: 74600,
        // Average YMPE of the last 5 year (including current year)
        YMPE_AVG_5: 69180,
        // Year's additional maximum pensionable earnings (YAMPE)
        YAMPE: 85000,
        // Year's additional maximum pensionable earnings (YAMPE) of the last 5 year (including current year)
        // YMPE to YAMPE factore used is 1.139 + rounded, to stay conservative in our projections.
        YAMPE_AVG_5: 77800,
    },
    CONTRIBUTION_RATES: {
        BASE: 0.063,
        ENHANCEMENT_STEP_2: 0.04,
    },
    DEATH_BENEFIT: { RATE: 0.5 },
    DEFAULT_REFERENCE_AGE: 65,
    FLAT_BENEFIT: {
        // Survivors' benefits
        ORPHAN: 3693.72,
        // Disability benefits
        DISABILITY: 20852.04,
        // Surviving spouse's pension
        UNDER_45: 8634.00,
        UNDER_45_WITH_CHILD: 13559.40,
        UNDER_45_DISABLED: 14082.96,
        FROM_45_TO_64: 14082.96,
        OVER_64_WITHOUT_PENSION: 10577.76,
    },
    INDEXATION_RATE_REFERENCES: [
        [2007, 0.021],
        [2008, 0.020],
        [2009, 0.025],
        [2010, 0.004],
        [2011, 0.017],
        [2012, 0.028],
        [2013, 0.018],
        [2014, 0.009],
        [2015, 0.018],
        [2016, 0.012],
        [2017, 0.020],
        [2018, 0.015],
        [2019, 0.023],
        [2020, 0.019],
        [2021, 0.010],
        [2022, 0.027],
        [2023, 0.065],
        // Decommissionned functionnality
    ],
    MAX_INCOME: {
        1966: 5000,
        1967: 5000,
        1968: 5100,
        1969: 5200,
        1970: 5300,
        1971: 5400,
        1972: 5500,
        1973: 5900,
        1974: 6600,
        1975: 7400,
        1976: 8300,
        1977: 9300,
        1978: 10400,
        1979: 11700,
        1980: 13100,
        1981: 14700,
        1982: 16500,
        1983: 18500,
        1984: 20800,
        1985: 23400,
        1986: 25800,
        1987: 25900,
        1988: 26500,
        1989: 27700,
        1990: 28900,
        1991: 30500,
        1992: 32200,
        1993: 33400,
        1994: 34400,
        1995: 34900,
        1996: 35400,
        1997: 35800,
        1998: 36900,
        1999: 37400,
        2000: 37600,
        2001: 38300,
        2002: 39100,
        2003: 39900,
        2004: 40500,
        2005: 41100,
        2006: 42100,
        2007: 43700,
        2008: 44900,
        2009: 46300,
        2010: 47200,
        2011: 48300,
        2012: 50100,
        2013: 51100,
        2014: 52500,
        2015: 53600,
        2016: 54900,
        2017: 55300,
        2018: 55900,
        2019: 57400,
        2020: 58700,
        2021: 61600,
        2022: 64900,
        2023: 66600,
        2024: 68500,
        2025: 71300,
        2026: 74600,
    },
    MAX_PENSION: {
        // Max amount at age 65
        RETIREMENT: 18091.80,
        // Value must be the same as Max Retirement for the QPP
        COMBINED_RETIREMENT_SURVIVOR: 18091.80,
        DEATH_BENEFIT: 2500,
    },
    MAX_REQUEST_AGE: 72,
    MIN_REQUEST_AGE: 60,
    MONTHLY_DELAY: {
        BONUS: 0.0070,
        PENALTY: 0.0060,
    },
    REPLACEMENT_FACTOR: 0.25,
    SURVIVOR_RATES: {
        OVER_64: 0.6,
        UNDER_65: 0.375,
    },
    YEARS_TO_FULL_PENSION: 40,
    getRequestDateFactor(birthDate: Date, requestDate: Date, customReferenceDate?: Date): number {
        const { BONUS, PENALTY } = this.MONTHLY_DELAY;

        const minRequestDate = addYearsToDate(birthDate, this.MIN_REQUEST_AGE);
        const maxRequestDate = addYearsToDate(birthDate, this.MAX_REQUEST_AGE);
        const referenceDate = customReferenceDate || addYearsToDate(birthDate, this.DEFAULT_REFERENCE_AGE);

        const monthsToToday = getMonthsDiff(birthDate, now());
        const monthsToMinRequestDate = getMonthsDiff(birthDate, minRequestDate);
        const monthsToMaxRequestDate = getMonthsDiff(birthDate, maxRequestDate);
        const monthsToReferenceDate = getMonthsDiff(birthDate, referenceDate);
        const monthsToRequestDate = getMonthsDiff(birthDate, requestDate);
        const monthsToLastBirthDay = monthsToToday - (monthsToToday % 12);

        // Request date is before minimum request date
        if (monthsToRequestDate < monthsToMinRequestDate) {
            return 0;
        }
        // Analysis date is after the maximum request date
        if (monthsToMaxRequestDate < monthsToToday) {
            return 1;
        }
        // Analysis date is after reference date and request date is before last birthday
        if (monthsToToday > monthsToReferenceDate && monthsToRequestDate < monthsToLastBirthDay) {
            return 1;
        }

        let monthsDelta = clamp(monthsToRequestDate, monthsToMinRequestDate, monthsToMaxRequestDate);
        monthsDelta -= Math.max(monthsToLastBirthDay, monthsToReferenceDate);

        return 1 + (monthsDelta * (monthsDelta >= 0 ? BONUS : PENALTY));
    },
    getAverageIndexationRate(): number {
        const sum = this.INDEXATION_RATE_REFERENCES.reduce((previous, current) => previous + current[1], 0);
        return roundToPrecision(sum / this.INDEXATION_RATE_REFERENCES.length, 2);
    },
};
