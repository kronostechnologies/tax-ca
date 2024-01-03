// tslint:disable:max-line-length
/*
Sources
    Provincial: https://www.empire.ca/sites/default/files/2023-02/INV-996A-LIFMinMaxWithdrawalPercentages-EN-web.pdf
                https://ca.rbcwealthmanagement.com/documents/1647873/2467026/2023+-+Registered+Plan+Minimums+%26+Maximums.pdf/f26cb471-e962-47cd-9033-fc1d9c34663e
    Federal: http://www.osfi-bsif.gc.ca/Eng/pp-rr/faq/Pages/lif-frv.aspx

Conversion for Federal, Territories and PEI
    Because the age of reference is at the end of the previous year, we must shift the reference rate
    by one year to reflect the calculation engine which uses the age at the end of the current year.
    i.e. : Gov has a rate for age 60 but we use it for age 61.

Revised
    2023-12-27
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
    20: 0.04488,
    21: 0.044933,
    22: 0.044989,
    23: 0.045048,
    24: 0.045111,
    25: 0.045178,
    26: 0.04525,
    27: 0.045326,
    28: 0.045406,
    29: 0.045492,
    30: 0.045584,
    31: 0.045681,
    32: 0.045784,
    33: 0.045895,
    34: 0.046012,
    35: 0.046137,
    36: 0.046271,
    37: 0.046413,
    38: 0.046565,
    39: 0.046727,
    40: 0.0469,
    41: 0.047084,
    42: 0.047282,
    43: 0.047493,
    44: 0.047718,
    45: 0.04796,
    46: 0.048219,
    47: 0.048496,
    48: 0.048794,
    49: 0.049114,
    50: 0.049457,
    51: 0.049826,
    52: 0.050223,
    53: 0.050651,
    54: 0.051113,
    55: 0.051612,
    56: 0.052152,
    57: 0.052736,
    58: 0.05337,
    59: 0.054059,
    60: 0.054809,
    61: 0.055626,
    62: 0.05652,
    63: 0.0575,
    64: 0.058576,
    65: 0.059762,
    66: 0.061072,
    67: 0.062525,
    68: 0.064142,
    69: 0.065951,
    70: 0.067983,
    71: 0.070278,
    72: 0.072886,
    73: 0.075871,
    74: 0.079315,
    75: 0.083323,
    76: 0.087916,
    77: 0.09323,
    78: 0.099444,
    79: 0.106804,
    80: 0.115655,
    81: 0.126492,
    82: 0.140061,
    83: 0.157533,
    84: 0.18086,
    85: 0.213552,
    86: 0.262637,
    87: 0.344506,
    88: 0.508334,
    89: 1,
};

// Federal
export const federalMaxWithdrawalPct: MaxWithdrawalPctByAge = {
    20: 0.04488,
    21: 0.044933,
    22: 0.044989,
    23: 0.045048,
    24: 0.045111,
    25: 0.045178,
    26: 0.04525,
    27: 0.045326,
    28: 0.045406,
    29: 0.045492,
    30: 0.045584,
    31: 0.045681,
    32: 0.045784,
    33: 0.045895,
    34: 0.046012,
    35: 0.046137,
    36: 0.046271,
    37: 0.046413,
    38: 0.046565,
    39: 0.046727,
    40: 0.0469,
    41: 0.047084,
    42: 0.047282,
    43: 0.047493,
    44: 0.047718,
    45: 0.04796,
    46: 0.048219,
    47: 0.048496,
    48: 0.048794,
    49: 0.049114,
    50: 0.049457,
    51: 0.049826,
    52: 0.050223,
    53: 0.050651,
    54: 0.051113,
    55: 0.051612,
    56: 0.052152,
    57: 0.052736,
    58: 0.05337,
    59: 0.054059,
    60: 0.054809,
    61: 0.055626,
    62: 0.05652,
    63: 0.0575,
    64: 0.058576,
    65: 0.059762,
    66: 0.061072,
    67: 0.062525,
    68: 0.064142,
    69: 0.065951,
    70: 0.067983,
    71: 0.070278,
    72: 0.072886,
    73: 0.075871,
    74: 0.079315,
    75: 0.083323,
    76: 0.087916,
    77: 0.09323,
    78: 0.099444,
    79: 0.106804,
    80: 0.115655,
    81: 0.126492,
    82: 0.140061,
    83: 0.157533,
    84: 0.18086,
    85: 0.213552,
    86: 0.262637,
    87: 0.344506,
    88: 0.508334,
    89: 1,
};

export function getMaxWithdrawalPct(jurisdiction: ProvinceCode | FederalCode, age: number): number {
    switch (jurisdiction) {
        case 'AB':
        case 'BC':
        case 'ON':
        case 'NB':
        case 'NL':
        case 'SK':
            return province1MaxWithdrawalPct[clamp(age, 54, 90)];
        case 'QC':
        case 'MB':
        case 'NS':
            return province2MaxWithdrawalPct[clamp(age, 54, 89)];
        case 'CA':
            return federalMaxWithdrawalPct[clamp(age, 54, 90)];
        default:
            return othersMaxWithdrawalPct[clamp(age, 54, 96)];
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
