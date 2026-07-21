/*
Sources
    https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html
    https://www.taxtips.ca/tfsa/tfsa-contribution-rules-and-limits.htm

Revised
    2025-12-22
 */

package com.equisoft.taxca.investments

data class TaxFreeSavingsAccount(
    val maxContribution: Double,
    /**
     * Latest unrounded contribution change that changed rounded factor bracket
     * (6751 -> 7000, but 2025 will be ~6893 -> 7000)
     */
    val unroundedMaxContribution: Double,
    val roundingFactor: Double,
    val updateYear: Int,
)

val Tfsa: TaxFreeSavingsAccount = TaxFreeSavingsAccount(
    maxContribution = 7000.0,
    unroundedMaxContribution = 6893.0,
    roundingFactor = 500.0,
    updateYear = 2024,
)
