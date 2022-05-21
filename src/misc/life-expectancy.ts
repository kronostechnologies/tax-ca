/*
 Sources
 http://app.iqpf.org/?locale=en#/guidelines/life-expectancy

 Revised
 2020-12-21
 */

export interface IndividualLifeExpectancy {
    0: number;
    5: number;
    10: number;
    15: number;
    20: number;
    25: number;
    30: number;
    35: number;
    40: number;
    45: number;
    50: number;
    55: number;
    60: number;
    65: number;
    70: number;
    75: number;
    80: number;
    85: number;
    90: number;
    95: number;
    100: number;
}

export interface CombinedLifeExpectancy {
    MALE: IndividualLifeExpectancy;
    FEMALE: IndividualLifeExpectancy;
}

export const LIFE_EXPECTANCY: CombinedLifeExpectancy = {
    MALE: {
        0: 95,
        5: 95,
        10: 95,
        15: 95,
        20: 95,
        25: 95,
        30: 95,
        35: 94,
        40: 94,
        45: 94,
        50: 94,
        55: 94,
        60: 94,
        65: 94,
        70: 94,
        75: 94,
        80: 94,
        85: 95,
        90: 96,
        95: 99,
        100: 102,
    },
    FEMALE: {
        0: 97,
        5: 97,
        10: 97,
        15: 97,
        20: 97,
        25: 97,
        30: 97,
        35: 97,
        40: 97,
        45: 96,
        50: 96,
        55: 96,
        60: 96,
        65: 96,
        70: 96,
        75: 96,
        80: 96,
        85: 97,
        90: 98,
        95: 100,
        100: 103,
    },
};
