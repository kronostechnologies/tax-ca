package com.equisoft.taxca.utils

import kotlin.test.Test
import kotlin.test.assertSame

private data class Item(val a: Double, val b: Double)

class MaxByTest {
    @Test
    fun shouldReturnMaximumValueByMappingFunction() {
        val maxB = Item(a = 1.0, b = 5.0)
        val maxA = Item(a = 5.0, b = 2.0)
        val values = listOf(maxA, maxB)

        assertSame(maxB, maxBy(values) { it.b })
    }

    @Test
    fun shouldReturnFirstValueIfMultipleMaximums() {
        val maxA = Item(a = 5.0, b = 2.0)
        val maxB = Item(a = 1.0, b = 5.0)
        val maxA2 = maxA.copy()
        val values = listOf(maxA, maxB, maxA2)

        assertSame(maxA, maxBy(values) { it.a })
    }
}
