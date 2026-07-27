package com.equisoft.taxca.jvm

import com.equisoft.taxca.pension.Cpp
import com.equisoft.taxca.pension.Oas
import com.equisoft.taxca.pension.Qpp
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDate
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class DecimalTest {
    @Test
    fun toDecimalPreservesDecimalLiterals() {
        assertEquals(BigDecimal("0.0595"), Cpp.contributionRates.base.toDecimal())
        assertEquals(BigDecimal("0.063"), Qpp.contributionRates.base.toDecimal())
        assertEquals(BigDecimal("74600.0"), Qpp.pensionableEarnings.ympe.toDecimal())
        assertEquals(0, BigDecimal("74600").compareTo(Qpp.pensionableEarnings.ympe.toDecimal()))
    }
}

class JavaTimeOverloadsTest {
    @Test
    fun requestDateFactorMatchesCommonImplementation() {
        val factor = Cpp.getRequestDateFactor(LocalDate.of(1960, 1, 1), LocalDate.of(2025, 1, 1))
        assertEquals(1.0, factor) // request exactly at the 65th birthday (reference age)

        val deferred = Cpp.getRequestDateFactor(LocalDate.of(1960, 1, 1), LocalDate.of(2026, 1, 1))
        assertEquals(1 + (12 * Cpp.monthlyDelay.bonus), deferred)
    }

    @Test
    fun oasOverloadsDelegate() {
        assertEquals(LocalDate.of(2025, 1, 1), Oas.getMinimumRequestDate(LocalDate.of(1960, 1, 1)))
        assertTrue(Oas.isRequestDateValid(LocalDate.of(1960, 1, 1), LocalDate.of(2026, 1, 1)))
        assertTrue(!Oas.isRequestDateValid(LocalDate.of(1960, 1, 1), LocalDate.of(2024, 1, 1)))
        assertEquals(12, Oas.getRequestDateMonthsDeferred(LocalDate.of(1960, 1, 1), LocalDate.of(2026, 1, 1)))
    }
}

class ContributionCoverageFactorTest {
    private val birthDate: LocalDate = LocalDate.of(1960, 1, 1)

    // Expected values computed with the same formula financial-api's tests use
    // (PublicPensionPlanTest.CalculateContributionCoverageFactorTest).
    private fun expected(contributionYears: Int, requestDate: LocalDate): BigDecimal {
        val start = maxOf(216L, java.time.temporal.ChronoUnit.MONTHS.between(birthDate, LocalDate.of(1966, 1, 1)))
        val end = minOf(840L, java.time.temporal.ChronoUnit.MONTHS.between(birthDate, requestDate))
        val length = BigDecimal(end - start)
        val dropOut = BigDecimal("0.17").multiply(length).min(length.subtract(BigDecimal(120)))
        val maxMonths = length.subtract(dropOut)
        return BigDecimal(contributionYears).multiply(BigDecimal(12))
            .min(maxMonths)
            .divide(maxMonths, 10, RoundingMode.HALF_UP)
    }

    @Test
    fun nullContributionYearsMeansFullCoverage() {
        assertEquals(BigDecimal.ONE, calculateCppContributionCoverageFactorDecimal(birthDate, LocalDate.of(2025, 1, 1), null))
        assertEquals(1.0, calculateCppContributionCoverageFactor(birthDate, LocalDate.of(2025, 1, 1), null))
    }

    @Test
    fun decimalVariantMatchesFinancialApiFormula() {
        for (years in listOf(1, 10, 25, 39, 40, 50)) {
            for (request in listOf(LocalDate.of(2025, 1, 1), LocalDate.of(2030, 1, 1))) {
                assertEquals(0, expected(years, request).compareTo(calculateCppContributionCoverageFactorDecimal(birthDate, request, years)), "years=$years request=$request")
            }
        }
    }

    @Test
    fun doubleVariantAgreesWithDecimalVariantToTenDigits() {
        for (years in listOf(1, 10, 25, 39, 40, 50)) {
            for (request in listOf(LocalDate.of(2025, 1, 1), LocalDate.of(2030, 1, 1))) {
                val decimal = calculateCppContributionCoverageFactorDecimal(birthDate, request, years).toDouble()
                val double = calculateCppContributionCoverageFactor(birthDate, request, years)
                assertEquals(decimal, double, 1e-10, "years=$years request=$request")
            }
        }
    }
}
