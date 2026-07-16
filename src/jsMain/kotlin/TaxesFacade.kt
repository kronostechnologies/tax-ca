// JS compatibility facade for src/taxes (see api-baseline.md).

@file:OptIn(ExperimentalJsExport::class)
@file:Suppress("ClassName", "PropertyName", "NON_EXPORTABLE_TYPE", "TooManyFunctions")

import com.equisoft.taxca.interop.basicPersonalAmountToJs
import com.equisoft.taxca.misc.Jurisdiction
import com.equisoft.taxca.taxes.EligibleDividend
import com.equisoft.taxca.taxes.Ei
import com.equisoft.taxca.taxes.NonEligibleDividend
import com.equisoft.taxca.taxes.Qpip
import com.equisoft.taxca.taxes.Rate as CommonRate
import com.equisoft.taxca.taxes.TaxBracket as CommonTaxBracket
import com.equisoft.taxca.taxes.TaxBrackets as CommonTaxBrackets
import com.equisoft.taxca.taxes.DividendTaxCreditRate as CommonDividendTaxCreditRate
import com.equisoft.taxca.taxes.getEffectiveRate as commonGetEffectiveRate
import com.equisoft.taxca.taxes.getFederalBaseCredit as commonGetFederalBaseCredit
import com.equisoft.taxca.taxes.getFederalBaseTaxAmount as commonGetFederalBaseTaxAmount
import com.equisoft.taxca.taxes.getFederalBasicPersonalAmount as commonGetFederalBasicPersonalAmount
import com.equisoft.taxca.taxes.getFederalMarginalRate as commonGetFederalMarginalRate
import com.equisoft.taxca.taxes.getFederalTaxAmount as commonGetFederalTaxAmount
import com.equisoft.taxca.taxes.getFederalTaxCreditRate as commonGetFederalTaxCreditRate
import com.equisoft.taxca.taxes.getFederalTaxRates as commonGetFederalTaxRates
import com.equisoft.taxca.taxes.getMaxFederalMarginalRate as commonGetMaxFederalMarginalRate
import com.equisoft.taxca.taxes.getMaxProvincialMarginalRate as commonGetMaxProvincialMarginalRate
import com.equisoft.taxca.taxes.getProvincialAbatement as commonGetProvincialAbatement
import com.equisoft.taxca.taxes.getProvincialBaseCredit as commonGetProvincialBaseCredit
import com.equisoft.taxca.taxes.getProvincialBaseTaxAmount as commonGetProvincialBaseTaxAmount
import com.equisoft.taxca.taxes.getProvincialMarginalRate as commonGetProvincialMarginalRate
import com.equisoft.taxca.taxes.getProvincialSurtaxAmount as commonGetProvincialSurtaxAmount
import com.equisoft.taxca.taxes.getProvincialTaxAmount as commonGetProvincialTaxAmount
import com.equisoft.taxca.taxes.getRate as commonGetRate
import com.equisoft.taxca.taxes.getTaxAmount as commonGetTaxAmount
import com.equisoft.taxca.taxes.getTaxRates as commonGetTaxRates
import com.equisoft.taxca.taxes.getTotalMarginalRate as commonGetTotalMarginalRate
import com.equisoft.taxca.taxes.getTotalMaxMarginalRate as commonGetTotalMaxMarginalRate
import com.equisoft.taxca.taxes.getTotalTaxAmount as commonGetTotalTaxAmount

// ----- income-tax -----

// Output shape for rate arrays (plain FROM/TO/RATE properties, like the legacy objects).
@JsExport
class Rate internal constructor(
    val FROM: Double,
    val TO: Double,
    val RATE: Double,
)

// Input shape: consumers pass plain JS objects, so property access must not be mangled.
external interface RateInput {
    val FROM: Double
    val TO: Double
    val RATE: Double
}

@JsExport
class TaxBracket internal constructor(
    val ABATEMENT: Double,
    val TAX_CREDIT_RATE: Double,
    val BASIC_PERSONAL_AMOUNT: dynamic,
    val RATES: Array<Rate>,
    val SURTAX_RATES: Array<Rate>,
)

@JsExport
class TaxBrackets internal constructor(
    val CA: TaxBracket,
    val AB: TaxBracket,
    val BC: TaxBracket,
    val MB: TaxBracket,
    val NB: TaxBracket,
    val NL: TaxBracket,
    val NS: TaxBracket,
    val PE: TaxBracket,
    val ON: TaxBracket,
    val QC: TaxBracket,
    val SK: TaxBracket,
    val NT: TaxBracket,
    val NU: TaxBracket,
    val YT: TaxBracket,
)

private fun toJsRates(rates: List<CommonRate>): Array<Rate> =
    rates.map { Rate(FROM = it.from, TO = it.to, RATE = it.rate) }.toTypedArray()

private fun toCommonRates(rates: Array<RateInput>): List<CommonRate> =
    rates.map { CommonRate(from = it.FROM, to = it.TO, rate = it.RATE) }

