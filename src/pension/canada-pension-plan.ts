/*
Sources:
    http://www.cra-arc.gc.ca/tx/bsnss/tpcs/pyrll/clcltng/cpp-rpc/cnt-chrt-pf-eng.html
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/payment-amounts.html
    ---
    http://www.esdc.gc.ca/en/cpp/survivor_pension.page
    http://www.esdc.gc.ca/en/cpp/death_benefit.page
    http://www.esdc.gc.ca/en/reports/pension/cpp_technical_amendments.page
    http://www.esdc.gc.ca/en/cpp/consumer_price_index.page
    http://www.statcan.gc.ca/tables-tableaux/sum-som/l01/cst01/econ46a-eng.htm

Revised 2019-12-23
*/

import { addYearsToDate, getMonthsDiff, now } from '../utils/date';
import { clamp, roundToPrecision } from '../utils/math';
import { PublicPensionPlan } from './public-pension-plan';

export const CPP: PublicPensionPlan = {
    CONTRIBUTIONS: {
        PENSIONABLE_EARNINGS: {
            MAX: 58700,
            MIN: 3500,
            AVG_MAX: 56440,
            SUP_MAX: 64300,
            SUP_FACTORS: [
                { FROM: 2019, TO: 2023, FACTOR: 1 },
                { FROM: 2024, TO: 2024, FACTOR: 1.07 },
                { FROM: 2025, TO: Number.MAX_SAFE_INTEGER, FACTOR: 1.14 },
            ],
        },
        RATES: {
            BASE: 0.054,
            ENHANCEMENT_STEP_1: [
                { FROM: 2019, TO: 2019, RATE: 0.0015 },
                { FROM: 2020, TO: 2020, RATE: 0.003 },
                { FROM: 2021, TO: 2021, RATE: 0.005 },
                { FROM: 2022, TO: 2022, RATE: 0.0075 },
                { FROM: 2023, TO: Number.MAX_SAFE_INTEGER, RATE: 0.01 },
            ],
            ENHANCEMENT_STEP_2: 0.04,
        },
    },
    DEATH_BENEFIT: { RATE: 0.5 },
    DEFAULT_REFERENCE_AGE: 65,
    FLAT_BENEFIT: {
        ORPHAN: 3060.36,
        DISABILITY: 16651.92,
        UNDER_45: 7519.56,
        UNDER_45_WITH_CHILD: 7659.36,
        UNDER_45_DISABLED: 7659.36,
        FROM_45_TO_64: 7659.36,
        OVER_64_WITHOUT_PENSION: 8466,
    },
    getRequestDateFactor(birthDate: Date, requestDate: Date): number {
        const { BONUS, PENALTY } = this.MONTHLY_DELAY;

        const minRequestDate = addYearsToDate(birthDate, this.MIN_REQUEST_AGE);
        const maxRequestDate = addYearsToDate(birthDate, this.MAX_REQUEST_AGE);
        const referenceDate = addYearsToDate(birthDate, this.DEFAULT_REFERENCE_AGE);

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

        return 1 + monthsDelta * (monthsDelta >= 0 ? BONUS : PENALTY);
    },
    getAverageIndexationRate(): number {
        const sum = this.INDEXATION_RATE_REFERENCES.reduce((previous, current) => previous + current[1], 0);
        return roundToPrecision(sum / this.INDEXATION_RATE_REFERENCES.length, 3);
    },
    INDEXATION_RATE_REFERENCES: [ // Previous year inflation used as indexation
        [2007, 0.020],
        [2008, 0.022],
        [2009, 0.023],
        [2010, 0.003],
        [2011, 0.018],
        [2012, 0.029],
        [2013, 0.015],
        [2014, 0.009],
        [2015, 0.020],
        [2016, 0.011],
        [2017, 0.014],
        [2018, 0.016],
        [2019, 0.023],
    ],
    MAX_PENSION: {
        RETIREMENT: 14109.96,
        COMBINED_RETIREMENT_SURVIVOR: 14109.96,
        DEATH_BENEFIT: 2500,
    },
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
    },
    MAX_REQUEST_AGE: 70,
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
};
