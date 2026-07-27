/*
Sources
    https://www.canada.ca/en/treasury-board-secretariat/services/pension-plan/plan-information/retirement-income-sources.html

    NOT USED IN FNA-ENGINE

Last revision
    2024-12-24
*/

package com.equisoft.taxca.pension

data class SupplementalPensionPlan(
    val maxBridgeBenefitAge: Int,
    val minAge: Int,
)

val Spp: SupplementalPensionPlan = SupplementalPensionPlan(
    maxBridgeBenefitAge = 65,
    minAge = 55,
)