private fun toJsTaxBracket(bracket: CommonTaxBracket): TaxBracket = TaxBracket(
    ABATEMENT = bracket.abatement,
    TAX_CREDIT_RATE = bracket.taxCreditRate,
    BASIC_PERSONAL_AMOUNT = basicPersonalAmountToJs(
        bracket.basicPersonalAmount.min,
        bracket.basicPersonalAmount.max,
        bracket.basicPersonalAmount.isRange,
    ),
    RATES = toJsRates(bracket.rates),
    SURTAX_RATES = toJsRates(bracket.surtaxRates),
)

@JsExport
val TAX_BRACKETS: TaxBrackets = TaxBrackets(
    CA = toJsTaxBracket(CommonTaxBrackets.getValue(Jurisdiction.CA)),
    AB = toJsTaxBracket(CommonTaxBrackets.getValue(Jurisdiction.AB)),
    BC = toJsTaxBracket(CommonTaxBrackets.getValue(Jurisdiction.BC)),
    MB = toJsTaxBracket(CommonTaxBrackets.getValue(Jurisdiction.MB)),
    NB = toJsTaxBracket(CommonTaxBrackets.getValue(Jurisdiction.NB)),
    NL = toJsTaxBracket(CommonTaxBrackets.getValue(Jurisdiction.NL)),
    NS = toJsTaxBracket(CommonTaxBrackets.getValue(Jurisdiction.NS)),
    PE = toJsTaxBracket(CommonTaxBrackets.getValue(Jurisdiction.PE)),
    ON = toJsTaxBracket(CommonTaxBrackets.getValue(Jurisdiction.ON)),
    QC = toJsTaxBracket(CommonTaxBrackets.getValue(Jurisdiction.QC)),
    SK = toJsTaxBracket(CommonTaxBrackets.getValue(Jurisdiction.SK)),
    NT = toJsTaxBracket(CommonTaxBrackets.getValue(Jurisdiction.NT)),
    NU = toJsTaxBracket(CommonTaxBrackets.getValue(Jurisdiction.NU)),
    YT = toJsTaxBracket(CommonTaxBrackets.getValue(Jurisdiction.YT)),
)

@JsExport
fun getTaxAmount(rates: Array<RateInput>, income: Double, inflationRate: Double, yearsToInflate: Double): Double =
    commonGetTaxAmount(toCommonRates(rates), income, inflationRate, yearsToInflate)

@JsExport
fun getRate(brackets: Array<RateInput>, grossIncome: Double, inflationRate: Double, yearsToInflate: Double): Double =
    commonGetRate(toCommonRates(brackets), grossIncome, inflationRate, yearsToInflate)

@JsExport
fun getTaxRates(code: String): Array<Rate> =
    toJsRates(commonGetTaxRates(Jurisdiction.fromCode(code)))

@JsExport
fun getFederalTaxRates(): Array<Rate> =
    toJsRates(commonGetFederalTaxRates())

@JsExport
fun getFederalBaseTaxAmount(grossIncome: Double, inflationRate: Double = 0.0, yearsToInflate: Double = 0.0): Double =
    commonGetFederalBaseTaxAmount(grossIncome, inflationRate, yearsToInflate)

@JsExport
fun getFederalTaxCreditRate(): Double = commonGetFederalTaxCreditRate()

@JsExport
fun getFederalBasicPersonalAmount(
    grossIncome: Double,
    inflationRate: Double,
    yearsToInflate: Double,
): Double = commonGetFederalBasicPersonalAmount(grossIncome, inflationRate, yearsToInflate)

@JsExport
fun getFederalBaseCredit(grossIncome: Double, inflationRate: Double, yearsToInflate: Double): Double =
    commonGetFederalBaseCredit(grossIncome, inflationRate, yearsToInflate)

@JsExport
fun getProvincialAbatement(province: String, federalTaxAmount: Double): Double =
    commonGetProvincialAbatement(Jurisdiction.fromCode(province), federalTaxAmount)

@JsExport
fun getFederalTaxAmount(
    provincialCode: String,
    grossIncome: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
    taxCredit: Double = 0.0,
): Double = commonGetFederalTaxAmount(
    Jurisdiction.fromCode(provincialCode),
    grossIncome,
    inflationRate,
    yearsToInflate,
    taxCredit,
)

