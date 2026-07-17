// JS compatibility facade for src/pension (see api-baseline.md). CPP, QPP,
// MONEY_PURCHASE and SPP are plain JS objects (real consumers spread and mutate them);
// old-age-security has its own facade elsewhere. Methods re-read the object's CURRENT
// property values on every call, exactly like the legacy `this.X` reads did.

@file:OptIn(ExperimentalJsExport::class)
@file:Suppress("ClassName", "PropertyName", "NON_EXPORTABLE_TYPE")

import com.equisoft.taxca.interop.pairsToJsArray
import com.equisoft.taxca.interop.toLocalDateUtc
import com.equisoft.taxca.interop.yearMapToJsObject
import com.equisoft.taxca.pension.ContributionRates
import com.equisoft.taxca.pension.Cpp
import com.equisoft.taxca.pension.DeathBenefit
import com.equisoft.taxca.pension.FlatBenefit
import com.equisoft.taxca.pension.MaxPension
import com.equisoft.taxca.pension.MoneyPurchase
import com.equisoft.taxca.pension.MonthlyDelay
import com.equisoft.taxca.pension.PensionableEarnings
import com.equisoft.taxca.pension.PublicPensionPlan
import com.equisoft.taxca.pension.Qpp
import com.equisoft.taxca.pension.Spp
import com.equisoft.taxca.pension.SurvivorRate
import kotlin.js.Date

// Rebuilds the common data class from the plain JS object's current property values so
// consumer mutations (e.g. `CPP.MONTHLY_DELAY.BONUS = x`) affect computations.
// `precision` is not part of the legacy runtime shape (the legacy source hardcoded the
// rounding per plan: CPP rounds to 3 digits, QPP to 2), so it is passed separately.
private fun planFromJs(o: dynamic, precision: Int): PublicPensionPlan {
    val refsJs = o.INDEXATION_RATE_REFERENCES
    val refsCount: Int = refsJs.length
    val refs = mutableListOf<Pair<Int, Double>>()
    for (i in 0 until refsCount) {
        val year: Double = refsJs[i][0]
        val rate: Double = refsJs[i][1]
        refs.add(Pair(year.toInt(), rate))
    }

    val maxIncomeKeys = js("Object").keys(o.MAX_INCOME)
    val maxIncomeKeysCount: Int = maxIncomeKeys.length
    val maxIncome = mutableMapOf<Int, Double>()
    for (i in 0 until maxIncomeKeysCount) {
        val year: String = maxIncomeKeys[i]
        maxIncome[year.toInt()] = o.MAX_INCOME[year]
    }

    return PublicPensionPlan(
        pensionableEarnings = PensionableEarnings(
            basicExemption = o.PENSIONABLE_EARNINGS.BASIC_EXEMPTION,
            ympe = o.PENSIONABLE_EARNINGS.YMPE,
            ympeAvg5 = o.PENSIONABLE_EARNINGS.YMPE_AVG_5,
            yampe = o.PENSIONABLE_EARNINGS.YAMPE,
            yampeAvg5 = o.PENSIONABLE_EARNINGS.YAMPE_AVG_5,
        ),
        contributionRates = ContributionRates(
            base = o.CONTRIBUTION_RATES.BASE,
            enhancementStep2 = o.CONTRIBUTION_RATES.ENHANCEMENT_STEP_2,
        ),
        deathBenefit = DeathBenefit(rate = o.DEATH_BENEFIT.RATE),
        defaultReferenceAge = o.DEFAULT_REFERENCE_AGE,
        flatBenefit = FlatBenefit(
            orphan = o.FLAT_BENEFIT.ORPHAN,
            disability = o.FLAT_BENEFIT.DISABILITY,
            under45 = o.FLAT_BENEFIT.UNDER_45,
            under45WithChild = o.FLAT_BENEFIT.UNDER_45_WITH_CHILD,
            under45Disabled = o.FLAT_BENEFIT.UNDER_45_DISABLED,
            from45To64 = o.FLAT_BENEFIT.FROM_45_TO_64,
            over64WithoutPension = o.FLAT_BENEFIT.OVER_64_WITHOUT_PENSION,
        ),
        indexationRateReferences = refs,
        maxPension = MaxPension(
            retirement = o.MAX_PENSION.RETIREMENT,
            combinedRetirementSurvivor = o.MAX_PENSION.COMBINED_RETIREMENT_SURVIVOR,
            deathBenefit = o.MAX_PENSION.DEATH_BENEFIT,
        ),
        maxIncome = maxIncome,
        maxRequestAge = o.MAX_REQUEST_AGE,
        minRequestAge = o.MIN_REQUEST_AGE,
        monthlyDelay = MonthlyDelay(
            bonus = o.MONTHLY_DELAY.BONUS,
            penalty = o.MONTHLY_DELAY.PENALTY,
        ),
        replacementFactor = o.REPLACEMENT_FACTOR,
        survivorRates = SurvivorRate(
            over64 = o.SURVIVOR_RATES.OVER_64,
            under65 = o.SURVIVOR_RATES.UNDER_65,
        ),
        yearsToFullPension = o.YEARS_TO_FULL_PENSION,
        averageIndexationRatePrecision = precision,
    )
}

