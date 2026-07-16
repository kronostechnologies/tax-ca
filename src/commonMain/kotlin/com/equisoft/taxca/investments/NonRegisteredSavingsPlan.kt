/*
Sources
   TBD

Revised
    2025-12-21
*/

package com.equisoft.taxca.investments

import com.equisoft.taxca.taxes.Rate
import kotlin.math.min

val CapitalGainsBrackets: List<Rate> = listOf(
    Rate(
        from = 0.0,
        to = Double.POSITIVE_INFINITY,
        rate = 0.5,
    ),
)

fun getCapitalGainsTaxableAmount(totalCapitalGains: Double): Double =
    CapitalGainsBrackets.fold(0.0) { taxableAmount, currentBracket ->
        val currentBracketRate = currentBracket.rate

        val bracketTaxableAmount = min(totalCapitalGains, currentBracket.to)

        if (bracketTaxableAmount <= currentBracket.from) {
            taxableAmount
        } else {
            taxableAmount + ((bracketTaxableAmount - currentBracket.from) * currentBracketRate)
        }
    }
