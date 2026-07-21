// JS compatibility facade for src/investments (excluding registered-education-savings-plan,
// which lives in its own facade). See docs/kmp-migration/api-baseline.md for the contract.
// Exported data consts are plain JS objects (own, enumerable, writable properties) so
// consumers can spread and mutate them exactly like the legacy build.

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
fun getUnlockingPct(jurisdiction: String): Double? =
    commonGetUnlockingPct(Jurisdiction.fromCode(jurisdiction))

@JsExport
fun getConversionRules(jurisdiction: String): dynamic {
    // Fresh plain object per call: consumers receive a mutable { minimumAge, maximumAge }
    // copy, so mutating one result never affects the shared rule tables.
    val rule = commonGetConversionRules(Jurisdiction.fromCode(jurisdiction)) ?: return null
    val obj = js("{}")
    obj.minimumAge = rule.minimumAge
    obj.maximumAge = rule.maximumAge
    return obj
}

@JsExport
fun canUnlock(jurisdiction: String): Boolean =
    commonCanUnlock(Jurisdiction.fromCode(jurisdiction))

@JsExport
fun canConvert(jurisdiction: String, age: Int): Boolean =
    commonCanConvert(Jurisdiction.fromCode(jurisdiction), age)

// ----- non-registered-savings-plan -----

private fun buildCapitalGainsBrackets(): dynamic {
    val arr = js("[]")
    for (bracket in CapitalGainsBrackets) {
        val obj = js("{}")
        obj.FROM = bracket.from
        // Double.POSITIVE_INFINITY compiles to JS Infinity, matching the legacy TO.
        obj.TO = bracket.to
        obj.RATE = bracket.rate
        arr.push(obj)
    }
    return arr
}

@JsExport
val CAPITAL_GAINS_BRACKETS: dynamic = buildCapitalGainsBrackets()

@JsExport
fun getCapitalGainsTaxableAmount(totalCapitalGains: Double): Double =
    commonGetCapitalGainsTaxableAmount(totalCapitalGains)

// ----- registered-retirement-income-fund -----

private fun buildRrif(): dynamic {
    val obj = js("{}")
    obj.MIN_WITHDRAWAL_PCT = yearMapToJsObject(Rrif.minWithdrawalPct)
    return obj
}

@JsExport
val RRIF: dynamic = buildRrif()

@JsExport
fun getMinimumWithdrawalPercentage(beginningOfYearAge: Int): Double =
    commonGetMinimumWithdrawalPercentage(beginningOfYearAge)

// ----- registered-retirement-savings-plan -----

private fun buildRrsp(): dynamic {
    val obj = js("{}")
    val conversionAge = js("{}")
    conversionAge.MIN = Rrsp.conversionAge.min
    conversionAge.MAX = Rrsp.conversionAge.max
    obj.CONVERSION_AGE = conversionAge
    obj.MAX_CONTRIBUTION = Rrsp.maxContribution
    return obj
}

@JsExport
val RRSP: dynamic = buildRrsp()

// ----- tax-free-savings-account -----

private fun buildTfsa(): dynamic {
    val obj = js("{}")
    obj.MAX_CONTRIBUTION = Tfsa.maxContribution
    obj.UNROUNDED_MAX_CONTRIBUTION = Tfsa.unroundedMaxContribution
    obj.ROUNDING_FACTOR = Tfsa.roundingFactor
    obj.UPDATE_YEAR = Tfsa.updateYear
    return obj
}

@JsExport
val TFSA: dynamic = buildTfsa()
