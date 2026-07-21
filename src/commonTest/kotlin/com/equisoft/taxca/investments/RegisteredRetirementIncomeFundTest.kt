// Ported from src/investments/tests/registered-retirement-income-fund.spec.ts

package com.equisoft.taxca.investments

import kotlin.test.Test
import kotlin.test.assertEquals

class GetMinimumWithdrawalPercentageTest {
    @Test
    fun shouldReturnCorrectPercentageOnAgeLowerOrEqualTo70() {
        val age = 70
        val result = getMinimumWithdrawalPercentage(age)
        val calculation = 1.0 / (90 - age)

        assertEquals(calculation, result)
    }
}
