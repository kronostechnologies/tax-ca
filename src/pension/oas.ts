/*
Sources:
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/recovery-tax.html
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/eligibility.html (delay bonus)

Revised 2019-12-23
*/

export = {
    getAAF(requestAge: number): number {
        return requestAge < this.MIN_AGE ? 0 : 1 + ((requestAge - this.MIN_AGE) * this.MONTHLY_DELAY_BONUS * 12);
    },
    MAX_AGE: 70,
    MIN_AGE: 65,
    MONTHLY_PAYMENT_MAX: 613.53,
    MONTHLY_DELAY_BONUS: 0.006,
    REPAYMENT: {
        MAX: 126058,
        MIN: 77580,
        RATIO: 0.15,
    },
};
