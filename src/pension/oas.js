/*
Sources:
	https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/recovery-tax.html
	https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/eligibility.html (delay bonus)
*/

export default {
	get_aaf(request_age) {
		return request_age < this.min_age ? 0 : 1 + ((request_age - this.min_age) * this.monthly_delay_bonus * 12);
	},
	max_age: 70,
	min_age: 65,
	monthly_payment_max: 589.59,
	monthly_delay_bonus: 0.006,
	repayment: {
		max: 123019,
		min: 75910,
		ratio: 0.15,
	},
};
