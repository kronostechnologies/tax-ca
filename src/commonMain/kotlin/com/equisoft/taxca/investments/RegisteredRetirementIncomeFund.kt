/*
Sources
    https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/completing-slips-summaries/t4rsp-t4rif-information-returns/payments/chart-prescribed-factors.html

Conversion
    None

Revised
    2025-12-22
*/

package com.equisoft.taxca.investments

import com.equisoft.taxca.utils.roundToPrecision

data class RegisteredRetirementIncomeFund(
    val minWithdrawalPct: Map<Int, Double>,
)

val Rrif: RegisteredRetirementIncomeFund = RegisteredRetirementIncomeFund(
    minWithdrawalPct = mapOf(
        50 to 0.0250,
        51 to 0.0256,
        52 to 0.0263,
        53 to 0.0270,
        54 to 0.0278,
        55 to 0.0286,
        56 to 0.0294,
        57 to 0.0303,
        58 to 0.0313,
        59 to 0.0323,
        60 to 0.0333,
        61 to 0.0345,
        62 to 0.0357,
        63 to 0.0370,
        64 to 0.0385,
        65 to 0.0400,
        66 to 0.0417,
        67 to 0.0435,
        68 to 0.0455,
        69 to 0.0476,
        70 to 0.0500,
        71 to 0.0528,
        72 to 0.0540,
        73 to 0.0553,
        74 to 0.0567,
        75 to 0.0582,
        76 to 0.0598,
        77 to 0.0617,
        78 to 0.0636,
        79 to 0.0658,
        80 to 0.0682,
        81 to 0.0708,
        82 to 0.0738,
        83 to 0.0771,
        84 to 0.0808,
        85 to 0.0851,
        86 to 0.0899,
        87 to 0.0955,
        88 to 0.1021,
        89 to 0.1099,
        90 to 0.1192,
        91 to 0.1306,
        92 to 0.1449,
        93 to 0.1634,
        94 to 0.1879,
        95 to 0.20,
    ),
)

fun getMinimumWithdrawalPercentage(beginningOfYearAge: Int): Double {
    val pct = if (beginningOfYearAge >= 71) {
        Rrif.minWithdrawalPct.getValue(beginningOfYearAge)
    } else {
        1.0 / (90 - beginningOfYearAge)
    }
    // Legacy: parseFloat(pct.toFixed(4)). roundToPrecision (floor(x * 1e4 + 0.5) / 1e4) is
    // bit-for-bit identical for every reachable input (verified for ages 0..95).
    return roundToPrecision(pct, 4)
}
