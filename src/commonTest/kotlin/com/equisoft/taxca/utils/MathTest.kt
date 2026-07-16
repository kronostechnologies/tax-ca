package com.equisoft.taxca.utils

import kotlin.test.Test
import kotlin.test.assertEquals

class RoundToPrecisionTest {
    @Test
    fun shouldRoundToIntegerByDefault() {
        assertEquals(2.0, roundToPrecision(1.5678))
    }

    @Test
    fun shouldRoundWithGivenPrecision() {
        val cases = listOf(
            Triple(1.56789, 1, 1.6),
            Triple(1.56789, 2, 1.57),
            Triple(1.56789, 3, 1.568),
        )
        for ((value, precision, expected) in cases) {
            assertEquals(expected, roundToPrecision(value, precision))
        }
    }

    @Test
    fun shouldReturnZeroForNaN() {
        assertEquals(0.0, roundToPrecision(Double.NaN))
    }
}

class ClampTest {
    @Test
    fun shouldClampBetweenMinAndMax() {
        val cases = listOf(
            listOf(50.0, 10.0, 30.0, 30.0),
            listOf(5.0, 10.0, 30.0, 10.0),
            listOf(20.0, 10.0, 30.0, 20.0),
            listOf(10.0, 10.0, 30.0, 10.0),
            listOf(30.0, 10.0, 30.0, 30.0),
        )
        for ((value, min, max, expected) in cases) {
            assertEquals(expected, clamp(value, min, max))
        }
    }
}
