/*
Sources
    https://www.taxtips.ca/marginal-tax-rates-in-canada.htm
    Abattement QC: http://www.cra-arc.gc.ca/tx/ndvdls/tpcs/ncm-tx/rtrn/cmpltng/ddctns/lns409-485/440-fra.html
    Yukon: https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/income-tax/reducing-remuneration-subject-income-tax.html

Revised
    2025-12-22
*/
package com.equisoft.taxca.taxes

import com.equisoft.taxca.misc.Jurisdiction
import com.equisoft.taxca.utils.maxBy
import com.equisoft.taxca.utils.roundToPrecision
import kotlin.math.max
import kotlin.math.min
import kotlin.math.pow

data class Rate(
    val from: Double,
    val to: Double,
    val rate: Double,
)

// Legacy type: number | { MIN: number, MAX: number } — plain numbers use min = max = value.
data class BasicPersonalAmount(
    val min: Double,
    val max: Double,
    val isRange: Boolean,
) {
    constructor(value: Double) : this(min = value, max = value, isRange = false)
}

data class TaxBracket(
    val abatement: Double,
    val taxCreditRate: Double,
    val basicPersonalAmount: BasicPersonalAmount,
    val rates: List<Rate>,
    val surtaxRates: List<Rate>,
)

val TaxBrackets: Map<Jurisdiction, TaxBracket> = mapOf(
    Jurisdiction.CA to TaxBracket(
        abatement = 0.0,
        taxCreditRate = 0.14,
        basicPersonalAmount = BasicPersonalAmount(min = 14829.0, max = 16452.0, isRange = true),
        rates = listOf(
            Rate(0.0, 58523.0, 0.14),
            Rate(58523.0, 117045.0, 0.205),
            Rate(117045.0, 181440.0, 0.26),
            Rate(181440.0, 258482.0, 0.29),
            Rate(258482.0, 999999999.0, 0.33),
        ),
        surtaxRates = listOf(
            Rate(0.0, 999999999.0, 0.0),
        ),
    ),
    Jurisdiction.AB to TaxBracket(
        abatement = 0.0,
        taxCreditRate = 0.08,
        basicPersonalAmount = BasicPersonalAmount(22769.0),
        rates = listOf(
            Rate(0.0, 61200.0, 0.08),
            Rate(61200.0, 154259.0, 0.10),
            Rate(154259.0, 185111.0, 0.12),
            Rate(185111.0, 246813.0, 0.13),
            Rate(246813.0, 370220.0, 0.14),
            Rate(370220.0, 999999999.0, 0.15),
        ),
        surtaxRates = listOf(
            Rate(0.0, 999999999.0, 0.0),
        ),
    ),
    Jurisdiction.BC to TaxBracket(
        abatement = 0.0,
        taxCreditRate = 0.0506,
        basicPersonalAmount = BasicPersonalAmount(13216.0),
        rates = listOf(
            Rate(0.0, 50363.0, 0.0506),
            Rate(50363.0, 100728.0, 0.077),
            Rate(100728.0, 115648.0, 0.105),
            Rate(115648.0, 140430.0, 0.1229),
            Rate(140430.0, 190405.0, 0.147),
            Rate(190405.0, 265545.0, 0.168),
            Rate(265545.0, 999999999.0, 0.205),
        ),
        surtaxRates = listOf(
            Rate(0.0, 999999999.0, 0.0),
        ),
    ),
    Jurisdiction.MB to TaxBracket(
        abatement = 0.0,
        taxCreditRate = 0.108,
        basicPersonalAmount = BasicPersonalAmount(15780.0),
        rates = listOf(
            Rate(0.0, 47000.0, 0.108),
            Rate(47000.0, 100000.0, 0.1275),
            Rate(100000.0, 999999999.0, 0.174),
        ),
        surtaxRates = listOf(
            Rate(0.0, 999999999.0, 0.0),
        ),
    ),
    Jurisdiction.NB to TaxBracket(
        abatement = 0.0,
        taxCreditRate = 0.094,
        basicPersonalAmount = BasicPersonalAmount(13664.0),
        rates = listOf(
            Rate(0.0, 52333.0, 0.0940),
            Rate(52333.0, 104666.0, 0.14),
            Rate(104666.0, 193861.0, 0.16),
            Rate(193861.0, 999999999.0, 0.195),
        ),
        surtaxRates = listOf(
            Rate(0.0, 999999999.0, 0.0),
        ),
    ),
    Jurisdiction.NL to TaxBracket(
        abatement = 0.0,
        taxCreditRate = 0.087,
        basicPersonalAmount = BasicPersonalAmount(11188.0),
        rates = listOf(
            Rate(0.0, 44678.0, 0.087),
            Rate(44678.0, 89354.0, 0.145),
            Rate(89354.0, 159528.0, 0.158),
            Rate(159528.0, 223340.0, 0.178),
            Rate(223340.0, 285319.0, 0.198),
            Rate(285319.0, 570638.0, 0.208),
            Rate(570638.0, 1141275.0, 0.213),
            Rate(1141275.0, 999999999.0, 0.218),
        ),
        surtaxRates = listOf(
            Rate(0.0, 999999999.0, 0.0),
        ),
    ),
    Jurisdiction.NS to TaxBracket(
        abatement = 0.0,
        taxCreditRate = 0.0879,
        basicPersonalAmount = BasicPersonalAmount(11932.0),
        rates = listOf(
            Rate(0.0, 30995.0, 0.0879),
            Rate(30995.0, 61991.0, 0.1495),
            Rate(61991.0, 97417.0, 0.1667),
            Rate(97417.0, 157124.0, 0.175),
            Rate(157124.0, 999999999.0, 0.21),
        ),
        surtaxRates = listOf(
            Rate(0.0, 999999999.0, 0.0),
        ),
    ),
    Jurisdiction.PE to TaxBracket(
        abatement = 0.0,
        taxCreditRate = 0.095,
        basicPersonalAmount = BasicPersonalAmount(15000.0),
        rates = listOf(
            Rate(0.0, 33928.0, 0.095),
            Rate(33928.0, 65820.0, 0.1347),
            Rate(65820.0, 106890.0, 0.166),
            Rate(106890.0, 142250.0, 0.1762),
            Rate(142250.0, 999999999.0, 0.19),
        ),
        surtaxRates = listOf(
            Rate(0.0, 999999999.0, 0.0),
        ),
    ),
    Jurisdiction.ON to TaxBracket(
        abatement = 0.0,
        taxCreditRate = 0.0505,
        basicPersonalAmount = BasicPersonalAmount(12989.0),
        rates = listOf(
            Rate(0.0, 53891.0, 0.0505),
            Rate(53891.0, 107785.0, 0.0915),
            Rate(107785.0, 150000.0, 0.1116),
            Rate(150000.0, 220000.0, 0.1216),
            Rate(220000.0, 999999999.0, 0.1316),
        ),
        surtaxRates = listOf(
            Rate(0.0, 5818.0, 0.0),
            Rate(5818.0, 7446.0, 0.20),
            Rate(7446.0, 999999999.0, 0.56), // 0.20 + 0.36
        ),
    ),
    Jurisdiction.QC to TaxBracket(
        abatement = 0.165,
        taxCreditRate = 0.14,
        basicPersonalAmount = BasicPersonalAmount(18952.0),
        rates = listOf(
            Rate(0.0, 54345.0, 0.14),
            Rate(54345.0, 108680.0, 0.19),
            Rate(108680.0, 132245.0, 0.24),
            Rate(132245.0, 999999999.0, 0.2575),
        ),
        surtaxRates = listOf(
            Rate(0.0, 999999999.0, 0.0),
        ),
    ),
    Jurisdiction.SK to TaxBracket(
        abatement = 0.0,
        taxCreditRate = 0.105,
        basicPersonalAmount = BasicPersonalAmount(20381.0),
        rates = listOf(
            Rate(0.0, 54532.0, 0.105),
            Rate(54532.0, 155805.0, 0.125),
            Rate(155805.0, 999999999.0, 0.145),
        ),
        surtaxRates = listOf(
            Rate(0.0, 999999999.0, 0.0),
        ),
    ),
    Jurisdiction.NT to TaxBracket(
        abatement = 0.0,
        taxCreditRate = 0.059,
        basicPersonalAmount = BasicPersonalAmount(18198.0),
        rates = listOf(
            Rate(0.0, 53003.0, 0.059),
            Rate(53003.0, 106009.0, 0.086),
            Rate(106009.0, 172346.0, 0.122),
            Rate(172346.0, 999999999.0, 0.1405),
        ),
        surtaxRates = listOf(
            Rate(0.0, 999999999.0, 0.0),
        ),
    ),
    Jurisdiction.NU to TaxBracket(
        abatement = 0.0,
        taxCreditRate = 0.04,
        basicPersonalAmount = BasicPersonalAmount(19659.0),
        rates = listOf(
            Rate(0.0, 55801.0, 0.04),
            Rate(55801.0, 111602.0, 0.07),
            Rate(111602.0, 181439.0, 0.09),
            Rate(181439.0, 999999999.0, 0.115),
        ),
        surtaxRates = listOf(
            Rate(0.0, 999999999.0, 0.0),
        ),
    ),
    Jurisdiction.YT to TaxBracket(
        abatement = 0.0,
        taxCreditRate = 0.14,
        basicPersonalAmount = BasicPersonalAmount(16452.0),
        rates = listOf(
            Rate(0.0, 58523.0, 0.064),
            Rate(58523.0, 117045.0, 0.09),
            Rate(117045.0, 181440.0, 0.109),
            Rate(181440.0, 500000.0, 0.128),
            Rate(500000.0, 999999999.0, 0.15),
        ),
        surtaxRates = listOf(
            Rate(0.0, 999999999.0, 0.0),
        ),
    ),
)

