/*
Sources
    Provincial: https://www.empire.ca/sites/default/files/2025-01/INV-996A-LIFMinMaxWithdrawalPercentages-EN-web.pdf
    Federal & Territories & PEI: https://www.osfi-bsif.gc.ca/en/supervision/pensions/administering-pension-plans/guidance-topic/life-income-funds-restricted-life-income-funds-variable-benefits-accounts

Conversion
    PROVINCIAL
    Because the age of reference is at the end of the previous year, we must shift the reference rate
    by one year to reflect the calculation engine which uses the age at the end of the current year.
    i.e. : Gov has a rate for age 60 but we use it for age 61.

    FED & TERRITORIES & PEI
    No conversion.

Revised
    2025-12-21
*/

package com.equisoft.taxca.investments

import com.equisoft.taxca.misc.Jurisdiction
import com.equisoft.taxca.utils.clamp

/* Alberta (AB), British Columbia (BC), Ontario (ON), New Brunswick (NB),
 Newfoundland and Labrador (NL), Saskatchewan (SK)
*/
val province1MaxWithdrawalPct: Map<Int, Double> = mapOf(
    51 to 0.0627,
    52 to 0.0631,
    53 to 0.0635,
    54 to 0.0640,
    55 to 0.0645,
    56 to 0.0651,
    57 to 0.0657,
    58 to 0.0663,
    59 to 0.0670,
    60 to 0.0677,
    61 to 0.0685,
    62 to 0.0694,
    63 to 0.0704,
    64 to 0.0714,
    65 to 0.0726,
    66 to 0.0738,
    67 to 0.0752,
    68 to 0.0767,
    69 to 0.0783,
    70 to 0.0802,
    71 to 0.0822,
    72 to 0.0845,
    73 to 0.0871,
    74 to 0.0900,
    75 to 0.0934,
    76 to 0.0971,
    77 to 0.1015,
    78 to 0.1066,
    79 to 0.1125,
    80 to 0.1196,
    81 to 0.1282,
    82 to 0.1387,
    83 to 0.1519,
    84 to 0.1690,
    85 to 0.1919,
    86 to 0.2240,
    87 to 0.2723,
    88 to 0.3529,
    89 to 0.5146,
    90 to 1.0,
)

// Manitoba (MB), Nova Scotia (NS)
val province2MaxWithdrawalPct: Map<Int, Double> = mapOf(
    51 to 0.0610,
    52 to 0.0610,
    53 to 0.0610,
    54 to 0.0610,
    55 to 0.0610,
    56 to 0.0640,
    57 to 0.0650,
    58 to 0.0650,
    59 to 0.0660,
    60 to 0.0670,
    61 to 0.0670,
    62 to 0.0680,
    63 to 0.0690,
    64 to 0.0700,
    65 to 0.0710,
    66 to 0.0720,
    67 to 0.0730,
    68 to 0.0740,
    69 to 0.0760,
    70 to 0.0770,
    71 to 0.0790,
    72 to 0.0810,
    73 to 0.0830,
    74 to 0.0850,
    75 to 0.0880,
    76 to 0.0910,
    77 to 0.0940,
    78 to 0.0980,
    79 to 0.1030,
    80 to 0.1080,
    81 to 0.1150,
    82 to 0.1210,
    83 to 0.1290,
    84 to 0.1380,
    85 to 0.1480,
    86 to 0.1600,
    87 to 0.1730,
    88 to 0.1890,
    89 to 0.2000,
)

// Others: Northwest Territories (NT), Nunavut (NU), Prince Edward Island (PE), Yukon (YT)
val othersMaxWithdrawalPct: Map<Int, Double> = mapOf(
    20 to 0.045331,
    21 to 0.045384,
    22 to 0.04544,
    23 to 0.0455,
    24 to 0.045564,
    25 to 0.045631,
    26 to 0.045703,
    27 to 0.045779,
    28 to 0.04586,
    29 to 0.045947,
    30 to 0.046038,
    31 to 0.046136,
    32 to 0.04624,
    33 to 0.046351,
    34 to 0.046469,
    35 to 0.046595,
    36 to 0.046729,
    37 to 0.046872,
    38 to 0.047025,
    39 to 0.047188,
    40 to 0.047361,
    41 to 0.047547,
    42 to 0.047745,
    43 to 0.047957,
    44 to 0.048184,
    45 to 0.048427,
    46 to 0.048687,
    47 to 0.048966,
    48 to 0.049265,
    49 to 0.049586,
    50 to 0.049931,
    51 to 0.050302,
    52 to 0.050701,
    53 to 0.051131,
    54 to 0.051595,
    55 to 0.052096,
    56 to 0.052637,
    57 to 0.053224,
    58 to 0.053861,
    59 to 0.054552,
    60 to 0.055304,
    61 to 0.056125,
    62 to 0.057022,
    63 to 0.058005,
    64 to 0.059084,
    65 to 0.060272,
    66 to 0.061586,
    67 to 0.063042,
    68 to 0.064662,
    69 to 0.066474,
    70 to 0.068508,
    71 to 0.070804,
    72 to 0.073413,
    73 to 0.076397,
    74 to 0.079836,
    75 to 0.083837,
    76 to 0.088423,
    77 to 0.093729,
    78 to 0.099935,
    79 to 0.107287,
    80 to 0.116128,
    81 to 0.126955,
    82 to 0.140512,
    83 to 0.15797,
    84 to 0.18128,
    85 to 0.213952,
    86 to 0.263008,
    87 to 0.344831,
    88 to 0.508575,
    89 to 1.0,
)

