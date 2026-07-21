// java.time.LocalDate overloads for JVM consumers (financial-api uses java.time
// throughout; kotlinx-datetime converts losslessly). Covers the surface consumed via
// financial-api's TaxCARepository — see docs/kmp-migration/reconciliation-audit.md.

package com.equisoft.taxca.jvm

import com.equisoft.taxca.pension.OldAgeSecurity
import com.equisoft.taxca.pension.PublicPensionPlan
import com.equisoft.taxca.pension.calculateCppContributionCoverageFactor
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import kotlin.math.max
import kotlin.math.min
import kotlinx.datetime.toJavaLocalDate
import kotlinx.datetime.toKotlinLocalDate

fun PublicPensionPlan.getRequestDateFactor(
    birthDate: LocalDate,
    requestDate: LocalDate,
    customReferenceDate: LocalDate? = null,
): Double = getRequestDateFactor(
    birthDate.toKotlinLocalDate(),
    requestDate.toKotlinLocalDate(),
    customReferenceDate?.toKotlinLocalDate(),
)

fun OldAgeSecurity.getMinimumRequestDate(birthDate: LocalDate, yearsOutsideCanada: Int = 0): LocalDate =
    getMinimumRequestDate(birthDate.toKotlinLocalDate(), yearsOutsideCanada).toJavaLocalDate()

fun OldAgeSecurity.getMaximumRequestDate(birthDate: LocalDate, yearsOutsideCanada: Int = 0): LocalDate =
    getMaximumRequestDate(birthDate.toKotlinLocalDate(), yearsOutsideCanada).toJavaLocalDate()

fun OldAgeSecurity.isRequestDateValid(birthDate: LocalDate, requestDate: LocalDate, yearsOutsideCanada: Int = 0): Boolean =
    isRequestDateValid(birthDate.toKotlinLocalDate(), requestDate.toKotlinLocalDate(), yearsOutsideCanada)

fun OldAgeSecurity.validateRequestDate(requestDate: LocalDate, birthDate: LocalDate, yearsOutsideCanada: Int) =
    validateRequestDate(requestDate.toKotlinLocalDate(), birthDate.toKotlinLocalDate(), yearsOutsideCanada)

fun OldAgeSecurity.getResidencyYearsAtRequest(
    birthDate: LocalDate,
    requestDate: LocalDate,
    yearsOutsideCanada: Int,
): Int = getResidencyYearsAtRequest(birthDate.toKotlinLocalDate(), requestDate.toKotlinLocalDate(), yearsOutsideCanada)

fun OldAgeSecurity.getRequestDateMonthsDeferred(
    birthDate: LocalDate,
    requestDate: LocalDate,
    yearsOutsideCanada: Int = 0,
): Int = getRequestDateMonthsDeferred(birthDate.toKotlinLocalDate(), requestDate.toKotlinLocalDate(), yearsOutsideCanada)

fun OldAgeSecurity.isFullResidencyAtMinOASAge(birthDate: LocalDate, yearsOutsideCanada: Int): Boolean =
    isFullResidencyAtMinOASAge(birthDate.toKotlinLocalDate(), yearsOutsideCanada)

fun OldAgeSecurity.getMonthlyOASAmount(
    birthDate: LocalDate,
    requestDate: LocalDate,
    yearsOutsideCanada: Int = 0,
): Double = getMonthlyOASAmount(birthDate.toKotlinLocalDate(), requestDate.toKotlinLocalDate(), yearsOutsideCanada)

fun OldAgeSecurity.getMinRequestDateFactor(
    birthDate: LocalDate,
    requestDate: LocalDate,
    today: LocalDate = LocalDate.now(),
): Double = getMinRequestDateFactor(birthDate.toKotlinLocalDate(), requestDate.toKotlinLocalDate(), today.toKotlinLocalDate())

fun OldAgeSecurity.getRequestDateFactor(
    birthDate: LocalDate,
    requestDate: LocalDate,
    today: LocalDate = LocalDate.now(),
): Double = getRequestDateFactor(birthDate.toKotlinLocalDate(), requestDate.toKotlinLocalDate(), today.toKotlinLocalDate())

fun calculateCppContributionCoverageFactor(
    birthDate: LocalDate,
    pensionStartDate: LocalDate,
    contributionYears: Int?,
): Double = calculateCppContributionCoverageFactor(
    birthDate.toKotlinLocalDate(),
    pensionStartDate.toKotlinLocalDate(),
    contributionYears,
)

// --- BigDecimal-exact contribution coverage factor ---
// Reproduces financial-api's original arithmetic (scale-10 HALF_UP division) bit-for-bit
// so BigDecimal-comparing consumers see no change at cutover.

private const val MONTHS_AT_MAJORITY = 216L
private const val CONTRIBUTION_MAX_AGE_IN_MONTHS = 840L
private val CPP_START_DATE: LocalDate = LocalDate.of(1966, 1, 1)
private const val DIVISION_SCALE = 10
private val DROP_OUT_RATIO = BigDecimal("0.17")
private const val MIN_DENOMINATOR_MONTHS = 120
private const val MONTHS_IN_YEAR = 12

fun calculateCppContributionCoverageFactorDecimal(
    birthDate: LocalDate,
    pensionStartDate: LocalDate,
    contributionYears: Int?,
): BigDecimal {
    if (contributionYears == null) {
        return BigDecimal.ONE
    }

    val monthsToContributionStartDate = max(MONTHS_AT_MAJORITY, birthDate.until(CPP_START_DATE, ChronoUnit.MONTHS))
    val monthsToContributionEndDate = min(
        CONTRIBUTION_MAX_AGE_IN_MONTHS,
        birthDate.until(pensionStartDate, ChronoUnit.MONTHS),
    )
    val contributionLength = monthsToContributionEndDate.toBigDecimal()
        .minus(monthsToContributionStartDate.toBigDecimal())

    val generalDropOutDenominator = DROP_OUT_RATIO.multiply(contributionLength)
        .min(contributionLength.minus(MIN_DENOMINATOR_MONTHS.toBigDecimal()))
    val maxContributionMonths = contributionLength.minus(generalDropOutDenominator)

    val contributoryMonths = contributionYears.toBigDecimal().multiply(MONTHS_IN_YEAR.toBigDecimal())

    return contributoryMonths
        .min(maxContributionMonths)
        .divide(maxContributionMonths, DIVISION_SCALE, RoundingMode.HALF_UP)
}
