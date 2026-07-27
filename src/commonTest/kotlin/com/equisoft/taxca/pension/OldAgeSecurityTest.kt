package com.equisoft.taxca.pension

import kotlin.math.max
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertFalse
import kotlin.test.assertTrue
import kotlinx.datetime.LocalDate

// The legacy jest specs ran with the now() test clock frozen at 2020-01-01T12:00:00Z.
private val today = LocalDate(2020, 1, 1)

class GetRequestDateFactorTest {
    @Test
    fun shouldReturn0WhenRequestDateIsBeforeTheParticipantMinimumAgeBirthday() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2043, 1, 1) // at his 63th birthday

        val ratio = Oas.getRequestDateFactor(birthDate, requestDate, today)

        assertEquals(0.0, ratio)
    }

    @Test
    fun shouldReturn1WhenRequestDateIsExactlyTheSameAsTheParticipantMinimumAgeBirthday() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2045, 1, 1) // at his 65th birthday

        val ratio = Oas.getRequestDateFactor(birthDate, requestDate, today)

        assertEquals(1.0, ratio)
    }

    @Test
    fun shouldReturn1WhenRequestDateBeforeLastBirthdayOasAlreadyRequested() {
        val birthDate = LocalDate(1953, 7, 1)
        val requestDate = LocalDate(2018, 7, 1)

        val ratio = Oas.getRequestDateFactor(birthDate, requestDate, today)

        assertEquals(1.0, ratio)
    }

    @Test
    fun shouldReturnFactorRelatingToLastBirthday() {
        val birthDate = LocalDate(1963, 7, 1)
        val requestDate = LocalDate(2029, 9, 1) // 2 months after 66ht birthDay

        val ratio = Oas.getRequestDateFactor(birthDate, requestDate, today)

        assertEquals(1 + (14 * Oas.monthlyDelayBonus), ratio)
    }

    @Test
    fun shouldReturn1WhenCurrentlyReceivingPaymentAndAgedBetweenMinAndMaxAges() {
        val birthDate = LocalDate(1956, 6, 6)
        val requestDate = LocalDate(2021, 6, 6)

        val ratio = Oas.getRequestDateFactor(birthDate, requestDate, today)

        assertEquals(1.0, ratio)
    }

    @Test
    fun shouldReturn1WhenRequestDateIsAfterTheMinimumAgeBirthdayButForLessThanAMonth() {
        val birthDate = LocalDate(1980, 1, 15)
        val requestDate = LocalDate(2045, 2, 1) // two weeks after his 65th birthday

        val ratio = Oas.getRequestDateFactor(birthDate, requestDate, today)

        assertEquals(1.0, ratio)
    }

    @Test
    fun shouldReturn1PlusXTimesTheMonthlyDelayBonusWhenWaitingForXMonths() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2045, 7, 1) // 6 months after his 65th birthday

        val ratio = Oas.getRequestDateFactor(birthDate, requestDate, today)

        assertEquals(1 + (6 * Oas.monthlyDelayBonus), ratio)
    }

    @Test
    fun shouldReturn1Plus12TimesTheMonthlyDelayBonusWhenWaitingForExactlyAYear() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2046, 1, 1) // on his 66th birthday

        val ratio = Oas.getRequestDateFactor(birthDate, requestDate, today)

        assertEquals(1 + (12 * Oas.monthlyDelayBonus), ratio)
    }

    @Test
    fun shouldReturn1Plus24TimesTheMonthlyDelayBonusWhenWaitingFor67AndClientHasMoreThan65Yo() {
        val birthDate = LocalDate(1953, 7, 1)
        val requestDate = LocalDate(2020, 7, 1)

        val ratio = Oas.getRequestDateFactor(birthDate, requestDate, today)

        assertEquals(1 + (24 * Oas.monthlyDelayBonus), ratio)
    }

    @Test
    fun shouldReturn1Plus60TimesTheMonthlyDelayBonusWhenWaitingHasMaxAgeOnRequest() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2055, 1, 1) // on his 70th birthday

        val ratio = Oas.getRequestDateFactor(birthDate, requestDate, today)

        assertEquals(1 + (60 * Oas.monthlyDelayBonus), ratio)
    }

    @Test
    fun shouldReturnMaxDelayBonusWhenRequestIsAfterMaxAge() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2065, 1, 1) // on his 80th birthday

        val ratio = Oas.getRequestDateFactor(birthDate, requestDate, today)

        assertEquals(1 + (60 * Oas.monthlyDelayBonus), ratio)
    }

    @Test
    fun shouldComputeBonusFromAnalysisYearWhenAnalysisYearGreaterThanReferenceAge() {
        val birthDate = LocalDate(1953, 1, 1) // 67 years old
        val requestDate = LocalDate(2020, 9, 15) // 8 months after 67th birthday

        val ratio = Oas.getRequestDateFactor(birthDate, requestDate, today)

        assertEquals(1 + (32 * Oas.monthlyDelayBonus), ratio)
    }

    @Test
    fun shouldReturn1WhenAnalysisYearIsGreaterThanMaxDate() {
        val birthDate = LocalDate(1948, 1, 1) // 72 years old
        val requestDate = LocalDate(2020, 1, 1)

        val ratio = Oas.getRequestDateFactor(birthDate, requestDate, today)

        assertEquals(1.0, ratio)
    }
}

