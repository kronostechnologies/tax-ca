/*
Sources
    Non-eligible Dividends: https://www.taxtips.ca/dtc/non-eligible-dividend-tax-credit.htm
    Eligible Dividends: https://www.taxtips.ca/dtc/eligible-dividends/eligible-dividend-tax-credit-rates.htm

Revised
    2025-12-22
*/
package com.equisoft.taxca.taxes

import com.equisoft.taxca.misc.Jurisdiction

data class DividendTaxCreditRate(
    val grossUp: Double,
    val rates: Map<Jurisdiction, Double>,
)

val NonEligibleDividend: DividendTaxCreditRate = DividendTaxCreditRate(
    grossUp = 1.15,
    rates = mapOf(
        Jurisdiction.CA to 0.090301,
        Jurisdiction.AB to 0.0218,
        Jurisdiction.BC to 0.0196,
        Jurisdiction.MB to 0.007835,
        Jurisdiction.NB to 0.0275,
        Jurisdiction.NL to 0.032,
        Jurisdiction.NS to 0.015,
        Jurisdiction.NT to 0.06,
        Jurisdiction.NU to 0.0261,
        Jurisdiction.ON to 0.029863,
        Jurisdiction.PE to 0.013,
        Jurisdiction.QC to 0.0342,
        Jurisdiction.SK to 0.02519,
        Jurisdiction.YT to 0.0067,
    ),
)

val EligibleDividend: DividendTaxCreditRate = DividendTaxCreditRate(
    grossUp = 1.38,
    rates = mapOf(
        Jurisdiction.CA to 0.150198,
        Jurisdiction.AB to 0.0812,
        Jurisdiction.BC to 0.12,
        Jurisdiction.MB to 0.08,
        Jurisdiction.NB to 0.14,
        Jurisdiction.NL to 0.063,
        Jurisdiction.NS to 0.0885,
        Jurisdiction.NT to 0.115,
        Jurisdiction.NU to 0.0551,
        Jurisdiction.ON to 0.1,
        Jurisdiction.PE to 0.105,
        Jurisdiction.QC to 0.117,
        Jurisdiction.SK to 0.11,
        Jurisdiction.YT to 0.1202,
    ),
)
