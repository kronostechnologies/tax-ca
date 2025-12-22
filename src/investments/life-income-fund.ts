// tslint:disable:max-line-length
/*
Sources
    Provincial: https://www.empire.ca/sites/default/files/2025-01/INV-996A-LIFMinMaxWithdrawalPercentages-EN-web.pdf
    Federal & Territories & PEI: https://www.osfi-bsif.gc.ca/en/supervision/pensions/administering-pension-plans/guidance-topic/life-income-funds-restricted-life-income-funds-variable-benefits-accounts

Conversion
    PROVINCIAL
    Because the age of reference is at the end of the previous year, we must shift the reference rate
    by one year to reflect the calculation engine which uses the age at the end of the current year.
    i.e. : Gov has a rate for age 60 but we use it for age 61.

    FED & TERRITORIES & PEI
    No conversion.

Revised
    2025-12-21
*/
// tslint:enable:max-line-length

import { ByProvince, FederalCode, ProvinceCode } from '../misc';
import { clamp } from '../utils';

interface MaxWithdrawalPctByAge {
    [key: number]: number;
}

/* Alberta (AB), British Columbia (BC), Ontario (ON), New Brunswick (NB),
 Newfoundland and Labrador (NL), Saskatchewan (SK)
*/
export const province1MaxWithdrawalPct: MaxWithdrawalPctByAge = {
    51: 0.0627,
    52: 0.0631,
    53: 0.0635,
    54: 0.0640,
    55: 0.0645,
    56: 0.0651,
    57: 0.0657,
    58: 0.0663,
    59: 0.0670,
    60: 0.0677,
    61: 0.0685,
    62: 0.0694,
    63: 0.0704,
    64: 0.0714,
    65: 0.0726,
    66: 0.0738,
    67: 0.0752,
    68: 0.0767,
    69: 0.0783,
    70: 0.0802,
    71: 0.0822,
    72: 0.0845,
    73: 0.0871,
    74: 0.0900,
    75: 0.0934,
    76: 0.0971,
    77: 0.1015,
    78: 0.1066,
    79: 0.1125,
    80: 0.1196,
    81: 0.1282,
    82: 0.1387,
    83: 0.1519,
    84: 0.1690,
    85: 0.1919,
    86: 0.2240,
    87: 0.2723,
    88: 0.3529,
    89: 0.5146,
    90: 1,
};

// Manitoba (MB), Nova Scotia (NS)
export const province2MaxWithdrawalPct: MaxWithdrawalPctByAge = {
    51: 0.0610,
    52: 0.0610,
    53: 0.0610,
    54: 0.0610,
    55: 0.0610,
    56: 0.0640,
    57: 0.0650,
    58: 0.0650,
    59: 0.0660,
    60: 0.0670,
    61: 0.0670,
    62: 0.0680,
    63: 0.0690,
    64: 0.0700,
    65: 0.0710,
    66: 0.0720,
    67: 0.0730,
    68: 0.0740,
    69: 0.0760,
    70: 0.0770,
    71: 0.0790,
    72: 0.0810,
    73: 0.0830,
    74: 0.0850,
    75: 0.0880,
    76: 0.0910,
    77: 0.0940,
    78: 0.0980,
    79: 0.1030,
    80: 0.1080,
    81: 0.1150,
    82: 0.1210,
    83: 0.1290,
    84: 0.1380,
    85: 0.1480,
    86: 0.1600,
    87: 0.1730,
    88: 0.1890,
    89: 0.2000,
};

// Others: Northwest Territories (NT), Nunavut (NU), Prince Edward Island (PE), Yukon (YT)
export const othersMaxWithdrawalPct: MaxWithdrawalPctByAge = {
    20: 0.045331,
    21: 0.045384,
    22: 0.04544,
    23: 0.0455,
    24: 0.045564,
    25: 0.045631,
    26: 0.045703,
    27: 0.045779,
    28: 0.04586,
    29: 0.045947,
    30: 0.046038,
    31: 0.046136,
    32: 0.04624,
    33: 0.046351,
    34: 0.046469,
    35: 0.046595,
    36: 0.046729,
    37: 0.046872,
    38: 0.047025,
    39: 0.047188,
    40: 0.047361,
    41: 0.047547,
    42: 0.047745,
    43: 0.047957,
    44: 0.048184,
    45: 0.048427,
    46: 0.048687,
    47: 0.048966,
    48: 0.049265,
    49: 0.049586,
    50: 0.049931,
    51: 0.050302,
    52: 0.050701,
    53: 0.051131,
    54: 0.051595,
    55: 0.052096,
    56: 0.052637,
    57: 0.053224,
    58: 0.053861,
    59: 0.054552,
    60: 0.055304,
    61: 0.056125,
    62: 0.057022,
    63: 0.058005,
    64: 0.059084,
    65: 0.060272,
    66: 0.061586,
    67: 0.063042,
    68: 0.064662,
    69: 0.066474,
    70: 0.068508,
    71: 0.070804,
    72: 0.073413,
    73: 0.076397,
    74: 0.079836,
    75: 0.083837,
    76: 0.088423,
    77: 0.093729,
    78: 0.099935,
    79: 0.107287,
    80: 0.116128,
    81: 0.126955,
    82: 0.140512,
    83: 0.15797,
    84: 0.18128,
    85: 0.213952,
    86: 0.263008,
    87: 0.344831,
    88: 0.508575,
    89: 1,
};

