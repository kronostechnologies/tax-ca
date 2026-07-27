// Ported from src/investments/tests/non-registered-retirement-savings-plan.spec.ts

package com.equisoft.taxca.investments

import kotlin.test.Test
import kotlin.test.assertEquals

class GetCapitalGainsTaxableAmountTest {
    @Test
    fun shouldCalculateTaxableAmountOnCapitalGainsIncome() {
        val capitalGainsList = listOf(
            150000.0 to 75000.0,
            0.0 to 0.0,
            -50.0 to 0.0,
            250000.0 to 125000.0,
            350000.0 to 175000.0,
            249000.0 to 124500.0,
            250001.0 to 125000.5,
        )

        capitalGainsList.forEach { (capitalGains, expectedTaxableAmount) ->
            val taxableAmount = getCapitalGainsTaxableAmount(capitalGains)
            assertEquals(expectedTaxableAmount, taxableAmount, "capitalGains=$capitalGains")
        }
    }
}