private fun inflate(amount: Double, inflationRate: Double, yearsToInflate: Double): Double =
    amount * (1 + inflationRate).pow(yearsToInflate)

fun getTaxAmount(rates: List<Rate>, income: Double, inflationRate: Double, yearsToInflate: Double): Double =
    rates.fold(0.0) { previous, current ->
        val bracketFrom = inflate(current.from, inflationRate, yearsToInflate)
        val bracketTo = inflate(current.to, inflationRate, yearsToInflate)
        val bracketTax = if (bracketFrom < income) (min(income, bracketTo) - bracketFrom) * current.rate else 0.0
        previous + bracketTax
    }

fun getRate(brackets: List<Rate>, grossIncome: Double, inflationRate: Double, yearsToInflate: Double): Double =
    brackets.fold(0.0) { previous, current ->
        val bracketFrom = inflate(current.from, inflationRate, yearsToInflate)
        if (bracketFrom < grossIncome) current.rate else previous
    }

// The legacy code returns a structuredClone; Rate lists are immutable here, so no copy is needed.
fun getTaxRates(code: Jurisdiction): List<Rate> = TaxBrackets.getValue(code).rates

private fun getAbatement(code: Jurisdiction): Double = TaxBrackets.getValue(code).abatement

private fun getSurtaxRates(code: Jurisdiction): List<Rate> = TaxBrackets.getValue(code).surtaxRates

