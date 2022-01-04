// tslint:disable:max-line-length
/*
Sources
  Provincial: https://www.empire.ca/sites/default/files/2020-02/INV-996A-LIFMinMaxWithdrawalPercentages-EN-web_0.pdf
              https://ca.rbcwealthmanagement.com/documents/634020/2289317/2021+-+Registered+Plan+Minimums+and+Maximums.pdf/ded97359-099d-4650-b626-67358d78f3af
  Federal: http://www.osfi-bsif.gc.ca/Eng/pp-rr/faq/Pages/lif-frv.aspx

Revised
  2021-12-21
*/
// tslint:enable:max-line-length

import { FederalCode, ProvinceCode } from '../misc';
import { clamp } from '../utils';

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

// Federal
export const federalMaxWithdrawalPct: MaxWithdrawalPctByAge = {
    54: 0.044832,
    55: 0.045301,
    56: 0.045808,
    57: 0.046359,
    58: 0.046957,
    59: 0.047608,
    60: 0.048318,
    61: 0.049094,
    62: 0.049944,
    63: 0.050878,
    64: 0.051907,
    65: 0.053045,
    66: 0.054306,
    67: 0.05571,
    68: 0.05728,
    69: 0.059044,
    70: 0.061036,
    71: 0.0633,
    72: 0.06589,
    73: 0.068878,
    74: 0.072356,
    75: 0.076448,
    76: 0.08113,
    77: 0.086536,
    78: 0.092849,
    79: 0.100316,
    80: 0.109283,
    81: 0.12025,
    82: 0.133967,
    83: 0.151612,
    84: 0.175151,
    85: 0.208118,
    86: 0.257586,
    87: 0.340054,
    88: 0.505024,
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
            return federalMaxWithdrawalPct[clamp(age, 54, 89)];
        default:
            return othersMaxWithdrawalPct[clamp(age, 54, 96)];
    }
}