class GetMinRequestDateFactorTest {
    @Test
    fun shouldReturnFactor1WhenDoesNotHave65YoYet() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2043, 1, 1)

        val ratio = Oas.getMinRequestDateFactor(birthDate, requestDate, today)

        assertEquals(1.0, ratio)
    }

    @Test
    fun whenCurrentlyReceivingPaymentAndAgedBetweenMinAndMaxAges() {
        val birthDate = LocalDate(1956, 6, 6)
        val requestDate = LocalDate(2021, 6, 6)

        val ratio = Oas.getRequestDateFactor(birthDate, requestDate, today)

        assertEquals(1.0, ratio)
    }

    @Test
    fun shouldReturnFactor1WhenIs70YoPlus() {
        val birthDate = LocalDate(1945, 1, 1)
        val requestDate = LocalDate(2043, 1, 1)

        val ratio = Oas.getMinRequestDateFactor(birthDate, requestDate, today)

        assertEquals(1.0, ratio)
    }

    @Test
    fun shouldReturnFactorRatioWhenBetweenMinAndMaxRequestDate() {
        val birthDate = LocalDate(1952, 1, 1)
        val requestDate = LocalDate(2043, 1, 1)

        val ratio = Oas.getMinRequestDateFactor(birthDate, requestDate, today)

        assertEquals(1 + (36 * Oas.monthlyDelayBonus), ratio)
    }
}

class GetRepaymentMaxTest {
    @Test
    fun shouldReturnCorrectAmountWhenBelow74() {
        val amount = Oas.getRepaymentMax(73)
        assertEquals(Oas.repayment.max, amount)
    }

    @Test
    fun shouldReturnCorrectAmountWhen74() {
        val amount = Oas.getRepaymentMax(74)
        assertEquals(Oas.increase.repaymentMax, amount)
    }

    @Test
    fun shouldReturnCorrectAmountWhenAbove74() {
        val amount = Oas.getRepaymentMax(75)
        assertEquals(Oas.increase.repaymentMax, amount)
    }
}

class GetMinimumRequestAgeTest {
    @Test
    fun shouldReturn65WhenNoYearsOutsideCanada() {
        val age = Oas.getMinimumRequestAge(0)
        assertEquals(65, age)
    }

    @Test
    fun shouldReturn65When35YearsOutsideCanada() {
        val age = Oas.getMinimumRequestAge(35)
        assertEquals(65, age)
    }

    @Test
    fun shouldReturn68When40YearsOutsideCanada() {
        val age = Oas.getMinimumRequestAge(40)
        assertEquals(68, age)
    }

    @Test
    fun shouldReturn88When60YearsOutsideCanada() {
        val age = Oas.getMinimumRequestAge(60)
        assertEquals(88, age)
    }
}

class GetMinimumRequestDateTest {
    @Test
    fun shouldReturn65thBirthdayWhenNoYearsOutsideCanada() {
        val birthDate = LocalDate(1980, 1, 15)
        val result = Oas.getMinimumRequestDate(birthDate, 0)
        assertEquals(LocalDate(2045, 1, 15), result)
    }