// Federal
val federalMaxWithdrawalPct: Map<Int, Double> = mapOf(
    20 to 0.045331,
    21 to 0.045384,
    22 to 0.04544,
    23 to 0.0455,
    24 to 0.045564,
    25 to 0.045631,
    26 to 0.045703,
    27 to 0.045779,
    28 to 0.04586,
    29 to 0.045947,
    30 to 0.046038,
    31 to 0.046136,
    32 to 0.04624,
    33 to 0.046351,
    34 to 0.046469,
    35 to 0.046595,
    36 to 0.046729,
    37 to 0.046872,
    38 to 0.047025,
    39 to 0.047188,
    40 to 0.047361,
    41 to 0.047547,
    42 to 0.047745,
    43 to 0.047957,
    44 to 0.048184,
    45 to 0.048427,
    46 to 0.048687,
    47 to 0.048966,
    48 to 0.049265,
    49 to 0.049586,
    50 to 0.049931,
    51 to 0.050302,
    52 to 0.050701,
    53 to 0.051131,
    54 to 0.051595,
    55 to 0.052096,
    56 to 0.052637,
    57 to 0.053224,
    58 to 0.053861,
    59 to 0.054552,
    60 to 0.055304,
    61 to 0.056125,
    62 to 0.057022,
    63 to 0.058005,
    64 to 0.059084,
    65 to 0.060272,
    66 to 0.061586,
    67 to 0.063042,
    68 to 0.064662,
    69 to 0.066474,
    70 to 0.068508,
    71 to 0.070804,
    72 to 0.073413,
    73 to 0.076397,
    74 to 0.079836,
    75 to 0.083837,
    76 to 0.088423,
    77 to 0.093729,
    78 to 0.099935,
    79 to 0.107287,
    80 to 0.116128,
    81 to 0.126955,
    82 to 0.140512,
    83 to 0.15797,
    84 to 0.18128,
    85 to 0.213952,
    86 to 0.263008,
    87 to 0.344831,
    88 to 0.508575,
    89 to 1.0,
)

fun getMaxWithdrawalPct(jurisdiction: Jurisdiction, age: Int): Double {
    fun getAgeLimitByProvinceGroup(group: Map<Int, Double>, biggest: Boolean = true): Int =
        if (biggest) group.keys.max() else group.keys.min()

    fun lookup(group: Map<Int, Double>): Double = group.getValue(
        clamp(
            age.toDouble(),
            getAgeLimitByProvinceGroup(group, false).toDouble(),
            getAgeLimitByProvinceGroup(group).toDouble(),
        ).toInt(),
    )

    return when (jurisdiction) {
        Jurisdiction.AB,
        Jurisdiction.BC,
        Jurisdiction.ON,
        Jurisdiction.NB,
        Jurisdiction.NL,
        Jurisdiction.SK,
        -> lookup(province1MaxWithdrawalPct)
        Jurisdiction.QC,
        Jurisdiction.MB,
        Jurisdiction.NS,
        -> lookup(province2MaxWithdrawalPct)
        Jurisdiction.CA -> lookup(federalMaxWithdrawalPct)
        // Others: Northwest Territories (NT), Nunavut (NU), Prince Edward Island (PE), Yukon (YT)
        else -> lookup(othersMaxWithdrawalPct)
    }
}

data class SmallBalanceUnlockingRule(
    // Minimum age required to be eligible. null means there is no minimum age.
    val minAge: Int?,
    // Balance threshold, expressed as a fraction of the YMPE, below which the
    // account is eligible for small-balance unlocking. May depend on age.
    val getThresholdPct: (age: Int) -> Double,
)

private val smallBalanceUnlockingRules: Map<Jurisdiction, SmallBalanceUnlockingRule?> = mapOf(
    Jurisdiction.AB to SmallBalanceUnlockingRule(minAge = null, getThresholdPct = { age -> if (age < 65) 0.20 else 0.40 }),
    Jurisdiction.BC to SmallBalanceUnlockingRule(minAge = null, getThresholdPct = { age -> if (age < 65) 0.20 else 0.40 }),
    Jurisdiction.MB to SmallBalanceUnlockingRule(minAge = 65, getThresholdPct = { 0.40 }),
    Jurisdiction.NB to SmallBalanceUnlockingRule(minAge = 65, getThresholdPct = { 0.40 }),
    Jurisdiction.NL to SmallBalanceUnlockingRule(minAge = 65, getThresholdPct = { 0.40 }),
    Jurisdiction.NS to SmallBalanceUnlockingRule(minAge = 65, getThresholdPct = { 0.50 }),
    Jurisdiction.PE to null,
    Jurisdiction.ON to SmallBalanceUnlockingRule(minAge = 55, getThresholdPct = { 0.40 }),
    Jurisdiction.QC to SmallBalanceUnlockingRule(minAge = 65, getThresholdPct = { 0.40 }),
    Jurisdiction.SK to SmallBalanceUnlockingRule(minAge = null, getThresholdPct = { 0.20 }),
    Jurisdiction.NT to SmallBalanceUnlockingRule(minAge = 55, getThresholdPct = { 0.50 }),
    Jurisdiction.NU to SmallBalanceUnlockingRule(minAge = 55, getThresholdPct = { 0.50 }),
    Jurisdiction.YT to SmallBalanceUnlockingRule(minAge = 55, getThresholdPct = { 0.50 }),
)

// Returns the YMPE balance threshold (as a fraction of the YMPE) for small-balance
// unlocking at the given age, or null when the jurisdiction has no small-balance
// unlocking mechanism or the age requirement is not met.
fun getYMPEUnlockingSmallBalancePct(jurisdiction: Jurisdiction, age: Int): Double? {
    val rule = smallBalanceUnlockingRules[jurisdiction] ?: return null
    if (rule.minAge != null && age < rule.minAge) return null
    return rule.getThresholdPct(age)
}
