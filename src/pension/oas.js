/*
Sources:
	https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/recovery-tax.html
	https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/eligibility.html (delay bonus)
*/

export default {
	starting_age: 65,
	max: 589.59,
	limit: 123019, // aka reimbursement_limit in kronos-fna
	repayment_threshold: 75910,
	monthly_delay_bonus: 0.006,
	repayment_ratio: 0.15,
	max_age: 70,
	get_aaf(request_age) {
		return request_age < this.starting_age ? 0 : 1 + ((request_age - this.starting_age) * 0.006 * 12);
	},
};