    @Test
    fun shouldReturn65thBirthdayWhen35YearsOutsideCanada() {
        val birthDate = LocalDate(1980, 6, 1)
        val result = Oas.getMinimumRequestDate(birthDate, 35)
        assertEquals(LocalDate(2045, 6, 1), result)
    }

    @Test
    fun shouldReturnLaterDateWhenMoreYearsOutsideCanada() {
        val birthDate = LocalDate(1980, 1, 1)
        val result = Oas.getMinimumRequestDate(birthDate, 40)
        assertEquals(LocalDate(2048, 1, 1), result) // 68th birthday
    }

    @Test
    fun shouldDefaultTo0YearsOutsideCanadaWhenProviding0() {
        val birthDate = LocalDate(1980, 3, 15)
        val result = Oas.getMinimumRequestDate(birthDate, 0)
        assertEquals(LocalDate(2045, 3, 15), result)
    }
}

class ValidateRequestDateTest {
    @Test
    fun shouldNotThrowWhenRequestDateIsAfterMinimumRequestDate() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2046, 1, 1) // 66th birthday

        Oas.validateRequestDate(requestDate, birthDate, 0)
    }

    @Test
    fun shouldNotThrowWhenRequestDateEqualsMinimumRequestDate() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2045, 1, 1) // 65th birthday

        Oas.validateRequestDate(requestDate, birthDate, 0)
    }

    @Test
    fun shouldThrowWhenRequestDateIsBeforeMinimumRequestDate() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2044, 1, 1) // 64th birthday

        assertFailsWith<IllegalArgumentException> {
            Oas.validateRequestDate(requestDate, birthDate, 0)
        }
    }

    @Test
    fun shouldThrowWhenRequestDateIsBeforeAdjustedMinimumForYearsOutsideCanada() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2046, 1, 1) // 66th birthday, but needs 68 with 40 years outside

        assertFailsWith<IllegalArgumentException> {
            Oas.validateRequestDate(requestDate, birthDate, 40)
        }
    }

    @Test
    fun shouldNotThrowWhenRequestDateMeetsAdjustedMinimumForYearsOutsideCanada() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2048, 1, 1) // 68th birthday

        Oas.validateRequestDate(requestDate, birthDate, 40)
    }
}

class GetResidencyYearsAtRequestTest {
    @Test
    fun shouldReturnFullResidencyWhenNoYearsOutsideCanada() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2045, 1, 1) // 65th birthday

        val result = Oas.getResidencyYearsAtRequest(birthDate, requestDate, 0)

        assertEquals(47, result) // 65 - 18 = 47 years
    }

    @Test
    fun shouldReturnReducedResidencyWhenYearsOutsideCanada() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2045, 1, 1) // 65th birthday

        val result = Oas.getResidencyYearsAtRequest(birthDate, requestDate, 10)

        assertEquals(37, result) // 65 - 18 - 10 = 37 years
    }

    @Test
    fun shouldReturn0WhenYearsOutsideCanadaExceedPossibleResidency() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2045, 1, 1) // 65th birthday

        val result = Oas.getResidencyYearsAtRequest(birthDate, requestDate, 50)

        assertEquals(0, result)
    }

    @Test
    fun shouldIncreaseResidencyYearsWithLaterRequestDate() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2050, 1, 1) // 70th birthday

        val result = Oas.getResidencyYearsAtRequest(birthDate, requestDate, 10)

        assertEquals(42, result) // 70 - 18 - 10 = 42 years
    }
}