// Property order matches the legacy build (build/legacy-dist/pension/*.js): data
// properties first, then the two methods.
private fun buildPlanJs(plan: PublicPensionPlan, precision: Int): dynamic {
    val obj = js("{}")

    val pensionableEarnings = js("{}")
    pensionableEarnings.BASIC_EXEMPTION = plan.pensionableEarnings.basicExemption
    pensionableEarnings.YMPE = plan.pensionableEarnings.ympe
    pensionableEarnings.YMPE_AVG_5 = plan.pensionableEarnings.ympeAvg5
    pensionableEarnings.YAMPE = plan.pensionableEarnings.yampe
    pensionableEarnings.YAMPE_AVG_5 = plan.pensionableEarnings.yampeAvg5
    obj.PENSIONABLE_EARNINGS = pensionableEarnings

    val contributionRates = js("{}")
    contributionRates.BASE = plan.contributionRates.base
    contributionRates.ENHANCEMENT_STEP_2 = plan.contributionRates.enhancementStep2
    obj.CONTRIBUTION_RATES = contributionRates

    val deathBenefit = js("{}")
    deathBenefit.RATE = plan.deathBenefit.rate
    obj.DEATH_BENEFIT = deathBenefit

    obj.DEFAULT_REFERENCE_AGE = plan.defaultReferenceAge

    val flatBenefit = js("{}")
    flatBenefit.ORPHAN = plan.flatBenefit.orphan
    flatBenefit.DISABILITY = plan.flatBenefit.disability
    flatBenefit.UNDER_45 = plan.flatBenefit.under45
    flatBenefit.UNDER_45_WITH_CHILD = plan.flatBenefit.under45WithChild
    flatBenefit.UNDER_45_DISABLED = plan.flatBenefit.under45Disabled
    flatBenefit.FROM_45_TO_64 = plan.flatBenefit.from45To64
    flatBenefit.OVER_64_WITHOUT_PENSION = plan.flatBenefit.over64WithoutPension
    obj.FLAT_BENEFIT = flatBenefit

    obj.INDEXATION_RATE_REFERENCES = pairsToJsArray(plan.indexationRateReferences)
    obj.MAX_INCOME = yearMapToJsObject(plan.maxIncome)

    val maxPension = js("{}")
    maxPension.RETIREMENT = plan.maxPension.retirement
    maxPension.COMBINED_RETIREMENT_SURVIVOR = plan.maxPension.combinedRetirementSurvivor
    maxPension.DEATH_BENEFIT = plan.maxPension.deathBenefit
    obj.MAX_PENSION = maxPension

    obj.MAX_REQUEST_AGE = plan.maxRequestAge
    obj.MIN_REQUEST_AGE = plan.minRequestAge

    val monthlyDelay = js("{}")
    monthlyDelay.BONUS = plan.monthlyDelay.bonus
    monthlyDelay.PENALTY = plan.monthlyDelay.penalty
    obj.MONTHLY_DELAY = monthlyDelay

    obj.REPLACEMENT_FACTOR = plan.replacementFactor

    val survivorRates = js("{}")
    survivorRates.OVER_64 = plan.survivorRates.over64
    survivorRates.UNDER_65 = plan.survivorRates.under65
    obj.SURVIVOR_RATES = survivorRates

    obj.YEARS_TO_FULL_PENSION = plan.yearsToFullPension

    obj.getRequestDateFactor = { birthDate: Date, requestDate: Date, customReferenceDate: Date? ->
        planFromJs(obj, precision).getRequestDateFactor(
            birthDate.toLocalDateUtc(),
            requestDate.toLocalDateUtc(),
            customReferenceDate?.toLocalDateUtc(),
        )
    }
    obj.getAverageIndexationRate = {
        planFromJs(obj, precision).getAverageIndexationRate()
    }

    return obj
}

@JsExport
val CPP: dynamic = buildPlanJs(Cpp, Cpp.averageIndexationRatePrecision)

@JsExport
val QPP: dynamic = buildPlanJs(Qpp, Qpp.averageIndexationRatePrecision)

@JsExport
fun getPublicPensionRequestDateFactor(
    plan: dynamic,
    birthDate: Date,
    requestDate: Date,
    customReferenceDate: Date? = null,
): Double = com.equisoft.taxca.pension.getPublicPensionRequestDateFactor(
    // The average-indexation precision is irrelevant to the factor computation.
    planFromJs(plan, 0),
    birthDate.toLocalDateUtc(),
    requestDate.toLocalDateUtc(),
    customReferenceDate?.toLocalDateUtc(),
)

private fun buildMoneyPurchaseJs(): dynamic {
    val obj = js("{}")
    obj.MAX_CONTRIBUTION = MoneyPurchase.maxContribution
    return obj
}

@JsExport
val MONEY_PURCHASE: dynamic = buildMoneyPurchaseJs()

private fun buildSppJs(): dynamic {
    val obj = js("{}")
    obj.MAX_BRIDGE_BENEFIT_AGE = Spp.maxBridgeBenefitAge
    obj.MIN_AGE = Spp.minAge
    return obj
}

@JsExport
val SPP: dynamic = buildSppJs()
