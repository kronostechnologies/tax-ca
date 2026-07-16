// JS compatibility facade for src/pension/old-age-security.ts (see api-baseline.md).

@file:OptIn(ExperimentalJsExport::class)
@file:Suppress("ClassName", "PropertyName", "NON_EXPORTABLE_TYPE", "TooManyFunctions")

import com.equisoft.taxca.interop.toLocalDateUtc
import com.equisoft.taxca.pension.Oas
import kotlin.js.Date

@JsExport
class OldAgeSecurityIncrease internal constructor(
    val AGE: Int,
    val RATE: Double,
    val REPAYMENT_MAX: Double,
)

@JsExport
class Repayment internal constructor(
    val MAX: Double,
    val MIN: Double,
    val RATIO: Double,
)

@JsExport
class OldAgeSecurity internal constructor() {
    val MAX_AGE: Int = Oas.maxAge
    val MIN_AGE: Int = Oas.minAge
    val AGE_OF_MAJORITY: Int = Oas.ageOfMajority
    val MIN_RESIDENCY: Int = Oas.minResidency
    val MAX_RESIDENCY: Int = Oas.maxResidency
    val INCREASE: OldAgeSecurityIncrease = OldAgeSecurityIncrease(
        AGE = Oas.increase.age,
        RATE = Oas.increase.rate,
        REPAYMENT_MAX = Oas.increase.repaymentMax,
    )
    val MONTHLY_PAYMENT_MAX: Double = Oas.monthlyPaymentMax
    val MONTHLY_DELAY_BONUS: Double = Oas.monthlyDelayBonus
    val REPAYMENT: Repayment = Repayment(
        MAX = Oas.repayment.max,
        MIN = Oas.repayment.min,
        RATIO = Oas.repayment.ratio,
    )

    fun getMinRequestDateFactor(birthDate: Date, requestDate: Date): Double =
        Oas.getMinRequestDateFactor(birthDate.toLocalDateUtc(), requestDate.toLocalDateUtc(), now().toLocalDateUtc())

    fun getRequestDateFactor(birthDate: Date, requestDate: Date): Double =
        Oas.getRequestDateFactor(birthDate.toLocalDateUtc(), requestDate.toLocalDateUtc(), now().toLocalDateUtc())

    fun getRepaymentMax(startOfYearAge: Int): Double = Oas.getRepaymentMax(startOfYearAge)

    fun getMinimumRequestAge(yearsOutsideCanada: Int): Int = Oas.getMinimumRequestAge(yearsOutsideCanada)

    fun getMinimumRequestDate(birthDate: Date, yearsOutsideCanadaAtRequest: Int = 0): Date =
        addYearsToDate(birthDate, Oas.getMinimumRequestAge(yearsOutsideCanadaAtRequest))

    fun validateRequestDate(requestDate: Date, birthDate: Date, yearsOutsideCanadaAtRequest: Int) {
        // Faithful to the legacy implementation, which compares LOCAL-time-reset dates
        // (resetTime) while every other date computation uses UTC fields.
        val minRequestDate = getMinimumRequestDate(birthDate, yearsOutsideCanadaAtRequest)
        if (resetTime(requestDate).getTime() < resetTime(minRequestDate).getTime()) {
            throw IllegalArgumentException("Invalid request date")
        }
    }

    fun getResidencyYearsAtRequest(birthDate: Date, requestDate: Date, yearsOutsideCanadaAtRequest: Int): Int =
        Oas.getResidencyYearsAtRequest(birthDate.toLocalDateUtc(), requestDate.toLocalDateUtc(), yearsOutsideCanadaAtRequest)

    fun getRequestDateMonthsDeferred(birthDate: Date, requestDate: Date, yearsOutsideCanadaAtRequest: Int = 0): Int {
        validateRequestDate(requestDate, birthDate, yearsOutsideCanadaAtRequest)
        return Oas.getRequestDateMonthsDeferred(
            birthDate.toLocalDateUtc(),
            requestDate.toLocalDateUtc(),
            yearsOutsideCanadaAtRequest,
        )
    }

    fun isFullResidencyAtMinOASAge(birthDate: Date, yearsOutsideCanadaAtRequest: Int): Boolean =
        Oas.isFullResidencyAtMinOASAge(birthDate.toLocalDateUtc(), yearsOutsideCanadaAtRequest)

    fun getDeferredRequestAmount(monthsDeferred: Int, ratio: Double = 1.0): Double =
        Oas.getDeferredRequestAmount(monthsDeferred, ratio)

    fun getMonthlyOASAmount(birthDate: Date, requestDate: Date, yearsOutsideCanadaAtRequest: Int = 0): Double {
        validateRequestDate(requestDate, birthDate, yearsOutsideCanadaAtRequest)
        return Oas.getMonthlyOASAmount(
            birthDate.toLocalDateUtc(),
            requestDate.toLocalDateUtc(),
            yearsOutsideCanadaAtRequest,
        )
    }
}

@JsExport
val OAS: OldAgeSecurity = OldAgeSecurity()
