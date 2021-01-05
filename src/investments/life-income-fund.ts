/*
Sources:
  Federal: http://www.osfi-bsif.gc.ca/Eng/pp-rr/faq/Pages/lif-frv.aspx
  Provincial: https://www.empire.ca/sites/default/files/2020-02/INV-996A-LIFMinMaxWithdrawalPercentages-EN-web_0.pdf

Revised 2020-12-21
*/

import { FederalCode, ProvinceCode } from '../misc/code-types';
import { clamp } from '../utils/math';

interface MaxWithdrawalPctByAge {
    [key: number]: number;
}

/* Alberta (AB), British Columbia (BC), Ontario (ON), New Brunswick (NB),
 Newfoundland and Labrador (NL), Saskatchewan (SK)
 */
export const province1MaxWithdrawalPct: MaxWithdrawalPctByAge = {
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

// Federal
export const federalMaxWithdrawalPct: MaxWithdrawalPctByAge = {
    54: 0.040251,
    55: 0.040662,
    56: 0.041107,
    57: 0.041589,
    58: 0.042113,
    59: 0.042683,
    60: 0.043304,
    61: 0.043983,
    62: 0.044726,
    63: 0.045541,
    64: 0.046438,
    65: 0.047429,
    66: 0.048526,
    67: 0.049746,
    68: 0.051107,
    69: 0.052635,
    70: 0.054357,
    71: 0.056309,
    72: 0.058538,
    73: 0.061102,
    74: 0.064077,
    75: 0.067563,
    76: 0.071699,
    77: 0.076427,
    78: 0.081883,
    79: 0.088251,
    80: 0.095777,
    81: 0.104811,
    82: 0.115855,
    83: 0.129661,
    84: 0.147416,
    85: 0.171091,
    86: 0.20424,
    87: 0.253968,
    88: 0.336854,
    89: 0.502636,
    90: 1,
};

// Others: Northwest Territories (NT), Nunavut (NU), Prince Edward Island (PE), Yukon (YT)
export const othersMaxWithdrawalPct: MaxWithdrawalPctByAge = {
    54: 0.0270,
    55: 0.0278,
    56: 0.0286,
    57: 0.0294,
    58: 0.0303,
    59: 0.0313,
    60: 0.0323,
    61: 0.0333,
    62: 0.0345,
    63: 0.0357,
    64: 0.0370,
    65: 0.0385,
    66: 0.0400,
    67: 0.0417,
    68: 0.0435,
    69: 0.0455,
    70: 0.0476,
    71: 0.0500,
    72: 0.0528,
    73: 0.0540,
    74: 0.0553,
    75: 0.0567,
    76: 0.0582,
    77: 0.0598,
    78: 0.0617,
    79: 0.0636,
    80: 0.0658,
    81: 0.0682,
    82: 0.0708,
    83: 0.0738,
    84: 0.0771,
    85: 0.0808,
    86: 0.0851,
    87: 0.0899,
    88: 0.0955,
    89: 0.1021,
    90: 0.1099,
    91: 0.1192,
    92: 0.1306,
    93: 0.1449,
    94: 0.1634,
    95: 0.1879,
    96: 0.2000,
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
