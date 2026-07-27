// Ported from src/investments/tests/locked-in-retirement-account.spec.ts

package com.equisoft.taxca.investments

import com.equisoft.taxca.misc.Jurisdiction
import kotlin.test.Test
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class GetUnlockingPctTest {
    @Test
    fun shouldReturnValueBetweenZeroAndOneOrNull() {
        jurisdictions.forEach { jurisdiction ->
            val result = getUnlockingPct(jurisdiction)
            assertTrue(result == null || (result >= 0 && result <= 1), "$jurisdiction")
        }
    }
}

class CanUnlockTest {
    @Test
    fun shouldReturnTrueForJurisdictionsWithUnlockingPercentageGreaterThanZero() {
        assertTrue(canUnlock(Jurisdiction.CA))
    }

    @Test
    fun shouldReturnFalseForJurisdictionsWithNullUnlockingRules() {
        assertFalse(canUnlock(Jurisdiction.PE))
    }

    @Test
    fun shouldReturnFalseWhenUnlockingPctIsZero() {
        assertFalse(canUnlock(Jurisdiction.BC))
    }
}

class CanConvertTest {
    @Test
    fun shouldReturnTrueWhenAgeIsWithinValidConversionRange() {
        assertTrue(canConvert(Jurisdiction.CA, 70))
    }

    @Test
    fun shouldReturnFalseWhenAgeIsBelowMinimumConversionAge() {
        assertFalse(canConvert(Jurisdiction.CA, 54))
    }

    @Test
    fun shouldReturnFalseWhenAgeIsAboveMaximumConversionAge() {
        assertFalse(canConvert(Jurisdiction.CA, 72))
    }

    @Test
    fun shouldReturnTrueAtBoundaryAges() {
        assertTrue(canConvert(Jurisdiction.CA, 55))
        assertTrue(canConvert(Jurisdiction.CA, 71))
    }

    @Test
    fun shouldReturnFalseForJurisdictionsWithNullConversionRules() {
        assertFalse(canConvert(Jurisdiction.PE, 65))
    }
}
