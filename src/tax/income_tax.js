/*
Sources:
	http://www.taxtips.ca/marginaltaxrates.htm
*/

export default {
	getFederalCode: () => 'CA',
	getProvincialCodes: () => ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'PE', 'ON', 'QC', 'SK', 'NT', 'NU', 'YT'],
	tax_brackets: {
		CA: {
			abatment: 0,
			tax_credit_rate: 15,
			base_tax_credit: 11809,
			rates: [{
				from: 0,
				to: 46605,
				rate: 15,
			}, {
				from: 46605,
				to: 93208,
				rate: 20.5,
			}, {
				from: 93208,
				to: 144489,
				rate: 26,
			}, {
				from: 144489,
				to: 205842,
				rate: 29,
			}, {
				from: 205842,
				to: 999999999,
				rate: 33,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		AB: {
			abatment: 0,
			tax_credit_rate: 10,
			base_tax_credit: 18915,
			rates: [{
				from: 0,
				to: 128145,
				rate: 10,
			}, {
				from: 128145,
				to: 153773,
				rate: 12,
			}, {
				from: 153773,
				to: 205031,
				rate: 13,
			}, {
				from: 205031,
				to: 307547,
				rate: 14,
			}, {
				from: 307547,
				to: 999999999,
				rate: 15,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		BC: {
			abatment: 0,
			tax_credit_rate: 5.06,
			base_tax_credit: 10412,
			rates: [{
				from: 0,
				to: 39676,
				rate: 5.06,
			}, {
				from: 39676,
				to: 79353,
				rate: 7.7,
			}, {
				from: 79353,
				to: 91107,
				rate: 10.5,
			}, {
				from: 91107,
				to: 110630,
				rate: 12.29,
			}, {
				from: 110630,
				to: 150000,
				rate: 14.7,
			}, {
				from: 150000,
				to: 999999999,
				rate: 16.8,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		MB: {
			abatment: 0,
			tax_credit_rate: 10.8,
			base_tax_credit: 9382,
			rates: [{
				from: 0,
				to: 31843,
				rate: 10.8,
			}, {
				from: 31843,
				to: 68821,
				rate: 12.75,
			}, {
				from: 68821,
				to: 999999999,
				rate: 17.4,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		NB: {
			abatment: 0,
			tax_credit_rate: 9.68,
			base_tax_credit: 10043,
			rates: [{
				from: 0,
				to: 41675,
				rate: 9.68,
			}, {
				from: 41675,
				to: 83351,
				rate: 14.82,
			}, {
				from: 83351,
				to: 135510,
				rate: 16.52,
			}, {
				from: 133510,
				to: 154382,
				rate: 17.84,
			}, {
				from: 154382,
				to: 999999999,
				rate: 20.30,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		NL: {
			abatment: 0,
			tax_credit_rate: 8.7,
			base_tax_credit: 9247,
			rates: [{
				from: 0,
				to: 36926,
				rate: 8.7,
			}, {
				from: 36926,
				to: 73852,
				rate: 14.5,
			}, {
				from: 73852,
				to: 131850,
				rate: 15.8,
			}, {
				from: 131850,
				to: 184590,
				rate: 17.3,
			}, {
				from: 184590,
				to: 999999999,
				rate: 18.3,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		NS: {
			abatment: 0,
			tax_credit_rate: 8.79,
			base_tax_credit: 8481,
			rates: [{
				from: 0,
				to: 29590,
				rate: 8.79,
			}, {
				from: 29590,
				to: 59180,
				rate: 14.95,
			}, {
				from: 59180,
				to: 93000,
				rate: 16.67,
			}, {
				from: 93000,
				to: 150000,
				rate: 17.5,
			}, {
				from: 150000,
				to: 999999999,
				rate: 21,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		PE: {
			abatment: 0,
			tax_credit_rate: 9.8,
			base_tax_credit: 8160,
			rates: [{
				from: 0,
				to: 31984,
				rate: 9.8,
			}, {
				from: 31984,
				to: 63969,
				rate: 13.8,
			}, {
				from: 63969,
				to: 999999999,
				rate: 16.7,
			}],
			surtax_rates: [{
				from: 0,
				to: 12500,
				rate: 0,
			}, {
				from: 12500,
				to: 999999999,
				rate: 10,
			}],
		},
		ON: {
			abatment: 0,
			tax_credit_rate: 5.05,
			base_tax_credit: 10354,
			rates: [{
				from: 0,
				to: 42960,
				rate: 5.05,
			}, {
				from: 42960,
				to: 85923,
				rate: 9.15,
			}, {
				from: 85923,
				to: 150000,
				rate: 11.16,
			}, {
				from: 150000,
				to: 220000,
				rate: 12.16,
			}, {
				from: 220000,
				to: 999999999,
				rate: 13.16,
			}],
			surtax_rates: [{
				from: 0,
				to: 4638,
				rate: 0,
			}, {
				from: 4638,
				to: 5936,
				rate: 20,
			}, {
				from: 5936,
				to: 999999999,
				rate: 56, // 20 + 36
			}],
		},
		QC: {
			abatment: 16.5, // http://www.cra-arc.gc.ca/tx/ndvdls/tpcs/ncm-tx/rtrn/cmpltng/ddctns/lns409-485/440-fra.html
			tax_credit_rate: 20,
			base_tax_credit: 15012,
			rates: [{
				from: 0,
				to: 43055,
				rate: 15,
			}, {
				from: 43055,
				to: 86105,
				rate: 20,
			}, {
				from: 86105,
				to: 104765,
				rate: 24,
			}, {
				from: 104765,
				to: 999999999,
				rate: 25.75,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		SK: {
			abatment: 0,
			tax_credit_rate: 11,
			base_tax_credit: 16065,
			rates: [{
				from: 0,
				to: 45225,
				rate: 11,
			}, {
				from: 45225,
				to: 129214,
				rate: 13,
			}, {
				from: 129214,
				to: 999999999,
				rate: 15,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		NT: {
			abatment: 0,
			tax_credit_rate: 5.9,
			base_tax_credit: 14492,
			rates: [{
				from: 0,
				to: 42209,
				rate: 5.9,
			}, {
				from: 42209,
				to: 84420,
				rate: 8.6,
			}, {
				from: 84420,
				to: 137248,
				rate: 12.2,
			}, {
				from: 137248,
				to: 999999999,
				rate: 14.05,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		NU: {
			abatment: 0,
			tax_credit_rate: 4,
			base_tax_credit: 13325,
			rates: [{
				from: 0,
				to: 44437,
				rate: 4,
			}, {
				from: 44437,
				to: 88874,
				rate: 7,
			}, {
				from: 88874,
				to: 144488,
				rate: 9,
			}, {
				from: 144488,
				to: 999999999,
				rate: 11.5,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
		YT: {
			abatment: 0,
			tax_credit_rate: 6.4,
			base_tax_credit: 11809,
			rates: [{
				from: 0,
				to: 46605,
				rate: 6.40,
			}, {
				from: 46605,
				to: 93208,
				rate: 9.00,
			}, {
				from: 93208,
				to: 144489,
				rate: 10.90,
			}, {
				from: 144489,
				to: 500000,
				rate: 12.80,
			}, {
				from: 500000,
				to: 999999999,
				rate: 15,
			}],
			surtax_rates: [{
				from: 0,
				to: 999999999,
				rate: 0,
			}],
		},
	}
};
