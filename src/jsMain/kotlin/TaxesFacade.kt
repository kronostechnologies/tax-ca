// JS compatibility facade for src/taxes (see api-baseline.md).
//
// Exported data consts are plain JS objects (own, writable properties) so consumers can
// spread and mutate them like the legacy package. The income-tax functions re-read the
// exported TAX_BRACKETS object on every call — mirroring legacy income-tax.ts, where a
// consumer mutation of TAX_BRACKETS.QC.RATES is reflected in subsequent computations.

@file:OptIn(ExperimentalJsExport::class)
@file:Suppress("ClassName", "PropertyName", "NON_EXPORTABLE_TYPE", "TooManyFunctions")

import com.equisoft.taxca.interop.basicPersonalAmountToJs
import com.equisoft.taxca.misc.Jurisdiction
import com.equisoft.taxca.taxes.DividendTaxCreditRate as CommonDividendTaxCreditRate
import com.equisoft.taxca.taxes.EligibleDividend
import com.equisoft.taxca.taxes.Ei
import com.equisoft.taxca.taxes.NonEligibleDividend
import com.equisoft.taxca.taxes.Qpip
import com.equisoft.taxca.taxes.Rate as CommonRate
import com.equisoft.taxca.taxes.TaxBracket as CommonTaxBracket
import com.equisoft.taxca.taxes.TaxBrackets as CommonTaxBrackets
import com.equisoft.taxca.taxes.getRate as commonGetRate
import com.equisoft.taxca.taxes.getTaxAmount as commonGetTaxAmount
import com.equisoft.taxca.utils.maxBy as commonMaxBy
import com.equisoft.taxca.utils.roundToPrecision as commonRoundToPrecision
import kotlin.math.max
import kotlin.math.pow

// ----- income-tax -----

// Input shape: consumers pass plain JS objects, so property access must not be mangled.
// Also used to read the plain rate objects stored in the exported TAX_BRACKETS.
external interface RateInput {
    val FROM: Double
    val TO: Double
    val RATE: Double
}

private fun rateToJs(rate: CommonRate): dynamic {
    val obj = js("{}")
    obj.FROM = rate.from
    obj.TO = rate.to
    obj.RATE = rate.rate
    return obj
}

private fun ratesToJs(rates: List<CommonRate>): dynamic {
    val arr = js("[]")
    for (rate in rates) {
        arr.push(rateToJs(rate))
    }
    return arr
}

private fun toCommonRates(rates: Array<RateInput>): List<CommonRate> =
    rates.map { CommonRate(from = it.FROM, to = it.TO, rate = it.RATE) }

private fun taxBracketToJs(bracket: CommonTaxBracket): dynamic {
    val obj = js("{}")
    obj.ABATEMENT = bracket.abatement
    obj.TAX_CREDIT_RATE = bracket.taxCreditRate
    obj.BASIC_PERSONAL_AMOUNT = basicPersonalAmountToJs(
        bracket.basicPersonalAmount.min,
        bracket.basicPersonalAmount.max,
        bracket.basicPersonalAmount.isRange,
    )
    obj.RATES = ratesToJs(bracket.rates)
    obj.SURTAX_RATES = ratesToJs(bracket.surtaxRates)
    return obj
}

private fun buildTaxBrackets(): dynamic {
    val obj = js("{}")
    // Legacy key order (income-tax.ts).
    obj.CA = taxBracketToJs(CommonTaxBrackets.getValue(Jurisdiction.CA))
    obj.AB = taxBracketToJs(CommonTaxBrackets.getValue(Jurisdiction.AB))
    obj.BC = taxBracketToJs(CommonTaxBrackets.getValue(Jurisdiction.BC))
    obj.MB = taxBracketToJs(CommonTaxBrackets.getValue(Jurisdiction.MB))
    obj.NB = taxBracketToJs(CommonTaxBrackets.getValue(Jurisdiction.NB))
    obj.NL = taxBracketToJs(CommonTaxBrackets.getValue(Jurisdiction.NL))
    obj.NS = taxBracketToJs(CommonTaxBrackets.getValue(Jurisdiction.NS))
    obj.PE = taxBracketToJs(CommonTaxBrackets.getValue(Jurisdiction.PE))
    obj.ON = taxBracketToJs(CommonTaxBrackets.getValue(Jurisdiction.ON))
    obj.QC = taxBracketToJs(CommonTaxBrackets.getValue(Jurisdiction.QC))
    obj.SK = taxBracketToJs(CommonTaxBrackets.getValue(Jurisdiction.SK))
    obj.NT = taxBracketToJs(CommonTaxBrackets.getValue(Jurisdiction.NT))
    obj.NU = taxBracketToJs(CommonTaxBrackets.getValue(Jurisdiction.NU))
    obj.YT = taxBracketToJs(CommonTaxBrackets.getValue(Jurisdiction.YT))
    return obj
}

@JsExport
val TAX_BRACKETS: dynamic = buildTaxBrackets()

// --- Current-state readers: every income-tax function below reads the exported
// --- TAX_BRACKETS object at call time (like legacy `TAX_BRACKETS[code]` reads),
// --- so consumer mutations of TAX_BRACKETS affect the computations.

