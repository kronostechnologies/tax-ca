package com.equisoft.taxca.taxes

import com.equisoft.taxca.misc.Jurisdiction
import com.equisoft.taxca.utils.roundToPrecision
import kotlin.math.max
import kotlin.test.Test
import kotlin.test.assertEquals

// Ported from src/taxes/tests/income-tax.spec.ts ("getTaxAMount" suite).
class IncomeTaxTest {
    @Test
    fun getProvincialTaxAmountShouldCalculateOperationsInTheRightOrderForOn() {
        val province = Jurisdiction.ON
        val grossIncome = 207000.0
        val inflationRate = 0.021
        val yearsToInflate = 0.0
        val taxCredit = 20700.0
        val baseTaxAmount = getProvincialBaseTaxAmount(
            province,
            grossIncome,
            inflationRate,
            yearsToInflate,
        )
        val baseCredit = getProvincialBaseCredit(province, inflationRate, yearsToInflate)
        val tax = max(baseTaxAmount - baseCredit, 0.0)
        val surTax = getProvincialSurtaxAmount(province, tax, inflationRate, yearsToInflate)
        val expectedTax = max(tax + surTax - taxCredit, 0.0)

        val provincialTaxAmount = getProvincialTaxAmount(
            province,
            grossIncome,
            inflationRate,
            yearsToInflate,
            taxCredit,
        )

        assertEquals(expectedTax, provincialTaxAmount)
    }

    @Test
    fun getProvincialTaxAmountShouldCalculateOperationsInTheRightOrderForQc() {
        val province = Jurisdiction.QC
        val grossIncome = 209000.0
        val inflationRate = 0.021
        val yearsToInflate = 0.0
        val taxCredit = 20900.0
        val baseTaxAmount = getProvincialBaseTaxAmount(
            province,
            grossIncome,
            inflationRate,
            yearsToInflate,
        )
        val baseCredit = getProvincialBaseCredit(province, inflationRate, yearsToInflate)
        val tax = max(baseTaxAmount - baseCredit, 0.0)
        val surTax = getProvincialSurtaxAmount(province, tax, inflationRate, yearsToInflate)
        val expectedTax = max(tax + surTax - taxCredit, 0.0)

        val provincialTaxAmount = getProvincialTaxAmount(
            province,
            grossIncome,
            inflationRate,
            yearsToInflate,
            taxCredit,
        )

        assertEquals(expectedTax, provincialTaxAmount)
    }

    @Test
    fun getFederalTaxAmountShouldCalculateOperationsInTheRightOrder() {
        val province = Jurisdiction.QC
        val grossIncome = 100000.0
        val inflationRate = 2.1
        val yearsToInflate = 0.0
        val taxCredit = 1000.0
        val federalBaseTaxAmount = getFederalBaseTaxAmount(grossIncome, inflationRate, yearsToInflate)
        val baseCredit = getFederalBaseCredit(grossIncome, inflationRate, yearsToInflate)
        val federalTax = max(federalBaseTaxAmount - baseCredit - taxCredit, 0.0)
        val abatement = getProvincialAbatement(province, federalTax)

        val federalTaxAmount = getFederalTaxAmount(
            province,
            grossIncome,
            inflationRate,
            yearsToInflate,
            taxCredit,
        )

        assertEquals(federalTax - abatement, federalTaxAmount)
    }

    @Test
    fun getFederalBasePersonalAmountShouldReturnExpectedBpaForIncome() {
        val cases = listOf(
            Pair(60000.0, 16452.00),
            Pair(150000.0, 16452.00),
            Pair(181440.0, 16452.00),
            Pair(210000.0, 15850.34),
            Pair(221435.0, 15609.45),
            Pair(258482.0, 14829.00),
            Pair(300000.0, 14829.00),
        )
        for ((grossIncome, expectedBPA) in cases) {
            val bpa = getFederalBasicPersonalAmount(grossIncome, 0.0, 0.0)
            assertEquals(expectedBPA, roundToPrecision(bpa, 2), "should return BPA=$expectedBPA for income $grossIncome")
        }
    }

    @Test
    fun getFederalBaseCreditShouldReturnExpectedCreditForIncome() {
        val cases = listOf(
            Pair(60000.0, 2303.28),
            Pair(150000.0, 2303.28),
            Pair(181440.0, 2303.28),
            Pair(210000.0, 2219.05),
            Pair(221435.0, 2185.32),
            Pair(258482.0, 2076.06),
            Pair(300000.0, 2076.06),
        )
        for ((grossIncome, expectedCredit) in cases) {
            val credit = getFederalBaseCredit(grossIncome, 0.0, 0.0)
            assertEquals(
                expectedCredit,
                roundToPrecision(credit, 2),
                "should return credit=$expectedCredit for income $grossIncome",
            )
        }
    }
}
