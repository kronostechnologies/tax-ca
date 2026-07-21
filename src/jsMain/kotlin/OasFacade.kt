// JS compatibility facade for src/pension/old-age-security.ts (see api-baseline.md).
// OAS is a plain JS object (real consumers spread it and mutate it in tests); every
// method re-reads the object's current property values before computing, exactly like
// the legacy `this.X` reads did. Property order matches the legacy build
// (build/legacy-dist/pension/old-age-security.js): methods first, then data.

@file:OptIn(ExperimentalJsExport::class)
@file:Suppress("ClassName", "PropertyName", "NON_EXPORTABLE_TYPE")

import com.equisoft.taxca.interop.toLocalDateUtc
import com.equisoft.taxca.pension.Oas
import com.equisoft.taxca.pension.OasIncrease
import com.equisoft.taxca.pension.OldAgeSecurity
import com.equisoft.taxca.pension.Repayment
import kotlin.js.Date

// Rebuilds the common data class from the plain JS object's current property values so
// consumer mutations (e.g. `OAS.MONTHLY_PAYMENT_MAX = 1000`) affect computations.
private fun oasFromJs(o: dynamic): OldAgeSecurity = Oas.copy(
    maxAge = o.MAX_AGE,
    minAge = o.MIN_AGE,
    ageOfMajority = o.AGE_OF_MAJORITY,
    minResidency = o.MIN_RESIDENCY,
    maxResidency = o.MAX_RESIDENCY,
    increase = OasIncrease(
        age = o.INCREASE.AGE,
        rate = o.INCREASE.RATE,
        repaymentMax = o.INCREASE.REPAYMENT_MAX,
    ),
    monthlyPaymentMax = o.MONTHLY_PAYMENT_MAX,
    monthlyDelayBonus = o.MONTHLY_DELAY_BONUS,
    repayment = Repayment(
        max = o.REPAYMENT.MAX,
        min = o.REPAYMENT.MIN,
        ratio = o.REPAYMENT.RATIO,
    ),
)

