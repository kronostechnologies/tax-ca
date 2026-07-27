// Ported from src/investments/tests/life-income-fund.spec.ts

package com.equisoft.taxca.investments

import com.equisoft.taxca.misc.Jurisdiction
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

class GetMaxWithdrawalPctTest {
    private data class Group(
        val title: String,
        val min: Int,
        val max: Int,
        val jurisdictions: List<Jurisdiction>,
        val maxWithdrawalPct: Map<Int, Double>,
    )

    private val groups = listOf(
        Group(
            title = "given AB, BC, ON, NB, NL or SK jurisdiction",
            min = 51,
            max = 90,
            jurisdictions = listOf(
                Jurisdiction.AB,
                Jurisdiction.BC,
                Jurisdiction.ON,
                Jurisdiction.NB,
                Jurisdiction.NL,
                Jurisdiction.SK,
            ),
            maxWithdrawalPct = province1MaxWithdrawalPct,
        ),
        Group(
            title = "given QC, MB or NS jurisdiction",
            min = 51,
            max = 89,
            jurisdictions = listOf(Jurisdiction.QC, Jurisdiction.MB, Jurisdiction.NS),
            maxWithdrawalPct = province2MaxWithdrawalPct,
        ),
        Group(
            title = "given federal jurisdiction",
            min = 20,
            max = 89,
            jurisdictions = listOf(Jurisdiction.CA),
            maxWithdrawalPct = federalMaxWithdrawalPct,
        ),
        // The legacy spec passes the fake code 'other'; the closest common equivalent is the
        // jurisdictions handled by the default branch (NT, NU, PE, YT).
        Group(
            title = "given other jurisdiction",
            min = 20,
            max = 89,
            jurisdictions = listOf(Jurisdiction.NT, Jurisdiction.NU, Jurisdiction.PE, Jurisdiction.YT),
            maxWithdrawalPct = othersMaxWithdrawalPct,
        ),
    )

    @Test
    fun shouldReturnPercentageAtMinYearsOldWhenAgeIsLowerThanMin() {
        for (group in groups) {
            val age = group.min - 2
            val expectedResult = group.maxWithdrawalPct.getValue(group.min)

            group.jurisdictions.forEach { jurisdiction ->
                val result = getMaxWithdrawalPct(jurisdiction, age)
                assertEquals(expectedResult, result, "${group.title} / $jurisdiction")
            }
        }
    }

    @Test
    fun shouldReturnPercentageAtMaxYearsOldWhenAgeIsHigherThanMax() {
        for (group in groups) {
            val age = group.max + 2
            val expectedResult = group.maxWithdrawalPct.getValue(group.max)

            group.jurisdictions.forEach { jurisdiction ->
                val result = getMaxWithdrawalPct(jurisdiction, age)
                assertEquals(expectedResult, result, "${group.title} / $jurisdiction")
            }
        }
    }

    @Test
    fun shouldReturnPercentageAtGivenAgeWhenAgeIsBetweenMinAndMax() {
        for (group in groups) {
            val age = 65
            val expectedResult = group.maxWithdrawalPct.getValue(age)

            group.jurisdictions.forEach { jurisdiction ->
                val result = getMaxWithdrawalPct(jurisdiction, age)
                assertEquals(expectedResult, result, "${group.title} / $jurisdiction")
            }
        }
    }
}

class GetYMPEUnlockingSmallBalancePctTest {
    @Test
    fun shouldReturnExpectedThreshold() {
        val cases = listOf(
            Triple(Jurisdiction.AB, 64, 0.20),
            Triple(Jurisdiction.AB, 65, 0.40),
            Triple(Jurisdiction.AB, 40, 0.20),
            Triple(Jurisdiction.BC, 64, 0.20),
            Triple(Jurisdiction.BC, 65, 0.40),
            Triple(Jurisdiction.SK, 40, 0.20),
            Triple(Jurisdiction.SK, 65, 0.20),
            Triple(Jurisdiction.ON, 55, 0.40),
            Triple(Jurisdiction.ON, 65, 0.40),
            Triple(Jurisdiction.QC, 65, 0.40),
            Triple(Jurisdiction.MB, 65, 0.40),
            Triple(Jurisdiction.NB, 65, 0.40),
            Triple(Jurisdiction.NL, 65, 0.40),
            Triple(Jurisdiction.NS, 65, 0.50),
            Triple(Jurisdiction.NT, 55, 0.50),
            Triple(Jurisdiction.NU, 55, 0.50),
            Triple(Jurisdiction.YT, 55, 0.50),
        )
        for ((jurisdiction, age, expected) in cases) {
            assertEquals(expected, getYMPEUnlockingSmallBalancePct(jurisdiction, age), "$jurisdiction at $age")
        }
    }

    @Test
    fun shouldReturnNullWhenTheMinimumAgeIsNotMet() {
        val cases = listOf(
            Jurisdiction.ON to 54,
            Jurisdiction.QC to 64,
            Jurisdiction.MB to 64,
            Jurisdiction.NB to 64,
            Jurisdiction.NL to 64,
            Jurisdiction.NS to 64,
            Jurisdiction.NT to 54,
            Jurisdiction.NU to 54,
            Jurisdiction.YT to 54,
        )
        for ((jurisdiction, age) in cases) {
            assertNull(getYMPEUnlockingSmallBalancePct(jurisdiction, age), "$jurisdiction at $age")
        }
    }

    @Test
    fun shouldReturnNullWhenTheJurisdictionHasNoSmallBalanceUnlockingMechanism() {
        for (age in listOf(20, 55, 65, 90)) {
            assertNull(getYMPEUnlockingSmallBalancePct(Jurisdiction.PE, age), "PE at age $age")
        }
    }

    @Test
    fun shouldReturnAThresholdEvenBelow55WhenThereIsNoMinimumAge() {
        for (jurisdiction in listOf(Jurisdiction.AB, Jurisdiction.BC, Jurisdiction.SK)) {
            assertNotNull(getYMPEUnlockingSmallBalancePct(jurisdiction, 50), "$jurisdiction")
        }
    }
}
