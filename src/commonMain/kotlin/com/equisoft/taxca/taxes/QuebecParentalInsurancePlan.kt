/*
Sources
    https://www.rqap.gouv.qc.ca/fr/a-propos-du-regime/information-generale/cotisations-et-revenu-maximal-assurable

Revised
    2025-12-22
*/
package com.equisoft.taxca.taxes

data class PremiumRates(
    val selfEmployed: Double,
    val salaried: Double,
)

data class QuebecParentalInsurancePlan(
    val maxInsurableEarnings: Double,
    val premiumRates: PremiumRates,
)

val Qpip: QuebecParentalInsurancePlan = QuebecParentalInsurancePlan(
    maxInsurableEarnings = 103000.0,
    premiumRates = PremiumRates(
        selfEmployed = 0.00764,
        salaried = 0.0043,
    ),
)
