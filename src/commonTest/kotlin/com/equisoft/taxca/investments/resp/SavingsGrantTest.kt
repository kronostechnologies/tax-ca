package com.equisoft.taxca.investments.resp

import kotlin.test.Test
import kotlin.test.assertEquals

class SavingsGrantTest {
    // Mirrors the legacy spec: a SavingsGrant initialized from the CESG configuration.
    private val savingsGrant = SavingsGrant(
        maxGrant = CanadaEducationSavingsGrant.maxGrant,
        maxBeneficiaryAge = CanadaEducationSavingsGrant.maxBeneficiaryAge,
        maxAmountYearlyForGrant = CanadaEducationSavingsGrant.maxAmountYearlyForGrant,
        yearlyGrantPercent = CanadaEducationSavingsGrant.yearlyGrantPercent,
        maxAmountForSuppGrant = CanadaEducationSavingsGrant.maxAmountForSuppGrant,
        suppGrantPercent = CanadaEducationSavingsGrant.suppGrantPercent,
    )

    @Test
    fun shouldReturnZeroIfTotalGrantAlreadyGivenIsGreaterThanOrEqualToMaxGrant() {
        val income = 50000.0
        val contribution = 2000.0
        val totalGrantAlreadyGiven = CanadaEducationSavingsGrant.maxGrant
        val totalGrant = savingsGrant.getTotalForAYear(income, contribution, totalGrantAlreadyGiven)
        assertEquals(0.0, totalGrant)
    }

    @Test
    fun shouldReturnZeroIfBeneficiaryAgeIsGreaterThanMaxBeneficiaryAge() {
        val income = 50000.0
        val contribution = 2000.0
        val beneficiaryAge = CanadaEducationSavingsGrant.maxBeneficiaryAge + 1
        val totalGrant = savingsGrant.getTotalForAYear(income, contribution, 0.0, beneficiaryAge)
        assertEquals(0.0, totalGrant)
    }

    @Test
    fun shouldReturnCorrectTotalGrantForAYearForLowIncomeLevel() {
        val income = IncomeLevel.lowIncomeThreshold
        val contribution = CanadaEducationSavingsGrant.maxAmountYearlyForGrant
        val baseGrant = contribution * CanadaEducationSavingsGrant.yearlyGrantPercent
        val suppGrant = CanadaEducationSavingsGrant.maxAmountForSuppGrant *
            CanadaEducationSavingsGrant.suppGrantPercent.lowIncome
        val expectedTotalGrant = baseGrant + suppGrant
        val totalGrant = savingsGrant.getTotalForAYear(income, contribution)
        assertEquals(expectedTotalGrant, totalGrant)
    }

    @Test
    fun shouldReturnCorrectTotalGrantForAYearForLowIncomeLevelWithHigherThanMaxContribution() {
        val income = IncomeLevel.lowIncomeThreshold
        val contribution = CanadaEducationSavingsGrant.maxAmountYearlyForGrant + 1
        val baseGrant = CanadaEducationSavingsGrant.maxAmountYearlyForGrant *
            CanadaEducationSavingsGrant.yearlyGrantPercent
        val suppGrant = CanadaEducationSavingsGrant.maxAmountForSuppGrant *
            CanadaEducationSavingsGrant.suppGrantPercent.lowIncome
        val expectedTotalGrant = baseGrant + suppGrant
        val totalGrant = savingsGrant.getTotalForAYear(income, contribution)
        assertEquals(expectedTotalGrant, totalGrant)
    }

    @Test
    fun shouldReturnCorrectTotalGrantForAYearForMediumIncomeLevel() {
        val income = IncomeLevel.mediumIncomeThreshold
        val contribution = CanadaEducationSavingsGrant.maxAmountYearlyForGrant
        val baseGrant = contribution * CanadaEducationSavingsGrant.yearlyGrantPercent
        val suppGrant = CanadaEducationSavingsGrant.maxAmountForSuppGrant *
            CanadaEducationSavingsGrant.suppGrantPercent.mediumIncome
        val expectedTotalGrant = baseGrant + suppGrant
        val totalGrant = savingsGrant.getTotalForAYear(income, contribution)
        assertEquals(expectedTotalGrant, totalGrant)
    }

    @Test
    fun shouldReturnCorrectTotalGrantForAYearForMediumIncomeLevelWithHigherThanMaxContribution() {
        val income = IncomeLevel.mediumIncomeThreshold
        val contribution = CanadaEducationSavingsGrant.maxAmountYearlyForGrant + 1
        val baseGrant = CanadaEducationSavingsGrant.maxAmountYearlyForGrant *
            CanadaEducationSavingsGrant.yearlyGrantPercent
        val suppGrant = CanadaEducationSavingsGrant.maxAmountForSuppGrant *
            CanadaEducationSavingsGrant.suppGrantPercent.mediumIncome
        val expectedTotalGrant = baseGrant + suppGrant
        val totalGrant = savingsGrant.getTotalForAYear(income, contribution)
        assertEquals(expectedTotalGrant, totalGrant)
    }

    @Test
    fun shouldReturnCorrectTotalGrantForAYearForHighIncomeLevel() {
        val income = IncomeLevel.mediumIncomeThreshold + 1
        val contribution = CanadaEducationSavingsGrant.maxAmountYearlyForGrant
        val expectedTotalGrant = contribution * CanadaEducationSavingsGrant.yearlyGrantPercent
        val totalGrant = savingsGrant.getTotalForAYear(income, contribution)
        assertEquals(expectedTotalGrant, totalGrant)
    }

    @Test
    fun shouldReturnCorrectTotalGrantForAYearForHighIncomeLevelWithHigherThanMaxContribution() {
        val income = IncomeLevel.mediumIncomeThreshold + 1
        val contribution = CanadaEducationSavingsGrant.maxAmountYearlyForGrant + 1
        val expectedTotalGrant = CanadaEducationSavingsGrant.maxAmountYearlyForGrant *
            CanadaEducationSavingsGrant.yearlyGrantPercent
        val totalGrant = savingsGrant.getTotalForAYear(income, contribution)
        assertEquals(expectedTotalGrant, totalGrant)
    }
}
