/*
Sources
    https://www.finance-investissement.com/zone-experts_/martin-dupras/la-valeur-reelle-de-reporter-la-rente-du-rrq-mise-a-jour-2024/
    https://www.finance-investissement.com/zone-experts_/martin-dupras/la-valeur-reelle-de-reporter-la-rente-du-rrq/

Note
    Used to be the cumulative difference in %, according to the table calculated by Martin Dupras,
    from the reference age of 65, after 40 years of contributions, divided by 12 months.
    The formula consuming these values is only utilized by kronos-fna.

    Since Jan. 2024, years over the age of 65 do not reduce the increase factor of 8.4%/yr (0.7%/mth)
    Reference: https://www.finance-investissement.com/zone-experts_/apff/rrq-changements-en-vigueur-au-1er-janvier-2024/

Revised
    2025-12-22
 */

package com.equisoft.taxca.misc

data class PPPIncreaseFactor(
    val firstYear: Double,
    val secondYear: Double,
    val thirdYear: Double,
    val fourthYear: Double,
    val fifthYear: Double,
    val sixthYear: Double,
    val seventhYear: Double,
)

val PppIncreaseFactor: PPPIncreaseFactor = PPPIncreaseFactor(
    firstYear = 0.84,
    secondYear = 0.84,
    thirdYear = 0.84,
    fourthYear = 0.84,
    fifthYear = 0.84,
    sixthYear = 0.84,
    seventhYear = 0.84,
)