class GetRequestDateMonthsDeferredTest {
    @Test
    fun shouldReturn0WhenRequestingAtMinimumAge() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2045, 1, 1) // 65th birthday

        val result = Oas.getRequestDateMonthsDeferred(birthDate, requestDate, 0)

        assertEquals(0, result)
    }

    @Test
    fun shouldReturn12WhenRequesting1YearAfterMinimumAge() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2046, 1, 1) // 66th birthday

        val result = Oas.getRequestDateMonthsDeferred(birthDate, requestDate, 0)

        assertEquals(12, result)
    }

    @Test
    fun shouldReturn60WhenRequestingAtMaximumAge() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2050, 1, 1) // 70th birthday

        val result = Oas.getRequestDateMonthsDeferred(birthDate, requestDate, 0)

        assertEquals(60, result)
    }

    @Test
    fun shouldCapAt60MonthsWhenRequestingAfterMaximumAge() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2055, 1, 1) // 75th birthday

        val result = Oas.getRequestDateMonthsDeferred(birthDate, requestDate, 0)

        assertEquals(60, result)
    }

    @Test
    fun shouldThrowWhenRequestDateIsBeforeMinimum() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2044, 1, 1) // 64th birthday

        assertFailsWith<IllegalArgumentException> {
            Oas.getRequestDateMonthsDeferred(birthDate, requestDate, 0)
        }
    }

    @Test
    fun shouldCalculateCorrectlyWithYearsOutsideCanada() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2050, 1, 1) // 70th birthday, minimum is 68 with 40 years outside

        val result = Oas.getRequestDateMonthsDeferred(birthDate, requestDate, 40)

        assertEquals(24, result) // 70 - 68 = 2 years = 24 months
    }
}

class IsFullResidencyAtMinOasAgeTest {
    @Test
    fun shouldReturnTrueWhenResidencyYearsAt65IsAtLeast40() {
        val birthDate = LocalDate(1980, 1, 1)

        val result = Oas.isFullResidencyAtMinOASAge(birthDate, 0)

        assertTrue(result) // 65 - 18 = 47 years residency
    }

    @Test
    fun shouldReturnTrueWhenResidencyYearsAt65IsExactly40() {
        val birthDate = LocalDate(1980, 1, 1)

        val result = Oas.isFullResidencyAtMinOASAge(birthDate, 7)

        assertTrue(result) // 65 - 18 - 7 = 40 years residency
    }

    @Test
    fun shouldReturnFalseWhenResidencyYearsAt65IsLessThan40() {
        val birthDate = LocalDate(1980, 1, 1)

        val result = Oas.isFullResidencyAtMinOASAge(birthDate, 10)

        assertFalse(result) // 65 - 18 - 10 = 37 years residency
    }

    @Test
    fun shouldReturnFalseWhenManyYearsOutsideCanada() {
        val birthDate = LocalDate(1980, 1, 1)

        val result = Oas.isFullResidencyAtMinOASAge(birthDate, 30)

        assertFalse(result) // 65 - 18 - 30 = 17 years residency
    }
}

class GetDeferredRequestAmountTest {
    @Test
    fun shouldReturnBaseMonthlyPaymentWhenNoDeferral() {
        val result = Oas.getDeferredRequestAmount(0)

        assertEquals(Oas.monthlyPaymentMax, result)
    }

    @Test
    fun shouldIncreasePaymentForEachMonthDeferred() {
        val result = Oas.getDeferredRequestAmount(12)

        assertEquals(Oas.monthlyPaymentMax * (1 + (Oas.monthlyDelayBonus * 12)), result)
    }

    @Test
    fun shouldApplyRatioForPartialResidency() {
        val ratio = 0.5
        val result = Oas.getDeferredRequestAmount(0, ratio)

        assertEquals(Oas.monthlyPaymentMax * ratio, result)
    }

    @Test
    fun shouldApplyBothRatioAndDeferralBonus() {
        val ratio = 0.75
        val monthsDeferred = 24
        val result = Oas.getDeferredRequestAmount(monthsDeferred, ratio)

        assertEquals((ratio * Oas.monthlyPaymentMax) * (1 + (Oas.monthlyDelayBonus * monthsDeferred)), result)
    }

    @Test
    fun shouldReturnMaximumDeferralBonusAt60Months() {
        val result = Oas.getDeferredRequestAmount(60)

        assertEquals(Oas.monthlyPaymentMax * (1 + (Oas.monthlyDelayBonus * 60)), result)
    }
}

