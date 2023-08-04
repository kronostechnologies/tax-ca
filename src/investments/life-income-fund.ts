// tslint:disable:max-line-length
/*
Sources
    Provincial: https://www.empire.ca/sites/default/files/2020-02/INV-996A-LIFMinMaxWithdrawalPercentages-EN-web_0.pdf
              https://ca.rbcwealthmanagement.com/documents/634020/2289317/2021+-+Registered+Plan+Minimums+and+Maximums.pdf/ded97359-099d-4650-b626-67358d78f3af
    Federal: http://www.osfi-bsif.gc.ca/Eng/pp-rr/faq/Pages/lif-frv.aspx

Conversion
    Because the age of reference is at the end of the previous year, we must shift the reference rate
    by one year to reflect the calculation engine which uses the age at the end of the current year.
    i.e. : Gov has a rate for age 60 but we use it for age 61.

Revised
    2023-01-03
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
    21: 0.043237,
    22: 0.043288,
    23: 0.043343,
    24: 0.043401,
    25: 0.043463,
    26: 0.043528,
    27: 0.043598,
    28: 0.043673,
    29: 0.043752,
    30: 0.043836,
    31: 0.043925,
    32: 0.044021,
    33: 0.044122,
    34: 0.04423,
    35: 0.044345,
    36: 0.044468,
    37: 0.044599,
    38: 0.044738,
    39: 0.044887,
    40: 0.045046,
    41: 0.045216,
    42: 0.045397,
    43: 0.04559,
    44: 0.045798,
    45: 0.046019,
    46: 0.046256,
    47: 0.04651,
    48: 0.046783,
    49: 0.047075,
    50: 0.047389,
    51: 0.047726,
    52: 0.048089,
    53: 0.04848,
    54: 0.048901,
    55: 0.049355,
    56: 0.049846,
    57: 0.050377,
    58: 0.050953,
    59: 0.051577,
    60: 0.052256,
    61: 0.052996,
    62: 0.053803,
    63: 0.054686,
    64: 0.055654,
    65: 0.056718,
    66: 0.057891,
    67: 0.059189,
    68: 0.06063,
    69: 0.062236,
    70: 0.064035,
    71: 0.066057,
    72: 0.068346,
    73: 0.070952,
    74: 0.07394,
    75: 0.077395,
    76: 0.081429,
    77: 0.086048,
    78: 0.09139,
    79: 0.097634,
    80: 0.105025,
    81: 0.11391,
    82: 0.124785,
    83: 0.138397,
    84: 0.155919,
    85: 0.179305,
    86: 0.212075,
    87: 0.261266,
    88: 0.343299,
    89: 0.507438,
    90: 1,
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
