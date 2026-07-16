/*
Sources
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/benefit-amount.html
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/recovery-tax.html
    https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/benefit-amount.html (delay bonus)

Revised
    2026-06-30
*/

package com.equisoft.taxca.pension

import com.equisoft.taxca.utils.addYearsToDate
import com.equisoft.taxca.utils.clamp
import com.equisoft.taxca.utils.getAge
import com.equisoft.taxca.utils.getMonthsDiff
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min
import kotlinx.datetime.LocalDate

data class Repayment(
    val max: Double,
    val min: Double,
    val ratio: Double,
)

data class OasIncrease(
    val age: Int,
    val rate: Double,
    val repaymentMax: Double,
)

// Functions that depended on the wall clock in the legacy code take an explicit
// `today`; the JS facade supplies now(). D1 (age-75 increase on the full-residency
// path) is ported verbatim pending the domain ruling — see phase-0-decisions.md.
data class OldAgeSecurity(
    val increase: OasIncrease,
    val maxAge: Int,
    val minAge: Int,
    val ageOfMajority: Int,
    val minResidency: Int,
    val maxResidency: Int,
    val monthlyPaymentMax: Double,
    val monthlyDelayBonus: Double,
    val repayment: Repayment,
) {
    fun getMinRequestDateFactor(birthDate: LocalDate, requestDate: LocalDate, today: LocalDate): Double {
        val minRequestDate = addYearsToDate(birthDate, minAge)
        val maxRequestDate = addYearsToDate(birthDate, maxAge)

        val monthsToToday = getMonthsDiff(birthDate, today)
        val monthsToLastBirthDay = monthsToToday - (monthsToToday % 12)
        val monthsToMinRequestDate = getMonthsDiff(birthDate, minRequestDate)
        val monthsToMaxRequestDate = getMonthsDiff(birthDate, maxRequestDate)
        val monthsToRequestDate = getMonthsDiff(birthDate, requestDate)

        val receivingOASPayment = monthsToRequestDate >= monthsToMinRequestDate &&
            monthsToRequestDate <= monthsToMaxRequestDate && monthsToRequestDate <= monthsToToday

        if (monthsToLastBirthDay < monthsToMinRequestDate || monthsToLastBirthDay > monthsToMaxRequestDate ||
            receivingOASPayment
        ) {
            return 1.0
        }

        val monthsDelta = monthsToLastBirthDay - monthsToMinRequestDate
        return 1 + (monthsDelta * monthlyDelayBonus)
    }

    fun getRequestDateFactor(birthDate: LocalDate, requestDate: LocalDate, today: LocalDate): Double {
        val minRequestDate = addYearsToDate(birthDate, minAge)
        val maxRequestDate = addYearsToDate(birthDate, maxAge)

        val monthsToToday = getMonthsDiff(birthDate, today)
        val monthsToLastBirthDay = monthsToToday - (monthsToToday % 12)
        val monthsToMinRequestDate = getMonthsDiff(birthDate, minRequestDate)
        val monthsToMaxRequestDate = getMonthsDiff(birthDate, maxRequestDate)
        val monthsToRequestDate = getMonthsDiff(birthDate, requestDate)
        val clampedMonthsToRequestDate = clamp(
            monthsToRequestDate.toDouble(),
            monthsToMinRequestDate.toDouble(),
            monthsToMaxRequestDate.toDouble(),
        )
        val deltaMonthsFromMinRequestDate = clampedMonthsToRequestDate - monthsToMinRequestDate
        val receivingOASPayment = monthsToRequestDate >= monthsToMinRequestDate &&
            monthsToRequestDate <= monthsToMaxRequestDate && monthsToRequestDate <= monthsToToday

        if (monthsToLastBirthDay > monthsToMaxRequestDate || receivingOASPayment) {
            return 1.0
        }

        if (monthsToRequestDate < monthsToMinRequestDate) {
            return 0.0
        }

        return 1 + (deltaMonthsFromMinRequestDate * monthlyDelayBonus)
    }

    fun getRepaymentMax(startOfYearAge: Int): Double =
        if (startOfYearAge >= increase.age - 1) increase.repaymentMax else repayment.max

    fun getMinimumRequestAge(yearsOutsideCanada: Int): Int {
        val effectiveResidencyStart = ageOfMajority + yearsOutsideCanada
        val minAgeForResidency = effectiveResidencyStart + minResidency

        return max(minAgeForResidency, minAge)
    }

    fun getMinimumRequestDate(birthDate: LocalDate, yearsOutsideCanadaAtRequest: Int = 0): LocalDate =
        addYearsToDate(birthDate, getMinimumRequestAge(yearsOutsideCanadaAtRequest))

    fun validateRequestDate(requestDate: LocalDate, birthDate: LocalDate, yearsOutsideCanadaAtRequest: Int) {
        val minRequestDate = getMinimumRequestDate(birthDate, yearsOutsideCanadaAtRequest)
        if (requestDate < minRequestDate) {
            throw IllegalArgumentException("Invalid request date")
        }
    }

    fun getResidencyYearsAtRequest(
        birthDate: LocalDate,
        requestDate: LocalDate,
        yearsOutsideCanadaAtRequest: Int,
    ): Int {
        val ageAtRequest = getAge(birthDate, requestDate)
        val residencyYearsAtRequest = ageAtRequest - ageOfMajority - yearsOutsideCanadaAtRequest

        return max(residencyYearsAtRequest, 0)
    }

    fun getRequestDateMonthsDeferred(
        birthDate: LocalDate,
        requestDate: LocalDate,
        yearsOutsideCanadaAtRequest: Int = 0,
    ): Int {
        validateRequestDate(requestDate, birthDate, yearsOutsideCanadaAtRequest)

        val minRequestDate = getMinimumRequestDate(birthDate, yearsOutsideCanadaAtRequest)
        val maximumAgeDeferredDate = addYearsToDate(birthDate, maxAge)
        val maxDeferredDate = minOf(maximumAgeDeferredDate, requestDate)
        return abs(getMonthsDiff(maxDeferredDate, minRequestDate))
    }

    fun isFullResidencyAtMinOASAge(birthDate: LocalDate, yearsOutsideCanadaAtRequest: Int): Boolean {
        val minRequestDate = addYearsToDate(birthDate, minAge)
        val residencyYearsAtMinRequestAge = getResidencyYearsAtRequest(
            birthDate,
            minRequestDate,
            yearsOutsideCanadaAtRequest,
        )
        return residencyYearsAtMinRequestAge >= maxResidency
    }

    fun getDeferredRequestAmount(monthsDeferred: Int, ratio: Double = 1.0): Double =
        (ratio * monthlyPaymentMax) * (1 + (monthlyDelayBonus * monthsDeferred))

    fun getMonthlyOASAmount(
        birthDate: LocalDate,
        requestDate: LocalDate,
        yearsOutsideCanadaAtRequest: Int = 0,
    ): Double {
        validateRequestDate(requestDate, birthDate, yearsOutsideCanadaAtRequest)

        val monthsDeferred = getRequestDateMonthsDeferred(birthDate, requestDate, yearsOutsideCanadaAtRequest)

        val isFullResidency = isFullResidencyAtMinOASAge(birthDate, yearsOutsideCanadaAtRequest)
        if (isFullResidency) {
            return getDeferredRequestAmount(monthsDeferred)
        }

        // PSV partielle
        // Solution pour report de la date de demande
        val minRequestDate = getMinimumRequestDate(birthDate, yearsOutsideCanadaAtRequest)
        val residencyYearsAtMinRequest = getResidencyYearsAtRequest(
            birthDate,
            minRequestDate,
            yearsOutsideCanadaAtRequest,
        )
        val ratioAtMinRequestDate = min(residencyYearsAtMinRequest.toDouble() / maxResidency, 1.0)
        val requestDateDeferralAmount = getDeferredRequestAmount(monthsDeferred, ratioAtMinRequestDate)

        // Solution pour report année de résidence
        val residencyYearsAtRequest = getResidencyYearsAtRequest(
            birthDate,
            requestDate,
            yearsOutsideCanadaAtRequest,
        )
        val ratioAtRequestDate = min(residencyYearsAtRequest.toDouble() / maxResidency, 1.0)

        val deferredResidenceRequestAmount = monthlyPaymentMax * ratioAtRequestDate
        val ageAtRequest = getAge(birthDate, requestDate)

        val increaseFromAge = if (getAge(birthDate, requestDate) > increase.age) 1 + increase.rate else 1.0

        val amount = if (ageAtRequest > maxAge) {
            deferredResidenceRequestAmount
        } else {
            max(deferredResidenceRequestAmount, requestDateDeferralAmount)
        }

        return amount * increaseFromAge
    }
}

val Oas: OldAgeSecurity = OldAgeSecurity(
    maxAge = 70,
    minAge = 65,
    ageOfMajority = 18,
    minResidency = 10,
    maxResidency = 40,
    increase = OasIncrease(
        age = 75,
        rate = 0.1,
        repaymentMax = 161088.0,
    ),
    monthlyPaymentMax = 751.97,
    monthlyDelayBonus = 0.006,
    repayment = Repayment(
        max = 155109.0,
        min = 95323.0,
        ratio = 0.15,
    ),
)
