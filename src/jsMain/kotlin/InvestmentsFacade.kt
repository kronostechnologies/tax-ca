// JS compatibility facade for src/investments (excluding registered-education-savings-plan,
// which lives in its own facade). See docs/kmp-migration/api-baseline.md for the contract.

@file:OptIn(ExperimentalJsExport::class)
@file:Suppress("ClassName", "PropertyName", "NON_EXPORTABLE_TYPE")

import com.equisoft.taxca.interop.yearMapToJsObject
import com.equisoft.taxca.investments.CapitalGainsBrackets
import com.equisoft.taxca.investments.MaxConversionAge
import com.equisoft.taxca.investments.Rrif
import com.equisoft.taxca.investments.Rrsp
import com.equisoft.taxca.investments.Tfsa
import com.equisoft.taxca.investments.canConvert as commonCanConvert
import com.equisoft.taxca.investments.canUnlock as commonCanUnlock
import com.equisoft.taxca.investments.federalMaxWithdrawalPct as commonFederalMaxWithdrawalPct
import com.equisoft.taxca.investments.getCapitalGainsTaxableAmount as commonGetCapitalGainsTaxableAmount
import com.equisoft.taxca.investments.getConversionRules as commonGetConversionRules
import com.equisoft.taxca.investments.getMaxWithdrawalPct as commonGetMaxWithdrawalPct
import com.equisoft.taxca.investments.getMinimumWithdrawalPercentage as commonGetMinimumWithdrawalPercentage
import com.equisoft.taxca.investments.getUnlockingPct as commonGetUnlockingPct
import com.equisoft.taxca.investments.getYMPEUnlockingSmallBalancePct as commonGetYMPEUnlockingSmallBalancePct
import com.equisoft.taxca.investments.othersMaxWithdrawalPct as commonOthersMaxWithdrawalPct
import com.equisoft.taxca.investments.province1MaxWithdrawalPct as commonProvince1MaxWithdrawalPct
import com.equisoft.taxca.investments.province2MaxWithdrawalPct as commonProvince2MaxWithdrawalPct
import com.equisoft.taxca.misc.Jurisdiction

// ----- life-income-fund -----

@JsExport
val province1MaxWithdrawalPct: dynamic = yearMapToJsObject(commonProvince1MaxWithdrawalPct)

@JsExport
val province2MaxWithdrawalPct: dynamic = yearMapToJsObject(commonProvince2MaxWithdrawalPct)

@JsExport
val othersMaxWithdrawalPct: dynamic = yearMapToJsObject(commonOthersMaxWithdrawalPct)

@JsExport
val federalMaxWithdrawalPct: dynamic = yearMapToJsObject(commonFederalMaxWithdrawalPct)

@JsExport
fun getMaxWithdrawalPct(jurisdiction: String, age: Int): Double {
    // The legacy switch statement sends any unrecognized code to the "others" table,
    // so unknown codes must not throw (the legacy spec exercises 'other').
    val commonJurisdiction = Jurisdiction.entries.firstOrNull { it.code == jurisdiction }
        ?: Jurisdiction.PE
    return commonGetMaxWithdrawalPct(commonJurisdiction, age)
}

@JsExport
fun getYMPEUnlockingSmallBalancePct(jurisdiction: String, age: Int): Double? {
    // Legacy runtime returns null (undefined lookup) for unknown codes instead of throwing.
    val commonJurisdiction = Jurisdiction.entries.firstOrNull { it.code == jurisdiction }
        ?: return null
    return commonGetYMPEUnlockingSmallBalancePct(commonJurisdiction, age)
}

// ----- locked-in-retirement-account -----

@JsExport
val MAX_CONVERSION_AGE: Int = MaxConversionAge

@JsExport
class ConversionRule internal constructor(
    val minimumAge: Int,
    val maximumAge: Int,
)

@JsExport
fun getUnlockingPct(jurisdiction: String): Double? =
    commonGetUnlockingPct(Jurisdiction.fromCode(jurisdiction))

@JsExport
fun getConversionRules(jurisdiction: String): ConversionRule? =
    commonGetConversionRules(Jurisdiction.fromCode(jurisdiction))?.let {
        ConversionRule(minimumAge = it.minimumAge, maximumAge = it.maximumAge)
    }

@JsExport
fun canUnlock(jurisdiction: String): Boolean =
    commonCanUnlock(Jurisdiction.fromCode(jurisdiction))

@JsExport
fun canConvert(jurisdiction: String, age: Int): Boolean =
    commonCanConvert(Jurisdiction.fromCode(jurisdiction), age)

// ----- non-registered-savings-plan -----

@JsExport
val CAPITAL_GAINS_BRACKETS: Array<dynamic> = CapitalGainsBrackets.map { bracket ->
    val obj = js("{}")
    obj.FROM = bracket.from
    obj.TO = bracket.to
    obj.RATE = bracket.rate
    obj
}.toTypedArray()

@JsExport
fun getCapitalGainsTaxableAmount(totalCapitalGains: Double): Double =
    commonGetCapitalGainsTaxableAmount(totalCapitalGains)

// ----- registered-retirement-income-fund -----

@JsExport
class RegisteredRetirementIncomeFund internal constructor(
    val MIN_WITHDRAWAL_PCT: dynamic,
)

@JsExport
val RRIF: RegisteredRetirementIncomeFund = RegisteredRetirementIncomeFund(
    MIN_WITHDRAWAL_PCT = yearMapToJsObject(Rrif.minWithdrawalPct),
)

@JsExport
fun getMinimumWithdrawalPercentage(beginningOfYearAge: Int): Double =
    commonGetMinimumWithdrawalPercentage(beginningOfYearAge)

// ----- registered-retirement-savings-plan -----

@JsExport
class ConversionAge internal constructor(
    val MIN: Int,
    val MAX: Int,
)

@JsExport
class RegisteredRetirementSavingsPlan internal constructor(
    val CONVERSION_AGE: ConversionAge,
    val MAX_CONTRIBUTION: Double,
)

@JsExport
val RRSP: RegisteredRetirementSavingsPlan = RegisteredRetirementSavingsPlan(
    CONVERSION_AGE = ConversionAge(
        MIN = Rrsp.conversionAge.min,
        MAX = Rrsp.conversionAge.max,
    ),
    MAX_CONTRIBUTION = Rrsp.maxContribution,
)

// ----- tax-free-savings-account -----

@JsExport
class TaxFreeSavingsAccount internal constructor(
    val MAX_CONTRIBUTION: Double,
    val UNROUNDED_MAX_CONTRIBUTION: Double,
    val ROUNDING_FACTOR: Double,
    val UPDATE_YEAR: Int,
)

@JsExport
val TFSA: TaxFreeSavingsAccount = TaxFreeSavingsAccount(
    MAX_CONTRIBUTION = Tfsa.maxContribution,
    UNROUNDED_MAX_CONTRIBUTION = Tfsa.unroundedMaxContribution,
    ROUNDING_FACTOR = Tfsa.roundingFactor,
    UPDATE_YEAR = Tfsa.updateYear,
)
