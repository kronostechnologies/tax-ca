package com.equisoft.taxca.investments.resp

import kotlin.test.Test
import kotlin.test.assertEquals

class CanadaLearningBondTest {
    @Test
    fun shouldReturnZeroForAllIncomeLevelButLow() {
        val income = IncomeLevel.lowIncomeThreshold + 1
        val beneficiaryAge = CanadaLearningBond.maxBeneficiaryAge
        val expectedTotalBond = 0.0
        val totalBond = CanadaLearningBond.getTotalForAYear(income, beneficiaryAge)
        assertEquals(expectedTotalBond, totalBond)
    }

    @Test
    fun shouldReturnZeroIfBeneficiaryAgeIsAboveMaxAge() {
        val income = IncomeLevel.lowIncomeThreshold
        val beneficiaryAge = CanadaLearningBond.maxBeneficiaryAge + 1
        val expectedTotalBond = 0.0
        val totalBond = CanadaLearningBond.getTotalForAYear(income, beneficiaryAge)
        assertEquals(expectedTotalBond, totalBond)
    }

    @Test
    fun shouldReturnOpeningAccountClbForOpeningYear() {
        val income = IncomeLevel.lowIncomeThreshold
        val beneficiaryAge = CanadaLearningBond.maxBeneficiaryAge
        val openingYearClb = CanadaLearningBond.openingYearClb
        val totalBond = CanadaLearningBond.getTotalForAYear(income, beneficiaryAge, true)
        assertEquals(openingYearClb, totalBond)
    }

    @Test
    fun shouldReturnYearlyBondAfterOpeningYear() {
        val income = IncomeLevel.lowIncomeThreshold
        val beneficiaryAge = CanadaLearningBond.maxBeneficiaryAge
        val yearlyClb = CanadaLearningBond.yearlyClb
        val totalBond = CanadaLearningBond.getTotalForAYear(income, beneficiaryAge, false)
        assertEquals(yearlyClb, totalBond)
    }
}
