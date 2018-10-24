/*
Sources:
	http://www.taxtips.ca/marginaltaxrates.htm
*/

export default {
	getFederalCode: () => 'CA',
	getProvincialCodes: () => ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'PE', 'ON', 'QC', 'SK', 'NT', 'NU', 'YT'],
	TAX_BRACKETS: {
		CA: {
			abatment: 0,
			tax_credit_rate: 0.15,
			base_tax_credit: 11809,
			rates: [{
				from: 0,
				to: 46605,
				rate: 0.15,
			}, {
				from: 46605,
				to: 93208,
				rate: 0.205,
			}, {
				from: 93208,
				to: 144489,
				rate: 0.26,
			}, {
				from: 144489,
				to: 205842,
				rate: 0.29,
			}, {
				from: 205842,
				to: 999999999,
				rate: 0.33,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		AB: {
			abatment: 0,
			tax_credit_rate: 0.10,
			base_tax_credit: 18915,
			rates: [{
				from: 0,
				to: 128145,
				rate: 0.10,
			}, {
				from: 128145,
				to: 153773,
				rate: 0.12,
			}, {
				from: 153773,
				to: 205031,
				rate: 0.13,
			}, {
				from: 205031,
				to: 307547,
				rate: 0.14,
			}, {
				from: 307547,
				to: 999999999,
				rate: 0.15,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		BC: {
			abatment: 0,
			tax_credit_rate: 0.0506,
			base_tax_credit: 10412,
			rates: [{
				from: 0,
				to: 39676,
				rate: 0.0506,
			}, {
				from: 39676,
				to: 79353,
				rate: 0.077,
			}, {
				from: 79353,
				to: 91107,
				rate: 0.0105,
			}, {
				from: 91107,
				to: 110630,
				rate: 0.1229,
			}, {
				from: 110630,
				to: 150000,
				rate: 0.147,
			}, {
				from: 150000,
				to: 999999999,
				rate: 0.168,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		MB: {
			abatment: 0,
			tax_credit_rate: 0.108,
			base_tax_credit: 9382,
			rates: [{
				from: 0,
				to: 31843,
				rate: 0.108,
			}, {
				from: 31843,
				to: 68821,
				rate: 0.1275,
			}, {
				from: 68821,
				to: 999999999,
				rate: 0.174,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		NB: {
			abatment: 0,
			tax_credit_rate: 0.0968,
			base_tax_credit: 10043,
			rates: [{
				from: 0,
				to: 41675,
				rate: 0.0968,
			}, {
				from: 41675,
				to: 83351,
				rate: 0.1482,
			}, {
				from: 83351,
				to: 135510,
				rate: 0.1652,
			}, {
				from: 133510,
				to: 154382,
				rate: 0.1784,
			}, {
				from: 154382,
				to: 999999999,
				rate: 0.2030,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		NL: {
			abatment: 0,
			tax_credit_rate: 0.087,
			base_tax_credit: 9247,
			rates: [{
				from: 0,
				to: 36926,
				rate: 0.087,
			}, {
				from: 36926,
				to: 73852,
				rate: 0.145,
			}, {
				from: 73852,
				to: 131850,
				rate: 0.158,
			}, {
				from: 131850,
				to: 184590,
				rate: 0.173,
			}, {
				from: 184590,
				to: 999999999,
				rate: 0.183,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		NS: {
			abatment: 0,
			tax_credit_rate: 0.0879,
			base_tax_credit: 8481,
			rates: [{
				from: 0,
				to: 29590,
				rate: 0.0879,
			}, {
				from: 29590,
				to: 59180,
				rate: 0.1495,
			}, {
				from: 59180,
				to: 93000,
				rate: 0.1667,
			}, {
				from: 93000,
				to: 150000,
				rate: 0.175,
			}, {
				from: 150000,
				to: 999999999,
				rate: 0.21,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		PE: {
			abatment: 0,
			tax_credit_rate: 0.098,
			base_tax_credit: 8160,
			rates: [{
				from: 0,
				to: 31984,
				rate: 0.098,
			}, {
				from: 31984,
				to: 63969,
				rate: 0.138,
			}, {
				from: 63969,
				to: 999999999,
				rate: 0.167,
			}],
			surtax_rates: [{
				from: 0,
				to: 12500,
				rate: 0,
			}, {
				from: 12500,
				to: 999999999,
				rate: 0.10,
			}],
		},
		ON: {
			abatment: 0,
			tax_credit_rate: 0.0505,
			base_tax_credit: 10354,
			rates: [{
				from: 0,
				to: 42960,
				rate: 0.0505,
			}, {
				from: 42960,
				to: 85923,
				rate: 0.0915,
			}, {
				from: 85923,
				to: 150000,
				rate: 0.1116,
			}, {
				from: 150000,
				to: 220000,
				rate: 0.1216,
			}, {
				from: 220000,
				to: 999999999,
				rate: 0.1316,
			}],
			surtax_rates: [{
				from: 0,
				to: 4638,
				rate: 0,
			}, {
				from: 4638,
				to: 5936,
				rate: 0.20,
			}, {
				from: 5936,
				to: 999999999,
				rate: 0.56, // 0.20 + 0.36
			}],
		},
		QC: {
			abatment: 0.165, // http://www.cra-arc.gc.ca/tx/ndvdls/tpcs/ncm-tx/rtrn/cmpltng/ddctns/lns409-485/440-fra.html
			tax_credit_rate: 0.20,
			base_tax_credit: 15012,
			rates: [{
				from: 0,
				to: 43055,
				rate: 0.15,
			}, {
				from: 43055,
				to: 86105,
				rate: 0.20,
			}, {
				from: 86105,
				to: 104765,
				rate: 0.24,
			}, {
				from: 104765,
				to: 999999999,
				rate: 0.2575,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		SK: {
			abatment: 0,
			tax_credit_rate: 0.11,
			base_tax_credit: 16065,
			rates: [{
				from: 0,
				to: 45225,
				rate: 0.11,
			}, {
				from: 45225,
				to: 129214,
				rate: 0.13,
			}, {
				from: 129214,
				to: 999999999,
				rate: 0.15,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		NT: {
			abatment: 0,
			tax_credit_rate: 0.059,
			base_tax_credit: 14492,
			rates: [{
				from: 0,
				to: 42209,
				rate: 0.059,
			}, {
				from: 42209,
				to: 84420,
				rate: 0.086,
			}, {
				from: 84420,
				to: 137248,
				rate: 0.122,
			}, {
				from: 137248,
				to: 999999999,
				rate: 0.1405,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		NU: {
			abatment: 0,
			tax_credit_rate: 0.04,
			base_tax_credit: 13325,
			rates: [{
				from: 0,
				to: 44437,
				rate: 0.04,
			}, {
				from: 44437,
				to: 88874,
				rate: 0.07,
			}, {
				from: 88874,
				to: 144488,
				rate: 0.09,
			}, {
				from: 144488,
				to: 999999999,
				rate: 0.115,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		YT: {
			abatment: 0,
			tax_credit_rate: 0.064,
			base_tax_credit: 11809,
			rates: [{
				from: 0,
				to: 46605,
				rate: 0.0640,
			}, {
				from: 46605,
				to: 93208,
				rate: 0.09,
			}, {
				from: 93208,
				to: 144489,
				rate: 0.109,
			}, {
				from: 144489,
				to: 500000,
				rate: 0.128,
			}, {
				from: 500000,
				to: 999999999,
				rate: 0.15,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
	}
};
