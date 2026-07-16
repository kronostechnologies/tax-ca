/*
 Sources
 https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/registered-education-savings-plans-resps/canada-education-savings-programs-cesp/canada-learning-bond.html

 Last updated
 2025-12-21
 */

package com.equisoft.taxca.investments.resp

// The TS source merges an interface and a const named `CanadaLearningBond`; Kotlin forbids
// a top-level class and val sharing a name, so the class carries a `Resp` prefix.
data class RespCanadaLearningBond(
    val openingYearClb: Double,
    val yearlyClb: Double,
    val maxBeneficiaryAge: Int,
) {
    fun getTotalForAYear(income: Double, beneficiaryAge: Int = 0, accountOpeningYear: Boolean = false): Double {
        var total = 0.0

        val incomeLevel = IncomeLevel.getIncomeLevel(income)
        if (incomeLevel == IncomeLevelType.LOW && beneficiaryAge <= maxBeneficiaryAge) {
            total = if (accountOpeningYear) openingYearClb else yearlyClb
        }

        return total
    }
}

val CanadaLearningBond: RespCanadaLearningBond = RespCanadaLearningBond(
    openingYearClb = 500.0,
    yearlyClb = 100.0,
    maxBeneficiaryAge = 15,
)
