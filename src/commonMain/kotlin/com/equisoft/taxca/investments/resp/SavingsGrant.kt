package com.equisoft.taxca.investments.resp

import kotlin.math.min

data class SuppGrantPercent(
    val lowIncome: Double,
    val mediumIncome: Double,
)

data class SavingsGrant(
    val maxGrant: Double,
    val maxBeneficiaryAge: Int,
    val maxAmountYearlyForGrant: Double,
    val yearlyGrantPercent: Double,
    val maxAmountForSuppGrant: Double,
    val suppGrantPercent: SuppGrantPercent,
) {
    fun getBaseGrant(contribution: Double): Double {
        val totalGrantForAYear: Double = if (contribution > maxAmountYearlyForGrant) {
            yearlyGrantPercent * maxAmountYearlyForGrant
        } else {
            yearlyGrantPercent * contribution
        }

        return totalGrantForAYear
    }

    fun getSuppGrant(contribution: Double, incomeLevel: IncomeLevelType): Double {
        var suppGrant = 0.0
        val cappedContribution = min(contribution, maxAmountForSuppGrant)

        when (incomeLevel) {
            IncomeLevelType.LOW -> suppGrant = suppGrantPercent.lowIncome * cappedContribution
            IncomeLevelType.MEDIUM -> suppGrant = suppGrantPercent.mediumIncome * cappedContribution
            IncomeLevelType.HIGH -> {}
        }

        return suppGrant
    }

    fun getTotalForAYear(
        income: Double,
        contribution: Double,
        totalGrantAlreadyGiven: Double = 0.0,
        beneficiaryAge: Int = 0,
    ): Double {
        if (totalGrantAlreadyGiven >= maxGrant || beneficiaryAge > maxBeneficiaryAge) return 0.0

        // Grant
        var totalGrantForAYear = getBaseGrant(contribution)

        // Supp. grant
        val incomeLevel = IncomeLevel.getIncomeLevel(income)
        totalGrantForAYear += getSuppGrant(contribution, incomeLevel)

        return totalGrantForAYear
    }
}
