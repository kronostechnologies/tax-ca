/*
Sources
    https://www.retraitequebec.gouv.qc.ca/en/landing/indexation/Pages/montants-donnees-base.aspx

Revised
    2025-12-22
*/

package com.equisoft.taxca.pension

val Qpp: PublicPensionPlan = PublicPensionPlan(
    pensionableEarnings = PensionableEarnings(
        basicExemption = 3500.0,
        // Year's maximum pensionable earnings (YMPE)
        ympe = 74600.0,
        // Average YMPE of the last 5 year (including current year)
        ympeAvg5 = 69180.0,
        // Year's additional maximum pensionable earnings (YAMPE)
        yampe = 85000.0,
        // Year's additional maximum pensionable earnings (YAMPE) of the last 5 year (including current year)
        // YMPE growth factor of a specific year is used to project YAMPE of that specific year + rounded,
        // to stay conservative in our projections.
        yampeAvg5 = 75985.0,
    ),
    contributionRates = ContributionRates(
        base = 0.063,
        enhancementStep2 = 0.04,
    ),
    deathBenefit = DeathBenefit(rate = 0.5),
    defaultReferenceAge = 65,
    flatBenefit = FlatBenefit(
        // Survivors' benefits
        orphan = 3693.72,
        // Disability benefits
        disability = 20852.04,
        // Surviving spouse's pension
        under45 = 8634.00,
        under45WithChild = 13559.40,
        under45Disabled = 14082.96,
        from45To64 = 14082.96,
        over64WithoutPension = 10577.76,
    ),
    indexationRateReferences = listOf(
        2007 to 0.021,
        2008 to 0.020,
        2009 to 0.025,
        2010 to 0.004,
        2011 to 0.017,
        2012 to 0.028,
        2013 to 0.018,
        2014 to 0.009,
        2015 to 0.018,
        2016 to 0.012,
        2017 to 0.020,
        2018 to 0.015,
        2019 to 0.023,
        2020 to 0.019,
        2021 to 0.010,
        2022 to 0.027,
        2023 to 0.065,
        // Decommissionned functionnality
    ),
    maxIncome = mapOf(
        1966 to 5000.0,
        1967 to 5000.0,
        1968 to 5100.0,
        1969 to 5200.0,
        1970 to 5300.0,
        1971 to 5400.0,
        1972 to 5500.0,
        1973 to 5900.0,
        1974 to 6600.0,
        1975 to 7400.0,
        1976 to 8300.0,
        1977 to 9300.0,
        1978 to 10400.0,
        1979 to 11700.0,
        1980 to 13100.0,
        1981 to 14700.0,
        1982 to 16500.0,
        1983 to 18500.0,
        1984 to 20800.0,
        1985 to 23400.0,
        1986 to 25800.0,
        1987 to 25900.0,
        1988 to 26500.0,
        1989 to 27700.0,
        1990 to 28900.0,
        1991 to 30500.0,
        1992 to 32200.0,
        1993 to 33400.0,
        1994 to 34400.0,
        1995 to 34900.0,
        1996 to 35400.0,
        1997 to 35800.0,
        1998 to 36900.0,
        1999 to 37400.0,
        2000 to 37600.0,
        2001 to 38300.0,
        2002 to 39100.0,
        2003 to 39900.0,
        2004 to 40500.0,
        2005 to 41100.0,
        2006 to 42100.0,
        2007 to 43700.0,
        2008 to 44900.0,
        2009 to 46300.0,
        2010 to 47200.0,
        2011 to 48300.0,
        2012 to 50100.0,
        2013 to 51100.0,
        2014 to 52500.0,
        2015 to 53600.0,
        2016 to 54900.0,
        2017 to 55300.0,
        2018 to 55900.0,
        2019 to 57400.0,
        2020 to 58700.0,
        2021 to 61600.0,
        2022 to 64900.0,
        2023 to 66600.0,
        2024 to 68500.0,
        2025 to 71300.0,
        2026 to 74600.0,
    ),
    maxPension = MaxPension(
        // Max amount at age 65
        retirement = 18091.80,
        // Value must be the same as Max Retirement for the QPP
        combinedRetirementSurvivor = 18091.80,
        deathBenefit = 2500.0,
    ),
    maxRequestAge = 72,
    minRequestAge = 60,
    monthlyDelay = MonthlyDelay(
        bonus = 0.0070,
        penalty = 0.0060,
    ),
    replacementFactor = 0.25,
    survivorRates = SurvivorRate(
        over64 = 0.6,
        under65 = 0.375,
    ),
    yearsToFullPension = 40.0,
    // The legacy source rounds the QPP average indexation rate to 2 digits.
    averageIndexationRatePrecision = 2,
)
