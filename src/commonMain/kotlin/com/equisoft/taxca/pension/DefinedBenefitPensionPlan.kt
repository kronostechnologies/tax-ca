/*
Sources
    https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html

Revised
    2026-01-06
 */

package com.equisoft.taxca.pension

data class DefinedBenefitPensionPlan(
    val maxContribution: Double,
)

val DefinedBenefit: DefinedBenefitPensionPlan = DefinedBenefitPensionPlan(
    maxContribution = 3932.22,
)
