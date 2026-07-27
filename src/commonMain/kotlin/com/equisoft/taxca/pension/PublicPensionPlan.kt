package com.equisoft.taxca.pension

import com.equisoft.taxca.utils.addYearsToDate
import com.equisoft.taxca.utils.clamp
import com.equisoft.taxca.utils.getMonthsDiff
import com.equisoft.taxca.utils.roundToPrecision
import kotlinx.datetime.LocalDate

data class Factor(
    val from: Double,
    val to: Double,
    val factor: Double,
)

data class PensionableEarnings(
    val basicExemption: Double,
    // Year's maximum pensionable earnings (YMPE)
    val ympe: Double,
    // Average YMPE of the last 5 years (including current year)
    val ympeAvg5: Double,
    // Year's additional maximum pensionable earnings (YAMPE)
    val yampe: Double,
    // YAMPE average of the last 5 years (including current year)
    val yampeAvg5: Double,
)

data class ContributionRates(
    val base: Double,
    val enhancementStep2: Double,
)

data class DeathBenefit(
    val rate: Double,
)

data class FlatBenefit(
    val orphan: Double,
    val disability: Double,
    val under45: Double,
    val under45WithChild: Double,
    val under45Disabled: Double,
    val from45To64: Double,
    val over64WithoutPension: Double,
)

data class MaxPension(
    val retirement: Double,
    val combinedRetirementSurvivor: Double,
    val deathBenefit: Double,
)

data class MonthlyDelay(
    val bonus: Double,
    val penalty: Double,
)

data class SurvivorRate(
    val over64: Double,
    val under65: Double,
)

data class PublicPensionPlan(
    val pensionableEarnings: PensionableEarnings,
    val contributionRates: ContributionRates,
    val deathBenefit: DeathBenefit,
    val defaultReferenceAge: Int,
    val flatBenefit: FlatBenefit,
    val indexationRateReferences: List<Pair<Int, Double>>,
    val maxPension: MaxPension,
    val maxIncome: Map<Int, Double>,
    val maxRequestAge: Int,
    val minRequestAge: Int,
    val monthlyDelay: MonthlyDelay,
    val replacementFactor: Double,
    val survivorRates: SurvivorRate,
    val yearsToFullPension: Double,
    // The legacy source rounds CPP to 3 digits but QPP to 2; kept per-plan for parity.
    val averageIndexationRatePrecision: Int,
) {
    fun getRequestDateFactor(
        birthDate: LocalDate,
        requestDate: LocalDate,
        customReferenceDate: LocalDate? = null,
    ): Double = getPublicPensionRequestDateFactor(this, birthDate, requestDate, customReferenceDate)

    fun getAverageIndexationRate(): Double {
        val sum = indexationRateReferences.sumOf { it.second }
        return roundToPrecision(sum / indexationRateReferences.size, averageIndexationRatePrecision)
    }
}

/**
 * Deferral/penalty factor applied to a CPP/QPP retirement pension, anchored at the reference age
 * (65 by default, or `customReferenceDate`).
 *
 * The factor is a pure function of the birth date and the request date: it does not depend on the
 * current date. For each month the request is deferred past the reference age it adds
 * `MONTHLY_DELAY.BONUS` (up to `MAX_REQUEST_AGE`); for each month before the reference age it removes
 * `MONTHLY_DELAY.PENALTY` (down to `MIN_REQUEST_AGE`).
 *
 * Returns 0 when the request date is before the minimum request age.
 */
fun getPublicPensionRequestDateFactor(
    plan: PublicPensionPlan,
    birthDate: LocalDate,
    requestDate: LocalDate,
    customReferenceDate: LocalDate? = null,
): Double {
    val (bonus, penalty) = plan.monthlyDelay

    val minRequestDate = addYearsToDate(birthDate, plan.minRequestAge)
    val maxRequestDate = addYearsToDate(birthDate, plan.maxRequestAge)
    val referenceDate = customReferenceDate ?: addYearsToDate(birthDate, plan.defaultReferenceAge)

    val monthsToMinRequestDate = getMonthsDiff(birthDate, minRequestDate)
    val monthsToMaxRequestDate = getMonthsDiff(birthDate, maxRequestDate)
    val monthsToReferenceDate = getMonthsDiff(birthDate, referenceDate)
    val monthsToRequestDate = getMonthsDiff(birthDate, requestDate)

    // Request date is before the minimum request date
    if (monthsToRequestDate < monthsToMinRequestDate) {
        return 0.0
    }

    val monthsDelta = clamp(
        monthsToRequestDate.toDouble(),
        monthsToMinRequestDate.toDouble(),
        monthsToMaxRequestDate.toDouble(),
    ) - monthsToReferenceDate

    return 1 + (monthsDelta * (if (monthsDelta >= 0) bonus else penalty))
}