private fun currentBracket(code: String): dynamic = TAX_BRACKETS[code]

private fun currentTaxRates(code: String): List<CommonRate> =
    toCommonRates(currentBracket(code).RATES.unsafeCast<Array<RateInput>>())

private fun currentSurtaxRates(code: String): List<CommonRate> =
    toCommonRates(currentBracket(code).SURTAX_RATES.unsafeCast<Array<RateInput>>())

private fun currentAbatement(code: String): Double =
    currentBracket(code).ABATEMENT.unsafeCast<Double>()

// Legacy union number | { MIN, MAX }: `typeof bpaConfig === 'number' ? bpaConfig : bpaConfig.MAX`.
private fun currentBpaMax(code: String): Double {
    val bpaConfig = currentBracket(code).BASIC_PERSONAL_AMOUNT
    return if (jsTypeOf(bpaConfig) == "number") {
        bpaConfig.unsafeCast<Double>()
    } else {
        bpaConfig.MAX.unsafeCast<Double>()
    }
}

private fun currentBpaMin(code: String): Double {
    val bpaConfig = currentBracket(code).BASIC_PERSONAL_AMOUNT
    return if (jsTypeOf(bpaConfig) == "number") {
        bpaConfig.unsafeCast<Double>()
    } else {
        bpaConfig.MIN.unsafeCast<Double>()
    }
}

private fun inflate(amount: Double, inflationRate: Double, yearsToInflate: Double): Double =
    amount * (1 + inflationRate).pow(yearsToInflate)

@JsExport
fun getTaxAmount(rates: Array<RateInput>, income: Double, inflationRate: Double, yearsToInflate: Double): Double =
    commonGetTaxAmount(toCommonRates(rates), income, inflationRate, yearsToInflate)

@JsExport
fun getRate(brackets: Array<RateInput>, grossIncome: Double, inflationRate: Double, yearsToInflate: Double): Double =
    commonGetRate(toCommonRates(brackets), grossIncome, inflationRate, yearsToInflate)

// Legacy returned structuredClone(TAX_BRACKETS[code].RATES): fresh plain objects per call.
@JsExport
fun getTaxRates(code: String): dynamic = ratesToJs(currentTaxRates(code))

@JsExport
fun getFederalTaxRates(): dynamic = getTaxRates("CA")

@JsExport
fun getFederalBaseTaxAmount(grossIncome: Double, inflationRate: Double = 0.0, yearsToInflate: Double = 0.0): Double =
    commonGetTaxAmount(currentTaxRates("CA"), grossIncome, inflationRate, yearsToInflate)

@JsExport
fun getFederalTaxCreditRate(): Double = currentBracket("CA").TAX_CREDIT_RATE.unsafeCast<Double>()