class GetMonthlyOasAmountTest {
    @Test
    fun shouldReturnFullPaymentAtMinimumAgeWithFullResidency() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2045, 1, 1) // 65th birthday

        val result = Oas.getMonthlyOASAmount(birthDate, requestDate, 0)

        assertEquals(Oas.monthlyPaymentMax, result)
    }

    @Test
    fun shouldReturnIncreasedPaymentWhenDeferringWithFullResidency() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2050, 1, 1) // 70th birthday

        val result = Oas.getMonthlyOASAmount(birthDate, requestDate, 0)

        assertEquals(Oas.monthlyPaymentMax * (1 + (Oas.monthlyDelayBonus * 60)), result)
    }

    @Test
    fun shouldThrowWhenRequestDateIsBeforeMinimum() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2044, 1, 1) // 64th birthday

        assertFailsWith<IllegalArgumentException> {
            Oas.getMonthlyOASAmount(birthDate, requestDate, 0)
        }
    }

    @Test
    fun shouldReturnPartialPaymentWithPartialResidency() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2045, 1, 1) // 65th birthday

        val result = Oas.getMonthlyOASAmount(birthDate, requestDate, 27)

        // residency = 65 - 18 - 27 = 20 years
        // ratio = 20 / 40 = 0.5
        assertEquals(Oas.monthlyPaymentMax * 0.5, result)
    }

    @Test
    fun shouldChooseBestOptionBetweenDeferralAndResidencyAccumulation() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2050, 1, 1) // 70th birthday

        val result = Oas.getMonthlyOASAmount(birthDate, requestDate, 27)

        // Option 1: Deferral from min age (65) with ratio at min age
        // residency at 65 = 65 - 18 - 27 = 20 years, ratio = 0.5
        // deferral bonus for 60 months = (0.5 * MONTHLY_MAX) * (1 + 0.006 * 60)
        val deferralOption = (0.5 * Oas.monthlyPaymentMax) * (1 + (Oas.monthlyDelayBonus * 60))

        // Option 2: Residency at request date
        // residency at 70 = 70 - 18 - 27 = 25 years, ratio = 25/40 = 0.625
        val residencyOption = Oas.monthlyPaymentMax * 0.625

        assertEquals(max(deferralOption, residencyOption), result)
    }

    @Test
    fun shouldHandleCaseWhereResidencyRatioMaxesOutBeforeMaxResidencyYears() {
        val birthDate = LocalDate(1980, 1, 1)
        val requestDate = LocalDate(2045, 1, 1) // 65th birthday

        val result = Oas.getMonthlyOASAmount(birthDate, requestDate, 5)

        // residency = 65 - 18 - 5 = 42 years, but capped at 40
        // ratio = min(42/40, 1) = 1
        assertEquals(Oas.monthlyPaymentMax, result)
    }

    @Test
    fun shouldIncreasePaymentBy10PercentWhenRecipientIsOver75YearsOld() {
        data class Case(
            val birthDate: LocalDate,
            val requestDate: LocalDate,
            val yearsOutsideCanadaBeforeOas: Int,
            val expected: Double,
        )

        val cases = listOf(
            Case(
                birthDate = LocalDate(1953, 1, 1),
                requestDate = LocalDate(2036, 1, 1),
                yearsOutsideCanadaBeforeOas = 55,
                expected = (10.0 / 40) * Oas.monthlyPaymentMax * 1.1,
            ),
            Case(
                birthDate = LocalDate(1950, 1, 1),
                requestDate = LocalDate(2055, 1, 1),
                yearsOutsideCanadaBeforeOas = 76,
                expected = (11.0 / 40) * Oas.monthlyPaymentMax * 1.1,
            ),
        )

        for ((birthDate, requestDate, yearsOutsideCanadaBeforeOas, expected) in cases) {
            val result = Oas.getMonthlyOASAmount(birthDate, requestDate, yearsOutsideCanadaBeforeOas)

            assertEquals(expected, result, "getMonthlyOASAmount($birthDate, $requestDate, $yearsOutsideCanadaBeforeOas)")
        }
    }

    @Test
    fun shouldOnlyConsiderTheRequestResidencyDeferralAmountWhenRequestIsAfterMaxAge() {
        val birthDate = LocalDate(1984, 1, 1)
        val requestDate = LocalDate(2059, 1, 1) // 75th birthday

        val result = Oas.getMonthlyOASAmount(birthDate, requestDate, 47)

        // residency = 75 - 18 - 47 = 10 years
        // ratio = min(10/40, 1) = 0.25
        assertEquals(Oas.monthlyPaymentMax * 0.25, result)
    }
}