private fun buildOasJs(): dynamic {
    val obj = js("{}")

    obj.getMinRequestDateFactor = { birthDate: Date, requestDate: Date ->
        oasFromJs(obj).getMinRequestDateFactor(
            birthDate.toLocalDateUtc(),
            requestDate.toLocalDateUtc(),
            now().toLocalDateUtc(),
        )
    }
    obj.getRequestDateFactor = { birthDate: Date, requestDate: Date ->
        oasFromJs(obj).getRequestDateFactor(
            birthDate.toLocalDateUtc(),
            requestDate.toLocalDateUtc(),
            now().toLocalDateUtc(),
        )
    }
    obj.getRepaymentMax = { startOfYearAge: Int ->
        oasFromJs(obj).getRepaymentMax(startOfYearAge)
    }
    obj.getMinimumRequestAge = { yearsOutsideCanada: Int ->
        oasFromJs(obj).getMinimumRequestAge(yearsOutsideCanada)
    }
    // Non-leaf methods dispatch every legacy `this.method()` call THROUGH the object:
    // consumer test suites replace individual methods (jest.spyOn) and expect internal
    // calls to see the replacement, exactly like the legacy object literal did.
    obj.getMinimumRequestDate = { birthDate: Date, yearsOutsideCanadaAtRequest: Int? ->
        addYearsToDate(birthDate, obj.getMinimumRequestAge(yearsOutsideCanadaAtRequest ?: 0) as Int)
    }
    obj.validateRequestDate = { requestDate: Date, birthDate: Date, yearsOutsideCanadaAtRequest: Int ->
        // Faithful to the legacy implementation, which compares LOCAL-time-reset dates
        // (resetTime) while every other date computation uses UTC fields. Dispatched
        // through the object like the legacy `this.getMinimumRequestDate` read.
        val minRequestDate: Date = obj.getMinimumRequestDate(birthDate, yearsOutsideCanadaAtRequest)
        if (resetTime(requestDate).getTime() < resetTime(minRequestDate).getTime()) {
            throw IllegalArgumentException("Invalid request date")
        }
    }
    obj.getResidencyYearsAtRequest = { birthDate: Date, requestDate: Date, yearsOutsideCanadaAtRequest: Int ->
        oasFromJs(obj).getResidencyYearsAtRequest(
            birthDate.toLocalDateUtc(),
            requestDate.toLocalDateUtc(),
            yearsOutsideCanadaAtRequest,
        )
    }
    obj.getRequestDateMonthsDeferred = { birthDate: Date, requestDate: Date, yearsOutsideCanadaAtRequest: Int? ->
        val years = yearsOutsideCanadaAtRequest ?: 0
        obj.validateRequestDate(requestDate, birthDate, years)
        val minRequestDate = obj.getMinimumRequestDate(birthDate, years) as Date
        val maximumAgeDeferredDate = addYearsToDate(birthDate, obj.MAX_AGE as Int)
        val maxDeferredDate =
            if (maximumAgeDeferredDate.getTime() <= requestDate.getTime()) maximumAgeDeferredDate else requestDate
        kotlin.math.abs(getMonthsDiff(maxDeferredDate, minRequestDate))
    }
    obj.isFullResidencyAtMinOASAge = { birthDate: Date, yearsOutsideCanadaAtRequest: Int ->
        val minRequestDate = addYearsToDate(birthDate, obj.MIN_AGE as Int)
        val residencyYearsAtMinRequestAge =
            obj.getResidencyYearsAtRequest(birthDate, minRequestDate, yearsOutsideCanadaAtRequest) as Int
        residencyYearsAtMinRequestAge >= obj.MAX_RESIDENCY as Int
    }
    obj.getDeferredRequestAmount = { monthsDeferred: Int, ratio: Double? ->
        oasFromJs(obj).getDeferredRequestAmount(monthsDeferred, ratio ?: 1.0)
    }
    obj.getMonthlyOASAmount = { birthDate: Date, requestDate: Date, yearsOutsideCanadaAtRequest: Int? ->
        val years = yearsOutsideCanadaAtRequest ?: 0
        obj.validateRequestDate(requestDate, birthDate, years)

        val monthsDeferred = obj.getRequestDateMonthsDeferred(birthDate, requestDate, years) as Int

        val isFullResidency = obj.isFullResidencyAtMinOASAge(birthDate, years) as Boolean
        if (isFullResidency) {
            obj.getDeferredRequestAmount(monthsDeferred, null) as Double
        } else {
            // PSV partielle — mirrors the legacy body, dispatching through the object
            val minRequestDate = obj.getMinimumRequestDate(birthDate, years) as Date
            val residencyYearsAtMinRequest =
                obj.getResidencyYearsAtRequest(birthDate, minRequestDate, years) as Int
            val maxResidency = obj.MAX_RESIDENCY as Int
            val ratioAtMinRequestDate = kotlin.math.min(residencyYearsAtMinRequest.toDouble() / maxResidency, 1.0)
            val requestDateDeferralAmount =
                obj.getDeferredRequestAmount(monthsDeferred, ratioAtMinRequestDate) as Double

            val residencyYearsAtRequest =
                obj.getResidencyYearsAtRequest(birthDate, requestDate, years) as Int
            val ratioAtRequestDate = kotlin.math.min(residencyYearsAtRequest.toDouble() / maxResidency, 1.0)

            val deferredResidenceRequestAmount = obj.MONTHLY_PAYMENT_MAX as Double * ratioAtRequestDate
            val ageAtRequest = getAge(birthDate, requestDate)

            val increaseFromAge =
                if (getAge(birthDate, requestDate) > obj.INCREASE.AGE as Int) 1 + obj.INCREASE.RATE as Double else 1.0

            val amount = if (ageAtRequest > obj.MAX_AGE as Int) {
                deferredResidenceRequestAmount
            } else {
                kotlin.math.max(deferredResidenceRequestAmount, requestDateDeferralAmount)
            }

            amount * increaseFromAge
        }
    }

    obj.MAX_AGE = Oas.maxAge
    obj.MIN_AGE = Oas.minAge
    obj.AGE_OF_MAJORITY = Oas.ageOfMajority
    obj.MIN_RESIDENCY = Oas.minResidency
    obj.MAX_RESIDENCY = Oas.maxResidency

    val increase = js("{}")
    increase.AGE = Oas.increase.age
    increase.RATE = Oas.increase.rate
    increase.REPAYMENT_MAX = Oas.increase.repaymentMax
    obj.INCREASE = increase

    obj.MONTHLY_PAYMENT_MAX = Oas.monthlyPaymentMax
    obj.MONTHLY_DELAY_BONUS = Oas.monthlyDelayBonus

    val repayment = js("{}")
    repayment.MAX = Oas.repayment.max
    repayment.MIN = Oas.repayment.min
    repayment.RATIO = Oas.repayment.ratio
    obj.REPAYMENT = repayment

    return obj
}

@JsExport
val OAS: dynamic = buildOasJs()