fun getFederalTaxRates(): List<Rate> = getTaxRates(Jurisdiction.CA)

fun getFederalBaseTaxAmount(grossIncome: Double, inflationRate: Double = 0.0, yearsToInflate: Double = 0.0): Double =
    getTaxAmount(getFederalTaxRates(), grossIncome, inflationRate, yearsToInflate)

fun getFederalTaxCreditRate(): Double = TaxBrackets.getValue(Jurisdiction.CA).taxCreditRate

fun getFederalBasicPersonalAmount(
    grossIncome: Double,
    inflationRate: Double,
    yearsToInflate: Double,
): Double {
    val bpaConfig = TaxBrackets.getValue(Jurisdiction.CA).basicPersonalAmount
    val maxBPA = bpaConfig.max
    val minBPA = bpaConfig.min
    val bonus = maxBPA - minBPA
    val rates = TaxBrackets.getValue(Jurisdiction.CA).rates
    val lowerThreshold = inflate(rates[rates.size - 2].from, inflationRate, yearsToInflate)
    val upperThreshold = inflate(rates[rates.size - 2].to, inflationRate, yearsToInflate)

    if (grossIncome <= lowerThreshold) {
        return maxBPA
    }
    if (grossIncome >= upperThreshold) {
        return minBPA
    }
    val reduction = bonus * (grossIncome - lowerThreshold) / (upperThreshold - lowerThreshold)
    return maxBPA - reduction
}

fun getFederalBaseCredit(grossIncome: Double, inflationRate: Double, yearsToInflate: Double): Double {
    val bpa = getFederalBasicPersonalAmount(grossIncome, inflationRate, yearsToInflate)
    val baseTaxCredit = bpa * getFederalTaxCreditRate()
    return inflate(baseTaxCredit, inflationRate, yearsToInflate)
}

fun getProvincialAbatement(province: Jurisdiction, federalTaxAmount: Double): Double =
    getAbatement(province) * federalTaxAmount

fun getFederalTaxAmount(
    provincialCode: Jurisdiction,
    grossIncome: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
    taxCredit: Double = 0.0,
): Double {
    val federalBaseTaxAmount = getFederalBaseTaxAmount(grossIncome, inflationRate, yearsToInflate)
    val baseCredit = getFederalBaseCredit(grossIncome, inflationRate, yearsToInflate)
    val federalTax = max(federalBaseTaxAmount - baseCredit - taxCredit, 0.0)
    val abatement = getProvincialAbatement(provincialCode, federalTax)
    return max(federalTax - abatement, 0.0)
}

