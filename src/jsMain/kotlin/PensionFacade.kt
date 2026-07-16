// JS compatibility facade for src/pension (see api-baseline.md). CPP/QPP share the
// exported PublicPensionPlan class; old-age-security has its own facade elsewhere.

@file:OptIn(ExperimentalJsExport::class)
@file:Suppress("ClassName", "PropertyName", "NON_EXPORTABLE_TYPE")

import com.equisoft.taxca.interop.pairsToJsArray
import com.equisoft.taxca.interop.toLocalDateUtc
import com.equisoft.taxca.interop.yearMapToJsObject
import com.equisoft.taxca.pension.Cpp
import com.equisoft.taxca.pension.MoneyPurchase
import com.equisoft.taxca.pension.PublicPensionPlan as CommonPublicPensionPlan
import com.equisoft.taxca.pension.Qpp
import com.equisoft.taxca.pension.Spp
import kotlin.js.Date

@JsExport
class PensionableEarnings internal constructor(
    val BASIC_EXEMPTION: Double,
    val YMPE: Double,
    val YMPE_AVG_5: Double,
    val YAMPE: Double,
    val YAMPE_AVG_5: Double,
)

@JsExport
class ContributionRates internal constructor(
    val BASE: Double,
    val ENHANCEMENT_STEP_2: Double,
)

@JsExport
class DeathBenefit internal constructor(
    val RATE: Double,
)

@JsExport
class FlatBenefit internal constructor(
    val ORPHAN: Double,
    val DISABILITY: Double,
    val UNDER_45: Double,
    val UNDER_45_WITH_CHILD: Double,
    val UNDER_45_DISABLED: Double,
    val FROM_45_TO_64: Double,
    val OVER_64_WITHOUT_PENSION: Double,
)

@JsExport
class MaxPension internal constructor(
    val RETIREMENT: Double,
    val COMBINED_RETIREMENT_SURVIVOR: Double,
    val DEATH_BENEFIT: Double,
)

@JsExport
class MonthlyDelay internal constructor(
    val BONUS: Double,
    val PENALTY: Double,
)

@JsExport
class SurvivorRate internal constructor(
    val OVER_64: Double,
    val UNDER_65: Double,
)

@JsExport
class PublicPensionPlan internal constructor(
    internal val plan: CommonPublicPensionPlan,
) {
    val PENSIONABLE_EARNINGS: PensionableEarnings = PensionableEarnings(
        BASIC_EXEMPTION = plan.pensionableEarnings.basicExemption,
        YMPE = plan.pensionableEarnings.ympe,
        YMPE_AVG_5 = plan.pensionableEarnings.ympeAvg5,
        YAMPE = plan.pensionableEarnings.yampe,
        YAMPE_AVG_5 = plan.pensionableEarnings.yampeAvg5,
    )
    val CONTRIBUTION_RATES: ContributionRates = ContributionRates(
        BASE = plan.contributionRates.base,
        ENHANCEMENT_STEP_2 = plan.contributionRates.enhancementStep2,
    )
    val DEATH_BENEFIT: DeathBenefit = DeathBenefit(RATE = plan.deathBenefit.rate)
    val DEFAULT_REFERENCE_AGE: Int = plan.defaultReferenceAge
    val FLAT_BENEFIT: FlatBenefit = FlatBenefit(
        ORPHAN = plan.flatBenefit.orphan,
        DISABILITY = plan.flatBenefit.disability,
        UNDER_45 = plan.flatBenefit.under45,
        UNDER_45_WITH_CHILD = plan.flatBenefit.under45WithChild,
        UNDER_45_DISABLED = plan.flatBenefit.under45Disabled,
        FROM_45_TO_64 = plan.flatBenefit.from45To64,
        OVER_64_WITHOUT_PENSION = plan.flatBenefit.over64WithoutPension,
    )
    val INDEXATION_RATE_REFERENCES: Array<Array<Double>> = pairsToJsArray(plan.indexationRateReferences)
    val MAX_INCOME: dynamic = yearMapToJsObject(plan.maxIncome)
    val MAX_PENSION: MaxPension = MaxPension(
        RETIREMENT = plan.maxPension.retirement,
        COMBINED_RETIREMENT_SURVIVOR = plan.maxPension.combinedRetirementSurvivor,
        DEATH_BENEFIT = plan.maxPension.deathBenefit,
    )
    val MAX_REQUEST_AGE: Int = plan.maxRequestAge
    val MIN_REQUEST_AGE: Int = plan.minRequestAge
    val MONTHLY_DELAY: MonthlyDelay = MonthlyDelay(
        BONUS = plan.monthlyDelay.bonus,
        PENALTY = plan.monthlyDelay.penalty,
    )
    val REPLACEMENT_FACTOR: Double = plan.replacementFactor
    val SURVIVOR_RATES: SurvivorRate = SurvivorRate(
        OVER_64 = plan.survivorRates.over64,
        UNDER_65 = plan.survivorRates.under65,
    )
    val YEARS_TO_FULL_PENSION: Double = plan.yearsToFullPension

    fun getRequestDateFactor(birthDate: Date, requestDate: Date, customReferenceDate: Date? = null): Double =
        plan.getRequestDateFactor(
            birthDate.toLocalDateUtc(),
            requestDate.toLocalDateUtc(),
            customReferenceDate?.toLocalDateUtc(),
        )

    fun getAverageIndexationRate(): Double = plan.getAverageIndexationRate()
}

@JsExport
val CPP: PublicPensionPlan = PublicPensionPlan(Cpp)

@JsExport
val QPP: PublicPensionPlan = PublicPensionPlan(Qpp)

@JsExport
fun getPublicPensionRequestDateFactor(
    plan: PublicPensionPlan,
    birthDate: Date,
    requestDate: Date,
    customReferenceDate: Date? = null,
): Double = com.equisoft.taxca.pension.getPublicPensionRequestDateFactor(
    plan.plan,
    birthDate.toLocalDateUtc(),
    requestDate.toLocalDateUtc(),
    customReferenceDate?.toLocalDateUtc(),
)

@JsExport
class MoneyPurchasePensionPlan internal constructor(
    val MAX_CONTRIBUTION: Double,
)

@JsExport
val MONEY_PURCHASE: MoneyPurchasePensionPlan = MoneyPurchasePensionPlan(
    MAX_CONTRIBUTION = MoneyPurchase.maxContribution,
)

@JsExport
class SupplementalPensionPlan internal constructor(
    val MAX_BRIDGE_BENEFIT_AGE: Int,
    val MIN_AGE: Int,
)

@JsExport
val SPP: SupplementalPensionPlan = SupplementalPensionPlan(
    MAX_BRIDGE_BENEFIT_AGE = Spp.maxBridgeBenefitAge,
    MIN_AGE = Spp.minAge,
)
