/*
Source :
	http://www.osfi-bsif.gc.ca/Eng/pp-rr/faq/Pages/lif-frv.aspx
    https://www.empire.ca/sites/default/files/2020-02/INV-996A-LIFMinMaxWithdrawalPercentages-FR-web_0.pdf

Revised 2020-04-30
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
    54: 0.0424,
    55: 0.0428,
    56: 0.0432,
    57: 0.0437,
    58: 0.0443,
    59: 0.0448,
    60: 0.0455,
    61: 0.0462,
    62: 0.0469,
    63: 0.0478,
    64: 0.0487,
    65: 0.0497,
    66: 0.0508,
    67: 0.0521,
    68: 0.0535,
    69: 0.0550,
    70: 0.0567,
    71: 0.0587,
    72: 0.0610,
    73: 0.0635,
    74: 0.0665,
    75: 0.0700,
    76: 0.0741,
    77: 0.0788,
    78: 0.0843,
    79: 0.0906,
    80: 0.0981,
    81: 0.1071,
    82: 0.1181,
    83: 0.1319,
    84: 0.1496,
    85: 0.1732,
    86: 0.2062,
    87: 0.2558,
    88: 0.3385,
    89: 0.5038,
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
