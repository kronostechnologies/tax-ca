package com.equisoft.taxca.pension

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlinx.datetime.LocalDate

class QuebecPensionPlanTest {
    private data class Case(
        val label: String,
        val birthDate: LocalDate,
        val requestDate: LocalDate,
        val expected: Double,
        val customReferenceDate: LocalDate? = null,
    )

    @Test
    fun getRequestDateFactor() {
        val bonus = Qpp.monthlyDelay.bonus
        val penalty = Qpp.monthlyDelay.penalty
        val cases = listOf(
            Case(
                "should return 0 when request date is before the participant 60th (minimum age) birthday",
                birthDate = LocalDate(1980, 1, 1),
                requestDate = LocalDate(2039, 1, 1), // at his 59th birthday
                expected = 0.0,
            ),
            Case(
                "should return 1 when request date is exactly the same as the participant 65th (reference age) birthday",
                birthDate = LocalDate(1980, 1, 1),
                requestDate = LocalDate(2045, 1, 1), // at his 65th birthday
                expected = 1.0,
            ),
            Case(
                "should count the bonus from the reference age even when the request date is in the past",
                birthDate = LocalDate(1953, 7, 1),
                requestDate = LocalDate(2019, 7, 1), // on his 66th birthday, 12 months after the reference age
                expected = 1 + (12 * bonus),
            ),
            Case(
                "should count the bonus from the reference age, not from the last birthday",
                birthDate = LocalDate(1953, 7, 1),
                requestDate = LocalDate(2019, 9, 1), // 14 months after the 65th birthday (reference age)
                expected = 1 + (14 * bonus),
            ),
            Case(
                "should apply the penalty when the request date is before the reference age",
                birthDate = LocalDate(1957, 6, 6),
                requestDate = LocalDate(2018, 6, 6), // on 61th birthDay, 48 months before the reference age
                expected = 1 - (48 * penalty),
            ),
            Case(
                "should return 1 when request date is after the participant 65th (reference age) birthday " +
                    "but for less than a month",
                birthDate = LocalDate(1980, 1, 15),
                requestDate = LocalDate(2045, 2, 1), // two weeks after his 65th birthday
                expected = 1.0,
            ),
            Case(
                "should return 1 + X times the MONTHLY delay bonus when waiting for x months",
                birthDate = LocalDate(1980, 1, 1),
                requestDate = LocalDate(2045, 7, 1), // 6 months after his 65th birthday
                expected = 1 + (6 * bonus),
            ),
            Case(
                "should return 1 + 12 times the MONTHLY delay bonus when waiting for exactly a year",
                birthDate = LocalDate(1980, 1, 1),
                requestDate = LocalDate(2046, 1, 1), // on his 66th birthday
                expected = 1 + (12 * bonus),
            ),
            Case(
                "should return 1 + 84 times the MONTHLY delay bonus when waiting has max age on request",
                birthDate = LocalDate(1980, 1, 1),
                requestDate = LocalDate(2057, 1, 1), // on his 72nd birthday
                expected = 1 + (84 * bonus),
            ),
            Case(
                "should return max delay bonus (1 + 84 times the MONTHLY delay bonus) when request is after max age",
                birthDate = LocalDate(1980, 1, 1),
                requestDate = LocalDate(2065, 1, 1), // on his 80th birthday
                expected = 1 + (84 * bonus),
            ),
            Case(
                "should return 1 - X times the MONTHLY delay penalty when taking pension x months earlier",
                birthDate = LocalDate(1980, 1, 1),
                requestDate = LocalDate(2044, 7, 1), // 6 months before his 65th birthday
                expected = 1 - (6 * penalty),
            ),
            Case(
                "should return 1 - 12 times the MONTHLY delay penalty when taking pension a year earlier",
                birthDate = LocalDate(1980, 1, 1),
                requestDate = LocalDate(2044, 1, 1), // on his 64th birthday
                expected = 1 - (12 * penalty),
            ),
            Case(
                "should count the bonus from the reference age for a request several years past 65",
                birthDate = LocalDate(1953, 1, 1),
                requestDate = LocalDate(2020, 9, 15), // 32 months after the 65th birthday (reference age)
                expected = 1 + (32 * bonus),
            ),
            Case(
                "should clamp to the max bonus when the request date is past the maximum request age",
                birthDate = LocalDate(1948, 1, 1),
                requestDate = LocalDate(2020, 1, 1), // on his 72nd birthday, exactly the QPP max request age
                expected = 1 + (84 * bonus),
            ),
            Case(
                "should use a custom reference date on calculation when given",
                birthDate = LocalDate(1980, 1, 1),
                requestDate = LocalDate(2046, 7, 1), // 6 months after his 66th birthday, the custom reference date
                expected = 1 + (6 * bonus),
                customReferenceDate = LocalDate(2046, 1, 1),
            ),
        )

        for ((label, birthDate, requestDate, expected, customReferenceDate) in cases) {
            assertEquals(expected, Qpp.getRequestDateFactor(birthDate, requestDate, customReferenceDate), label)
        }
    }

    // ABF-13000 regression: bonus for clients already past the reference age
    @Test
    fun getRequestDateFactorPastReferenceAgeRegression() {
        val bonus = Qpp.monthlyDelay.bonus
        val cases = listOf(
            Case(
                "should bonify a request on the 66th birthday (DOB 1960-01-01)",
                birthDate = LocalDate(1960, 1, 1),
                requestDate = LocalDate(2026, 1, 1), // 66th birthday, 12 months past the reference age
                expected = 1 + (12 * bonus), // 1.084
            ),
            Case(
                "should bonify a request on the 68th birthday (DOB 1958-01-01)",
                birthDate = LocalDate(1958, 1, 1),
                requestDate = LocalDate(2026, 1, 1), // 68th birthday, 36 months past the reference age
                expected = 1 + (36 * bonus), // 1.252
            ),
            Case(
                "should bonify a request on the 68th birthday for a mid-year birth date (DOB 1958-08-01)",
                birthDate = LocalDate(1958, 8, 1),
                requestDate = LocalDate(2026, 8, 1), // 68th birthday, 36 months past the reference age
                expected = 1 + (36 * bonus), // 1.252
            ),
            Case(
                "should clamp to the max bonus at age 72 when the request date is past the maximum request age",
                birthDate = LocalDate(1980, 1, 1),
                requestDate = LocalDate(2058, 1, 1), // on his 78th birthday, past the 72 max request age
                expected = 1 + (84 * bonus), // 1.588
            ),
            // Legacy spec pinned the system clock to 2030-06-15; the factor takes no clock input in
            // common code, so the same assertion covers "independent of the current system date".
            Case(
                "should be independent of the current system date",
                birthDate = LocalDate(1960, 1, 1),
                requestDate = LocalDate(2026, 1, 1), // 66th birthday, 12 months past the reference age
                expected = 1 + (12 * bonus),
            ),
        )

        for ((label, birthDate, requestDate, expected, customReferenceDate) in cases) {
            assertEquals(expected, Qpp.getRequestDateFactor(birthDate, requestDate, customReferenceDate), label)
        }
    }
}
