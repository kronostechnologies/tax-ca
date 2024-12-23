// tslint:disable:max-line-length
/*
Sources
    Provincial: https://www.empire.ca/sites/default/files/2024-02/INV-996A-LIFMinMaxWithdrawalPercentages-EN-web.pdf
                https://ca.rbcwealthmanagement.com/documents/1647873/2467026/2023+-+Registered+Plan+Minimums+%26+Maximums.pdf/f26cb471-e962-47cd-9033-fc1d9c34663e
    Federal & Territories & PEI : http://www.osfi-bsif.gc.ca/Eng/pp-rr/faq/Pages/lif-frv.aspx

Conversion for Federal, Territories and PEI
    Because the age of reference is at the end of the previous year, we must shift the reference rate
    by one year to reflect the calculation engine which uses the age at the end of the current year.
    i.e. : Gov has a rate for age 60 but we use it for age 61.

Revised
    2024-12-23
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

// Quebec (QC), Manitoba (MB), Nova Scotia (NS)
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
    20: 0.044298,
    21: 0.04435,
    22: 0.044406,
    23: 0.044465,
    24: 0.044528,
    25: 0.044594,
    26: 0.044665,
    27: 0.04474,
    28: 0.044821,
    29: 0.044906,
    30: 0.044996,
    31: 0.045093,
    32: 0.045196,
    33: 0.045305,
    34: 0.045422,
    35: 0.045546,
    36: 0.045679,
    37: 0.04582,
    38: 0.045971,
    39: 0.046132,
    40: 0.046304,
    41: 0.046487,
    42: 0.046683,
    43: 0.046893,
    44: 0.047117,
    45: 0.047357,
    46: 0.047614,
    47: 0.04789,
    48: 0.048186,
    49: 0.048503,
    50: 0.048844,
    51: 0.049211,
    52: 0.049606,
    53: 0.050032,
    54: 0.050491,
    55: 0.050987,
    56: 0.051524,
    57: 0.052105,
    58: 0.052736,
    59: 0.053421,
    60: 0.054168,
    61: 0.054982,
    62: 0.055872,
    63: 0.056848,
    64: 0.05792,
    65: 0.059101,
    66: 0.060407,
    67: 0.061856,
    68: 0.063469,
    69: 0.065275,
    70: 0.067303,
    71: 0.069597,
    72: 0.072204,
    73: 0.07519,
    74: 0.078638,
    75: 0.082655,
    76: 0.087258,
    77: 0.092582,
    78: 0.098807,
    79: 0.106178,
    80: 0.115041,
    81: 0.125892,
    82: 0.139476,
    83: 0.156966,
    84: 0.180313,
    85: 0.213033,
    86: 0.262155,
    87: 0.344082,
    88: 0.508019,
    89: 1,
};

// Federal
export const federalMaxWithdrawalPct: MaxWithdrawalPctByAge = {
    20: 0.044298,
    21: 0.04435,
    22: 0.044406,
    23: 0.044465,
    24: 0.044528,
    25: 0.044594,
    26: 0.044665,
    27: 0.04474,
    28: 0.044821,
    29: 0.044906,
    30: 0.044996,
    31: 0.045093,
    32: 0.045196,
    33: 0.045305,
    34: 0.045422,
    35: 0.045546,
    36: 0.045679,
    37: 0.04582,
    38: 0.045971,
    39: 0.046132,
    40: 0.046304,
    41: 0.046487,
    42: 0.046683,
    43: 0.046893,
    44: 0.047117,
    45: 0.047357,
    46: 0.047614,
    47: 0.04789,
    48: 0.048186,
    49: 0.048503,
    50: 0.048844,
    51: 0.049211,
    52: 0.049606,
    53: 0.050032,
    54: 0.050491,
    55: 0.050987,
    56: 0.051524,
    57: 0.052105,
    58: 0.052736,
    59: 0.053421,
    60: 0.054168,
    61: 0.054982,
    62: 0.055872,
    63: 0.056848,
    64: 0.05792,
    65: 0.059101,
    66: 0.060407,
    67: 0.061856,
    68: 0.063469,
    69: 0.065275,
    70: 0.067303,
    71: 0.069597,
    72: 0.072204,
    73: 0.07519,
    74: 0.078638,
    75: 0.082655,
    76: 0.087258,
    77: 0.092582,
    78: 0.098807,
    79: 0.106178,
    80: 0.115041,
    81: 0.125892,
    82: 0.139476,
    83: 0.156966,
    84: 0.180313,
    85: 0.213033,
    86: 0.262155,
    87: 0.344082,
    88: 0.508019,
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
