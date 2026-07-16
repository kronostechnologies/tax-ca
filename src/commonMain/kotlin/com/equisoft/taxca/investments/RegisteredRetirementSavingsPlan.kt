/*
Sources
    https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html

Note
    Must use RRSP dollar limit and not DB limit

Revised
    2025-12-22
*/

package com.equisoft.taxca.investments

data class ConversionAge(
    val min: Int,
    val max: Int,
)

data class RegisteredRetirementSavingsPlan(
    val conversionAge: ConversionAge,
    val maxContribution: Double,
)

val Rrsp: RegisteredRetirementSavingsPlan = RegisteredRetirementSavingsPlan(
    conversionAge = ConversionAge(
        min = 0,
        max = 71,
    ),
    maxContribution = 33810.0,
)
