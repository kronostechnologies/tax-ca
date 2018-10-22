/*
Sources:
	https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/employment-insurance-ei/ei-premium-rates-maximums.html
*/

const ei = {
	max_insurable_earnings: 51700,
	rate: {
		CA: 0.0166,
		QC: 0.0130,
	},
};

module.exports = ei;
