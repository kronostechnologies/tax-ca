/*
Revised
    2025-08-12
*/

package com.equisoft.taxca.investments

import com.equisoft.taxca.misc.Jurisdiction

data class ConversionRule(
    val minimumAge: Int,
    val maximumAge: Int,
)

const val MaxConversionAge: Int = 71

private val federalConversionRule: ConversionRule = ConversionRule(
    minimumAge = 55,
    maximumAge = MaxConversionAge,
)

private val conversionRules: Map<Jurisdiction, ConversionRule?> = mapOf(
    Jurisdiction.CA to federalConversionRule,
    Jurisdiction.AB to ConversionRule(minimumAge = 50, maximumAge = MaxConversionAge),
    Jurisdiction.BC to ConversionRule(minimumAge = 50, maximumAge = MaxConversionAge),
    Jurisdiction.MB to ConversionRule(minimumAge = 0, maximumAge = MaxConversionAge),
    Jurisdiction.NB to ConversionRule(minimumAge = 0, maximumAge = MaxConversionAge),
    Jurisdiction.NL to ConversionRule(minimumAge = 55, maximumAge = MaxConversionAge),
    Jurisdiction.NS to ConversionRule(minimumAge = 55, maximumAge = MaxConversionAge),
    Jurisdiction.NT to federalConversionRule,
    Jurisdiction.NU to federalConversionRule,
    Jurisdiction.ON to ConversionRule(minimumAge = 55, maximumAge = MaxConversionAge),
    Jurisdiction.PE to null,
    Jurisdiction.QC to ConversionRule(minimumAge = 55, maximumAge = MaxConversionAge),
    Jurisdiction.SK to ConversionRule(minimumAge = 55, maximumAge = MaxConversionAge),
    Jurisdiction.YT to federalConversionRule,
)

private const val federalUnlockingPct: Double = 0.50

private val unlockingPct: Map<Jurisdiction, Double?> = mapOf(
    Jurisdiction.CA to federalUnlockingPct,
    Jurisdiction.AB to 0.50,
    Jurisdiction.BC to null,
    Jurisdiction.MB to 1.00,
    Jurisdiction.NB to 0.50,
    Jurisdiction.NL to 0.50,
    Jurisdiction.NS to 0.50,
    Jurisdiction.NT to federalUnlockingPct,
    Jurisdiction.NU to federalUnlockingPct,
    Jurisdiction.ON to 0.50,
    Jurisdiction.PE to null,
    Jurisdiction.QC to null,
    Jurisdiction.SK to 1.00,
    Jurisdiction.YT to federalUnlockingPct,
)

fun getUnlockingPct(jurisdiction: Jurisdiction): Double? = unlockingPct[jurisdiction]

fun getConversionRules(jurisdiction: Jurisdiction): ConversionRule? = conversionRules[jurisdiction]

fun canUnlock(jurisdiction: Jurisdiction): Boolean {
    // Legacy JS: `if (!pct) return false` — falsy for both null and 0.
    val pct = getUnlockingPct(jurisdiction)
    if (pct == null || pct == 0.0) return false
    return pct > 0
}

fun canConvert(jurisdiction: Jurisdiction, age: Int): Boolean {
    val rule = getConversionRules(jurisdiction) ?: return false
    return age >= rule.minimumAge && age <= rule.maximumAge
}