fun getProvincialSurtaxAmount(
    province: Jurisdiction,
    baseTaxAmount: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double = getTaxAmount(getSurtaxRates(province), baseTaxAmount, inflationRate, yearsToInflate)

fun getProvincialBaseTaxAmount(
    province: Jurisdiction,
    grossIncome: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double = getTaxAmount(getTaxRates(province), grossIncome, inflationRate, yearsToInflate)

fun getProvincialBaseCredit(province: Jurisdiction, inflationRate: Double, yearsToInflate: Double): Double {
    val bpaConfig = TaxBrackets.getValue(province).basicPersonalAmount
    // Legacy: typeof number ? value : MAX — non-range amounts store the value in both min and max.
    val bpa = bpaConfig.max
    val baseTaxCredit = bpa * TaxBrackets.getValue(province).rates[0].rate
    return inflate(baseTaxCredit, inflationRate, yearsToInflate)
}

fun getProvincialTaxAmount(
    province: Jurisdiction,
    grossIncome: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
    taxCredit: Double = 0.0,
): Double {
    val baseTaxAmount = getProvincialBaseTaxAmount(province, grossIncome, inflationRate, yearsToInflate)
    val baseCredit = getProvincialBaseCredit(province, inflationRate, yearsToInflate)
    val tax = max(baseTaxAmount - baseCredit, 0.0)
    val surTax = getProvincialSurtaxAmount(province, tax, inflationRate, yearsToInflate)
    return max(tax + surTax - taxCredit, 0.0)
}

fun getFederalMarginalRate(
    provincialCode: Jurisdiction,
    grossIncome: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double {
    val brackets = getTaxRates(Jurisdiction.CA)
    val rate = getRate(brackets, grossIncome, inflationRate, yearsToInflate)
    return rate * (1 - getAbatement(provincialCode))
}

fun getProvincialMarginalRate(
    provincialCode: Jurisdiction,
    grossIncome: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double {
    val taxAmount = getProvincialTaxAmount(provincialCode, grossIncome, inflationRate, yearsToInflate)
    val taxCredit = getProvincialBaseCredit(provincialCode, inflationRate, yearsToInflate)
    val provincialTaxAmount = max(taxAmount - taxCredit, 0.0)

    val taxBrackets = getTaxRates(provincialCode)
    val surtaxBrackets = getSurtaxRates(provincialCode)

    val taxRate = getRate(taxBrackets, grossIncome, inflationRate, yearsToInflate)
    val surtaxRate = getRate(surtaxBrackets, provincialTaxAmount, inflationRate, yearsToInflate)

    return taxRate + (taxRate * surtaxRate)
}

fun getTotalMarginalRate(
    provincialCode: Jurisdiction,
    grossIncome: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double {
    val provRate = getProvincialMarginalRate(provincialCode, grossIncome, inflationRate, yearsToInflate)
    val fedRate = getFederalMarginalRate(provincialCode, grossIncome, inflationRate, yearsToInflate)

    return roundToPrecision(provRate + fedRate, 4)
}

fun getMaxProvincialMarginalRate(provincialCode: Jurisdiction): Double {
    val marginalRate = maxBy(getTaxRates(provincialCode)) { bracket: Rate -> bracket.to }!!.rate
    val surtaxRate = maxBy(getSurtaxRates(provincialCode)) { bracket -> bracket.to }!!.rate

    return marginalRate + (marginalRate * surtaxRate)
}

fun getMaxFederalMarginalRate(provincialCode: Jurisdiction): Double {
    val maxRate = maxBy(getTaxRates(Jurisdiction.CA)) { bracket -> bracket.to }!!.rate

    return maxRate * (1 - getAbatement(provincialCode))
}

fun getTotalMaxMarginalRate(provincialCode: Jurisdiction): Double {
    val provRate = getMaxProvincialMarginalRate(provincialCode)
    val fedRate = getMaxFederalMarginalRate(provincialCode)

    return roundToPrecision(provRate + fedRate, 4)
}

fun getTotalTaxAmount(
    provincialCode: Jurisdiction,
    grossIncome: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double {
    val provTax = getProvincialTaxAmount(provincialCode, grossIncome, inflationRate, yearsToInflate)
    val fedTax = getFederalTaxAmount(provincialCode, grossIncome, inflationRate, yearsToInflate)
    return max(provTax, 0.0) + max(fedTax, 0.0)
}

fun getEffectiveRate(
    province: Jurisdiction,
    income: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double {
    if (income <= 0) {
        return 0.0
    }
    return getTotalTaxAmount(province, income, inflationRate, yearsToInflate) / income
}
