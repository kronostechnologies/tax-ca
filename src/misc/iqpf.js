/*
Sources:
	http://fpsc.ca/docs/default-source/FPSC/news-publications/2017-projection-assumption-guidelines.pdf
	http://app.iqpf.org/guidelines
*/

export default {
	inflation: 0.02,
	return_rates: {
		short_term: 0.029,
		fixed_income: 0.039,
		canadian_equities: 0.065,
		conservative_portfolio: 0.032,
		balanced_portfolio: 0.0390,
		dynamic_portfolio: 0.0475,
	},
	borrowing_rate: 0.049,
};
