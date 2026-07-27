package com.equisoft.taxca.utils

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlinx.datetime.LocalDate

class AddYearsToDateTest {
    @Test
    fun shouldAddYears() {
        assertEquals(LocalDate(2000, 1, 1), addYearsToDate(LocalDate(1950, 1, 1), 50))
        assertEquals(LocalDate(2020, 7, 7), addYearsToDate(LocalDate(1955, 7, 7), 65))
    }

    @Test
    fun shouldOverflowLeapDayLikeJsDate() {
        // JS setUTCFullYear rolls Feb 29 into Mar 1 on non-leap years
        assertEquals(LocalDate(2001, 3, 1), addYearsToDate(LocalDate(2000, 2, 29), 1))
        assertEquals(LocalDate(2004, 2, 29), addYearsToDate(LocalDate(2000, 2, 29), 4))
    }
}

class GetMonthsDiffTest {
    @Test
    fun shouldComputeMonthsBetweenDates() {
        val cases = listOf(
            Triple(LocalDate(2020, 1, 1), LocalDate(2020, 1, 1), 0),
            Triple(LocalDate(2020, 4, 1), LocalDate(2020, 1, 1), -3),
            Triple(LocalDate(2020, 1, 1), LocalDate(2020, 4, 1), 3),
            Triple(LocalDate(2020, 1, 15), LocalDate(2020, 4, 17), 3),
            Triple(LocalDate(2020, 1, 15), LocalDate(2020, 5, 1), 3),
            Triple(LocalDate(2020, 1, 15), LocalDate(2020, 4, 13), 2),
            Triple(LocalDate(2020, 1, 30), LocalDate(2020, 2, 1), 0),
            Triple(LocalDate(2020, 3, 31), LocalDate(2020, 4, 30), 0),
            Triple(LocalDate(2021, 1, 1), LocalDate(2021, 7, 1), 6),
            Triple(LocalDate(2020, 3, 30), LocalDate(2021, 4, 30), 13),
            Triple(LocalDate(1955, 1, 1), LocalDate(2020, 7, 1), 786),
        )
        for ((first, second, expected) in cases) {
            assertEquals(expected, getMonthsDiff(first, second), "getMonthsDiff($first, $second)")
        }
    }
}

class GetAgeTest {
    @Test
    fun shouldComputeAge() {
        val cases = listOf(
            Triple(LocalDate(2000, 1, 1), LocalDate(2020, 1, 1), 20),
            Triple(LocalDate(2000, 1, 1), LocalDate(2020, 6, 15), 20),
            Triple(LocalDate(2000, 6, 15), LocalDate(2020, 6, 15), 20),
            Triple(LocalDate(2000, 6, 15), LocalDate(2020, 6, 16), 20),
            Triple(LocalDate(2000, 6, 15), LocalDate(2021, 6, 14), 20),
            Triple(LocalDate(2000, 6, 15), LocalDate(2020, 6, 14), 19),
            Triple(LocalDate(2000, 6, 15), LocalDate(2020, 5, 15), 19),
            Triple(LocalDate(2000, 12, 31), LocalDate(2021, 1, 1), 20),
            Triple(LocalDate(2000, 2, 29), LocalDate(2020, 2, 28), 19),
            Triple(LocalDate(2000, 2, 29), LocalDate(2020, 2, 29), 20),
            Triple(LocalDate(1955, 7, 7), LocalDate(2020, 7, 7), 65),
            Triple(LocalDate(1955, 7, 7), LocalDate(2020, 7, 6), 64),
            Triple(LocalDate(2020, 1, 1), LocalDate(2000, 1, 1), -20),
            Triple(LocalDate(2020, 6, 15), LocalDate(2019, 6, 15), -1),
            Triple(LocalDate(2020, 6, 15), LocalDate(2019, 6, 14), -1),
        )
        for ((birthDate, atDate, expected) in cases) {
            assertEquals(expected, getAge(birthDate, atDate), "getAge($birthDate, $atDate)")
        }
    }
}
