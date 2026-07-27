/*
 Sources
 https://www.canada.ca/en/services/benefits/education/education-savings/estimating-amounts.html#_clb_income

 Last updated
 2025-12-21
 */

package com.equisoft.taxca.investments.resp

enum class IncomeLevelType {
    LOW,
    MEDIUM,
    HIGH,
}

// The TS source merges an interface and a const named `IncomeLevel`; Kotlin forbids a
// top-level class and val sharing a name, so the class carries a `Resp` prefix.
data class RespIncomeLevel(
    val lowIncomeThreshold: Double,
    val mediumIncomeThreshold: Double,
) {
    fun getIncomeLevel(income: Double): IncomeLevelType {
        if (income <= lowIncomeThreshold) {
            return IncomeLevelType.LOW
        }

        if (income <= mediumIncomeThreshold) {
            return IncomeLevelType.MEDIUM
        }

        return IncomeLevelType.HIGH
    }
}

val IncomeLevel: RespIncomeLevel = RespIncomeLevel(
    lowIncomeThreshold = 57375.0,
    mediumIncomeThreshold = 114750.0,
)