@JsExport
fun getFederalBasicPersonalAmount(
    grossIncome: Double,
    inflationRate: Double,
    yearsToInflate: Double,
): Double {
    val maxBPA = currentBpaMax("CA")
    val minBPA = currentBpaMin("CA")
    val bonus = maxBPA - minBPA
    val rates = currentTaxRates("CA")
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

@JsExport
fun getFederalBaseCredit(grossIncome: Double, inflationRate: Double, yearsToInflate: Double): Double {
    val bpa = getFederalBasicPersonalAmount(grossIncome, inflationRate, yearsToInflate)
    val baseTaxCredit = bpa * getFederalTaxCreditRate()
    return inflate(baseTaxCredit, inflationRate, yearsToInflate)
}

@JsExport
fun getProvincialAbatement(province: String, federalTaxAmount: Double): Double =
    currentAbatement(province) * federalTaxAmount

@JsExport
fun getFederalTaxAmount(
    provincialCode: String,
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

@JsExport
fun getProvincialSurtaxAmount(
    province: String,
    baseTaxAmount: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double = commonGetTaxAmount(currentSurtaxRates(province), baseTaxAmount, inflationRate, yearsToInflate)

@JsExport
fun getProvincialBaseTaxAmount(
    province: String,
    grossIncome: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double = commonGetTaxAmount(currentTaxRates(province), grossIncome, inflationRate, yearsToInflate)

@JsExport
fun getProvincialBaseCredit(province: String, inflationRate: Double, yearsToInflate: Double): Double {
    // Legacy: typeof number ? value : MAX.
    val bpa = currentBpaMax(province)
    val baseTaxCredit = bpa * currentTaxRates(province)[0].rate
    return inflate(baseTaxCredit, inflationRate, yearsToInflate)
}

@JsExport
fun getProvincialTaxAmount(
    province: String,
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

@JsExport
fun getFederalMarginalRate(
    provincialCode: String,
    grossIncome: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double {
    val rate = commonGetRate(currentTaxRates("CA"), grossIncome, inflationRate, yearsToInflate)
    return rate * (1 - currentAbatement(provincialCode))
}

@JsExport
fun getProvincialMarginalRate(
    provincialCode: String,
    grossIncome: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double {
    val taxAmount = getProvincialTaxAmount(provincialCode, grossIncome, inflationRate, yearsToInflate)
    val taxCredit = getProvincialBaseCredit(provincialCode, inflationRate, yearsToInflate)
    val provincialTaxAmount = max(taxAmount - taxCredit, 0.0)

    val taxRate = commonGetRate(currentTaxRates(provincialCode), grossIncome, inflationRate, yearsToInflate)
    val surtaxRate = commonGetRate(
        currentSurtaxRates(provincialCode),
        provincialTaxAmount,
        inflationRate,
        yearsToInflate,
    )

    return taxRate + (taxRate * surtaxRate)
}

@JsExport
fun getTotalMarginalRate(
    provincialCode: String,
    grossIncome: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double {
    val provRate = getProvincialMarginalRate(provincialCode, grossIncome, inflationRate, yearsToInflate)
    val fedRate = getFederalMarginalRate(provincialCode, grossIncome, inflationRate, yearsToInflate)
    return commonRoundToPrecision(provRate + fedRate, 4)
}

@JsExport
fun getMaxProvincialMarginalRate(provincialCode: String): Double {
    val marginalRate = commonMaxBy(currentTaxRates(provincialCode)) { bracket -> bracket.to }!!.rate
    val surtaxRate = commonMaxBy(currentSurtaxRates(provincialCode)) { bracket -> bracket.to }!!.rate
    return marginalRate + (marginalRate * surtaxRate)
}

@JsExport
fun getMaxFederalMarginalRate(provincialCode: String): Double {
    val maxRate = commonMaxBy(currentTaxRates("CA")) { bracket -> bracket.to }!!.rate
    return maxRate * (1 - currentAbatement(provincialCode))
}

@JsExport
fun getTotalMaxMarginalRate(provincialCode: String): Double {
    val provRate = getMaxProvincialMarginalRate(provincialCode)
    val fedRate = getMaxFederalMarginalRate(provincialCode)
    return commonRoundToPrecision(provRate + fedRate, 4)
}

@JsExport
fun getTotalTaxAmount(
    provincialCode: String,
    grossIncome: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double {
    val provTax = getProvincialTaxAmount(provincialCode, grossIncome, inflationRate, yearsToInflate)
    val fedTax = getFederalTaxAmount(provincialCode, grossIncome, inflationRate, yearsToInflate)
    return max(provTax, 0.0) + max(fedTax, 0.0)
}

@JsExport
fun getEffectiveRate(
    province: String,
    income: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double {
    if (income <= 0) {
        return 0.0
    }
    return getTotalTaxAmount(province, income, inflationRate, yearsToInflate) / income
}

// ----- employment-insurance -----

private fun buildEi(): dynamic {
    val obj = js("{}")
    obj.MAX_INSURABLE_EARNINGS = Ei.maxInsurableEarnings
    val premiumRates = js("{}")
    premiumRates.CA = Ei.premiumRates.ca
    premiumRates.QC = Ei.premiumRates.qc
    obj.PREMIUM_RATES = premiumRates
    return obj
}

@JsExport
val EI: dynamic = buildEi()

// ----- quebec-parental-insurance-plan -----

private fun buildQpip(): dynamic {
    val obj = js("{}")
    obj.MAX_INSURABLE_EARNINGS = Qpip.maxInsurableEarnings
    val premiumRates = js("{}")
    premiumRates.SELF_EMPLOYED = Qpip.premiumRates.selfEmployed
    premiumRates.SALARIED = Qpip.premiumRates.salaried
    obj.PREMIUM_RATES = premiumRates
    return obj
}

@JsExport
val QPIP: dynamic = buildQpip()

// ----- dividend-credit -----

private fun dividendTaxCreditRateToJs(credit: CommonDividendTaxCreditRate): dynamic {
    // Legacy key order (dividend-credit.ts).
    val obj = js("{}")
    obj.GROSS_UP = credit.grossUp
    obj.CA = credit.rates.getValue(Jurisdiction.CA)
    obj.AB = credit.rates.getValue(Jurisdiction.AB)
    obj.BC = credit.rates.getValue(Jurisdiction.BC)
    obj.MB = credit.rates.getValue(Jurisdiction.MB)
    obj.NB = credit.rates.getValue(Jurisdiction.NB)
    obj.NL = credit.rates.getValue(Jurisdiction.NL)
    obj.NS = credit.rates.getValue(Jurisdiction.NS)
    obj.NT = credit.rates.getValue(Jurisdiction.NT)
    obj.NU = credit.rates.getValue(Jurisdiction.NU)
    obj.ON = credit.rates.getValue(Jurisdiction.ON)
    obj.PE = credit.rates.getValue(Jurisdiction.PE)
    obj.QC = credit.rates.getValue(Jurisdiction.QC)
    obj.SK = credit.rates.getValue(Jurisdiction.SK)
    obj.YT = credit.rates.getValue(Jurisdiction.YT)
    return obj
}

@JsExport
val NON_ELIGIBLE_DIVIDEND: dynamic = dividendTaxCreditRateToJs(NonEligibleDividend)

@JsExport
val ELIGIBLE_DIVIDEND: dynamic = dividendTaxCreditRateToJs(EligibleDividend)