// Federal
export const federalMaxWithdrawalPct: MaxWithdrawalPctByAge = {
    20: 0.045331,
    21: 0.045384,
    22: 0.04544,
    23: 0.0455,
    24: 0.045564,
    25: 0.045631,
    26: 0.045703,
    27: 0.045779,
    28: 0.04586,
    29: 0.045947,
    30: 0.046038,
    31: 0.046136,
    32: 0.04624,
    33: 0.046351,
    34: 0.046469,
    35: 0.046595,
    36: 0.046729,
    37: 0.046872,
    38: 0.047025,
    39: 0.047188,
    40: 0.047361,
    41: 0.047547,
    42: 0.047745,
    43: 0.047957,
    44: 0.048184,
    45: 0.048427,
    46: 0.048687,
    47: 0.048966,
    48: 0.049265,
    49: 0.049586,
    50: 0.049931,
    51: 0.050302,
    52: 0.050701,
    53: 0.051131,
    54: 0.051595,
    55: 0.052096,
    56: 0.052637,
    57: 0.053224,
    58: 0.053861,
    59: 0.054552,
    60: 0.055304,
    61: 0.056125,
    62: 0.057022,
    63: 0.058005,
    64: 0.059084,
    65: 0.060272,
    66: 0.061586,
    67: 0.063042,
    68: 0.064662,
    69: 0.066474,
    70: 0.068508,
    71: 0.070804,
    72: 0.073413,
    73: 0.076397,
    74: 0.079836,
    75: 0.083837,
    76: 0.088423,
    77: 0.093729,
    78: 0.099935,
    79: 0.107287,
    80: 0.116128,
    81: 0.126955,
    82: 0.140512,
    83: 0.15797,
    84: 0.18128,
    85: 0.213952,
    86: 0.263008,
    87: 0.344831,
    88: 0.508575,
    89: 1,
};

export function getMaxWithdrawalPct(jurisdiction: ProvinceCode | FederalCode, age: number): number {
    const getAgeLimitByProvinceGroup = (group: MaxWithdrawalPctByAge, biggest: boolean = true): number => ((biggest)
        ? Math.max(...Object.keys(group).map(Number))
        : Math.min(...Object.keys(group).map(Number)));

    switch (jurisdiction) {
        case 'AB':
        case 'BC':
        case 'ON':
        case 'NB':
        case 'NL':
        case 'SK':
            return province1MaxWithdrawalPct[
                clamp(
                    age,
                    getAgeLimitByProvinceGroup(province1MaxWithdrawalPct, false),
                    getAgeLimitByProvinceGroup(province1MaxWithdrawalPct),
                )
            ];
        case 'QC':
        case 'MB':
        case 'NS':
            return province2MaxWithdrawalPct[
                clamp(
                    age,
                    getAgeLimitByProvinceGroup(province2MaxWithdrawalPct, false),
                    getAgeLimitByProvinceGroup(province2MaxWithdrawalPct),
                )
            ];
        case 'CA':
            return federalMaxWithdrawalPct[
                clamp(
                    age,
                    getAgeLimitByProvinceGroup(federalMaxWithdrawalPct, false),
                    getAgeLimitByProvinceGroup(federalMaxWithdrawalPct),
                )
            ];
        default:
            return othersMaxWithdrawalPct[
                clamp(
                    age,
                    getAgeLimitByProvinceGroup(othersMaxWithdrawalPct, false),
                    getAgeLimitByProvinceGroup(othersMaxWithdrawalPct),
                )
            ];
    }
}

export const YMPEUnlockingSmallBalance: ByProvince<number> = {
    AB: 0.4,
    BC: 0.4,
    MB: 0.4,
    NB: 0.4,
    NL: 0.4,
    NS: 0.5,
    PE: 0.4,
    ON: 0.4,
    QC: 0.4,
    SK: 0.4,
    NT: 0.4,
    NU: 0.4,
    YT: 0.4,
};
