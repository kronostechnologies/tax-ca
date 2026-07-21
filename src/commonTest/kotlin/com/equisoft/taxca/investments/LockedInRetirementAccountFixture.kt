// Ported from src/investments/tests/fixtures/locked-in-retirement-account.ts

package com.equisoft.taxca.investments

import com.equisoft.taxca.misc.Jurisdiction

private const val MOCKED_MAX_CONVERSION_AGE = 71

val mockedUnlockingPct: Map<Jurisdiction, Double?> = mapOf(
    Jurisdiction.CA to 0.50,
    Jurisdiction.AB to 0.50,
    Jurisdiction.BC to 0.0,
    Jurisdiction.MB to 1.00,
    Jurisdiction.NB to 0.50,
    Jurisdiction.NL to 0.50,
    Jurisdiction.NS to 0.50,
    Jurisdiction.NT to null,
    Jurisdiction.NU to null,
    Jurisdiction.ON to 0.50,
    Jurisdiction.PE to null,
    Jurisdiction.QC to null,
    Jurisdiction.SK to 1.00,
    Jurisdiction.YT to null,
)

val mockedConversionRules: Map<Jurisdiction, ConversionRule?> = mapOf(
    Jurisdiction.CA to ConversionRule(minimumAge = 55, maximumAge = MOCKED_MAX_CONVERSION_AGE),
    Jurisdiction.AB to ConversionRule(minimumAge = 50, maximumAge = MOCKED_MAX_CONVERSION_AGE),
    Jurisdiction.BC to ConversionRule(minimumAge = 50, maximumAge = MOCKED_MAX_CONVERSION_AGE),
    Jurisdiction.MB to ConversionRule(minimumAge = 0, maximumAge = MOCKED_MAX_CONVERSION_AGE),
    Jurisdiction.NB to ConversionRule(minimumAge = 0, maximumAge = MOCKED_MAX_CONVERSION_AGE),
    Jurisdiction.NL to ConversionRule(minimumAge = 55, maximumAge = MOCKED_MAX_CONVERSION_AGE),
    Jurisdiction.NS to ConversionRule(minimumAge = 55, maximumAge = MOCKED_MAX_CONVERSION_AGE),
    Jurisdiction.NT to null,
    Jurisdiction.NU to null,
    Jurisdiction.ON to ConversionRule(minimumAge = 55, maximumAge = MOCKED_MAX_CONVERSION_AGE),
    Jurisdiction.PE to null,
    Jurisdiction.QC to ConversionRule(minimumAge = 55, maximumAge = MOCKED_MAX_CONVERSION_AGE),
    Jurisdiction.SK to ConversionRule(minimumAge = 55, maximumAge = MOCKED_MAX_CONVERSION_AGE),
    Jurisdiction.YT to null,
)

val jurisdictions: List<Jurisdiction> = listOf(
    Jurisdiction.CA,
    Jurisdiction.AB,
    Jurisdiction.BC,
    Jurisdiction.MB,
    Jurisdiction.NB,
    Jurisdiction.NL,
    Jurisdiction.NS,
    Jurisdiction.NT,
    Jurisdiction.NU,
    Jurisdiction.ON,
    Jurisdiction.PE,
    Jurisdiction.QC,
    Jurisdiction.SK,
    Jurisdiction.YT,
)
