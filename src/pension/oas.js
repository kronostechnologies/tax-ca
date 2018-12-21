/*
Sources:
	https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/recovery-tax.html
	https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/eligibility.html (delay bonus)

Revised 2018-12-21
*/

export default {
	getAAF(request_age) {
		return request_age < this.MIN_AGE ? 0 : 1 + ((request_age - this.MIN_AGE) * this.MONTHLY_DELAY_BONUS * 12);
	},
	MAX_AGE: 70,
	MIN_AGE: 65,
	MONTHLY_PAYMENT_MAX: 600.85,
	MONTHLY_DELAY_BONUS: 0.006,
	REPAYMENT: {
		MAX: 123386,
		MIN: 75910,
		RATIO: 0.15,
	},
};
