/*
Sources
    https://www.canada.ca/en/employment-social-development/programs/ei/ei-list/ei-employers/premium-reduction-program/2026-maximum-insurable-earnings.html

Notes
    The URL is based on a specific year.

Revised
    2025-12-22
 */
package com.equisoft.taxca.taxes

data class PremiumRate(
    val ca: Double,
    val qc: Double,
)

data class EmploymentInsurance(
    val maxInsurableEarnings: Double,
    val premiumRates: PremiumRate,
)

val Ei: EmploymentInsurance = EmploymentInsurance(
    maxInsurableEarnings = 68900.0,
    premiumRates = PremiumRate(
        ca = 0.0163,
        qc = 0.013,
    ),
)