@JsExport
fun getProvincialSurtaxAmount(
    province: String,
    baseTaxAmount: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double = commonGetProvincialSurtaxAmount(Jurisdiction.fromCode(province), baseTaxAmount, inflationRate, yearsToInflate)

@JsExport
fun getProvincialBaseTaxAmount(
    province: String,
    grossIncome: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double = commonGetProvincialBaseTaxAmount(Jurisdiction.fromCode(province), grossIncome, inflationRate, yearsToInflate)

@JsExport
fun getProvincialBaseCredit(province: String, inflationRate: Double, yearsToInflate: Double): Double =
    commonGetProvincialBaseCredit(Jurisdiction.fromCode(province), inflationRate, yearsToInflate)

@JsExport
fun getProvincialTaxAmount(
    province: String,
    grossIncome: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
    taxCredit: Double = 0.0,
): Double = commonGetProvincialTaxAmount(
    Jurisdiction.fromCode(province),
    grossIncome,
    inflationRate,
    yearsToInflate,
    taxCredit,
)

@JsExport
fun getFederalMarginalRate(
    provincialCode: String,
    grossIncome: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double = commonGetFederalMarginalRate(Jurisdiction.fromCode(provincialCode), grossIncome, inflationRate, yearsToInflate)

@JsExport
fun getProvincialMarginalRate(
    provincialCode: String,
    grossIncome: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double = commonGetProvincialMarginalRate(Jurisdiction.fromCode(provincialCode), grossIncome, inflationRate, yearsToInflate)

@JsExport
fun getTotalMarginalRate(
    provincialCode: String,
    grossIncome: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double = commonGetTotalMarginalRate(Jurisdiction.fromCode(provincialCode), grossIncome, inflationRate, yearsToInflate)

@JsExport
fun getMaxProvincialMarginalRate(provincialCode: String): Double =
    commonGetMaxProvincialMarginalRate(Jurisdiction.fromCode(provincialCode))

@JsExport
fun getMaxFederalMarginalRate(provincialCode: String): Double =
    commonGetMaxFederalMarginalRate(Jurisdiction.fromCode(provincialCode))

@JsExport
fun getTotalMaxMarginalRate(provincialCode: String): Double =
    commonGetTotalMaxMarginalRate(Jurisdiction.fromCode(provincialCode))

@JsExport
fun getTotalTaxAmount(
    provincialCode: String,
    grossIncome: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double = commonGetTotalTaxAmount(Jurisdiction.fromCode(provincialCode), grossIncome, inflationRate, yearsToInflate)

@JsExport
fun getEffectiveRate(
    province: String,
    income: Double,
    inflationRate: Double = 0.0,
    yearsToInflate: Double = 0.0,
): Double = commonGetEffectiveRate(Jurisdiction.fromCode(province), income, inflationRate, yearsToInflate)

// ----- employment-insurance -----

@JsExport
class PremiumRate internal constructor(
    val CA: Double,
    val QC: Double,
)

@JsExport
class EmploymentInsurance internal constructor(
    val MAX_INSURABLE_EARNINGS: Double,
    val PREMIUM_RATES: PremiumRate,
)

@JsExport
val EI: EmploymentInsurance = EmploymentInsurance(
    MAX_INSURABLE_EARNINGS = Ei.maxInsurableEarnings,
    PREMIUM_RATES = PremiumRate(
        CA = Ei.premiumRates.ca,
        QC = Ei.premiumRates.qc,
    ),
)

// ----- quebec-parental-insurance-plan -----

@JsExport
class PremiumRates internal constructor(
    val SELF_EMPLOYED: Double,
    val SALARIED: Double,
)

@JsExport
class QuebecParentalInsurancePlan internal constructor(
    val MAX_INSURABLE_EARNINGS: Double,
    val PREMIUM_RATES: PremiumRates,
)

@JsExport
val QPIP: QuebecParentalInsurancePlan = QuebecParentalInsurancePlan(
    MAX_INSURABLE_EARNINGS = Qpip.maxInsurableEarnings,
    PREMIUM_RATES = PremiumRates(
        SELF_EMPLOYED = Qpip.premiumRates.selfEmployed,
        SALARIED = Qpip.premiumRates.salaried,
    ),
)

// ----- dividend-credit -----

@JsExport
class DividendTaxCreditRate internal constructor(
    val GROSS_UP: Double,
    val CA: Double,
    val AB: Double,
    val BC: Double,
    val MB: Double,
    val NB: Double,
    val NL: Double,
    val NS: Double,
    val NT: Double,
    val NU: Double,
    val ON: Double,
    val PE: Double,
    val QC: Double,
    val SK: Double,
    val YT: Double,
)

private fun toJsDividendTaxCreditRate(credit: CommonDividendTaxCreditRate): DividendTaxCreditRate =
    DividendTaxCreditRate(
        GROSS_UP = credit.grossUp,
        CA = credit.rates.getValue(Jurisdiction.CA),
        AB = credit.rates.getValue(Jurisdiction.AB),
        BC = credit.rates.getValue(Jurisdiction.BC),
        MB = credit.rates.getValue(Jurisdiction.MB),
        NB = credit.rates.getValue(Jurisdiction.NB),
        NL = credit.rates.getValue(Jurisdiction.NL),
        NS = credit.rates.getValue(Jurisdiction.NS),
        NT = credit.rates.getValue(Jurisdiction.NT),
        NU = credit.rates.getValue(Jurisdiction.NU),
        ON = credit.rates.getValue(Jurisdiction.ON),
        PE = credit.rates.getValue(Jurisdiction.PE),
        QC = credit.rates.getValue(Jurisdiction.QC),
        SK = credit.rates.getValue(Jurisdiction.SK),
        YT = credit.rates.getValue(Jurisdiction.YT),
    )

@JsExport
val NON_ELIGIBLE_DIVIDEND: DividendTaxCreditRate = toJsDividendTaxCreditRate(NonEligibleDividend)

@JsExport
val ELIGIBLE_DIVIDEND: DividendTaxCreditRate = toJsDividendTaxCreditRate(EligibleDividend)
