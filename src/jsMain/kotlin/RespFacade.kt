// JS compatibility facade for src/investments/registered-education-savings-plan
// (see api-baseline.md). Root package so exports are flat, matching
// `import { RESP, Beneficiary, ... } from '@equisoft/tax-ca'`.

@file:OptIn(ExperimentalJsExport::class)
@file:Suppress("ClassName", "PropertyName", "NON_EXPORTABLE_TYPE")

import com.equisoft.taxca.investments.resp.Beneficiary as CommonBeneficiary
import com.equisoft.taxca.investments.resp.BritishColumbiaTrainingAndEducationSavingsGrant as CommonBctesg
import com.equisoft.taxca.investments.resp.CanadaEducationSavingsGrant as CommonCesg
import com.equisoft.taxca.investments.resp.CanadaLearningBond as CommonClb
import com.equisoft.taxca.investments.resp.IncomeLevel as CommonIncomeLevel
import com.equisoft.taxca.investments.resp.IncomeLevelType as CommonIncomeLevelType
import com.equisoft.taxca.investments.resp.QuebecEducationSavingsIncentive as CommonQesi
import com.equisoft.taxca.investments.resp.Resp as CommonResp
import com.equisoft.taxca.investments.resp.SavingsGrant as CommonSavingsGrant
import com.equisoft.taxca.investments.resp.SuppGrantPercent as CommonSuppGrantPercent
import com.equisoft.taxca.investments.resp.TuitionFees as CommonTuitionFees
import com.equisoft.taxca.misc.Jurisdiction

// ----- index.ts -----

@JsExport
class RegisteredEducationSavingsPlan internal constructor(
    val MAX_CONTRIBUTION: Double,
)

@JsExport
val RESP: RegisteredEducationSavingsPlan = RegisteredEducationSavingsPlan(
    MAX_CONTRIBUTION = CommonResp.maxContribution,
)

// ----- beneficiary.ts -----

@JsExport
class RespBeneficiary internal constructor(
    val MAX_AGE: Int,
)

@JsExport
val Beneficiary: RespBeneficiary = RespBeneficiary(
    MAX_AGE = CommonBeneficiary.maxAge,
)

// ----- income-level.ts -----

// Legacy runtime shape of the TS string enum: { LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH' }.
@JsExport
class RespIncomeLevelType internal constructor(
    val LOW: String,
    val MEDIUM: String,
    val HIGH: String,
)

@JsExport
val IncomeLevelType: RespIncomeLevelType = RespIncomeLevelType(
    LOW = CommonIncomeLevelType.LOW.name,
    MEDIUM = CommonIncomeLevelType.MEDIUM.name,
    HIGH = CommonIncomeLevelType.HIGH.name,
)

@JsExport
class RespIncomeLevel internal constructor(
    val LOW_INCOME_THRESHOLD: Double,
    val MEDIUM_INCOME_THRESHOLD: Double,
) {
    fun getIncomeLevel(income: Double): String = CommonIncomeLevel.getIncomeLevel(income).name
}

@JsExport
val IncomeLevel: RespIncomeLevel = RespIncomeLevel(
    LOW_INCOME_THRESHOLD = CommonIncomeLevel.lowIncomeThreshold,
    MEDIUM_INCOME_THRESHOLD = CommonIncomeLevel.mediumIncomeThreshold,
)

// ----- savings-grant.ts -----

@JsExport
class SuppGrantPercent internal constructor(
    val LOW_INCOME: Double,
    val MEDIUM_INCOME: Double,
)

@JsExport
class SavingsGrant internal constructor(
    val MAX_GRANT: Double,
    val MAX_BENEFICIARY_AGE: Int,
    val MAX_AMOUNT_YEARLY_FOR_GRANT: Double,
    val YEARLY_GRANT_PERCENT: Double,
    val MAX_AMOUNT_FOR_SUPP_GRANT: Double,
    val SUPP_GRANT_PERCENT: SuppGrantPercent,
    private val common: CommonSavingsGrant,
) {
    fun getBaseGrant(contribution: Double): Double = common.getBaseGrant(contribution)

    fun getSuppGrant(contribution: Double, incomeLevel: String): Double {
        // Legacy switch falls through to 0 for anything but LOW/MEDIUM.
        val level = CommonIncomeLevelType.entries.firstOrNull { it.name == incomeLevel }
            ?: return 0.0
        return common.getSuppGrant(contribution, level)
    }

    fun getTotalForAYear(
        income: Double,
        contribution: Double,
        totalGrantAlreadyGiven: Double = 0.0,
        beneficiaryAge: Int = 0,
    ): Double = common.getTotalForAYear(income, contribution, totalGrantAlreadyGiven, beneficiaryAge)
}

private fun savingsGrantToJs(common: CommonSavingsGrant): SavingsGrant = SavingsGrant(
    MAX_GRANT = common.maxGrant,
    MAX_BENEFICIARY_AGE = common.maxBeneficiaryAge,
    MAX_AMOUNT_YEARLY_FOR_GRANT = common.maxAmountYearlyForGrant,
    YEARLY_GRANT_PERCENT = common.yearlyGrantPercent,
    MAX_AMOUNT_FOR_SUPP_GRANT = common.maxAmountForSuppGrant,
    SUPP_GRANT_PERCENT = SuppGrantPercent(
        LOW_INCOME = common.suppGrantPercent.lowIncome,
        MEDIUM_INCOME = common.suppGrantPercent.mediumIncome,
    ),
    common = common,
)

// Plain-JS input shapes for initializeSavingsGrant (consumer objects are not Kotlin classes).
external interface SuppGrantPercentInput {
    val LOW_INCOME: Double
    val MEDIUM_INCOME: Double
}

external interface SavingsGrantConfigInput {
    val MAX_GRANT: Double
    val MAX_BENEFICIARY_AGE: Int
    val MAX_AMOUNT_YEARLY_FOR_GRANT: Double
    val YEARLY_GRANT_PERCENT: Double
    val MAX_AMOUNT_FOR_SUPP_GRANT: Double
    val SUPP_GRANT_PERCENT: SuppGrantPercentInput
}

@JsExport
fun initializeSavingsGrant(SavingsGrantConfig: SavingsGrantConfigInput): SavingsGrant =
    savingsGrantToJs(
        CommonSavingsGrant(
            maxGrant = SavingsGrantConfig.MAX_GRANT,
            maxBeneficiaryAge = SavingsGrantConfig.MAX_BENEFICIARY_AGE,
            maxAmountYearlyForGrant = SavingsGrantConfig.MAX_AMOUNT_YEARLY_FOR_GRANT,
            yearlyGrantPercent = SavingsGrantConfig.YEARLY_GRANT_PERCENT,
            maxAmountForSuppGrant = SavingsGrantConfig.MAX_AMOUNT_FOR_SUPP_GRANT,
            suppGrantPercent = CommonSuppGrantPercent(
                lowIncome = SavingsGrantConfig.SUPP_GRANT_PERCENT.LOW_INCOME,
                mediumIncome = SavingsGrantConfig.SUPP_GRANT_PERCENT.MEDIUM_INCOME,
            ),
        ),
    )

// ----- canada-education-savings-grant.ts -----

@JsExport
val CanadaEducationSavingsGrant: SavingsGrant = savingsGrantToJs(CommonCesg)

// ----- quebec-education-savings-incentive.ts -----

@JsExport
val QuebecEducationSavingsIncentive: SavingsGrant = savingsGrantToJs(CommonQesi)

// ----- canada-learning-bond.ts -----

@JsExport
class RespCanadaLearningBond internal constructor(
    val OPENING_YEAR_CLB: Double,
    val YEARLY_CLB: Double,
    val MAX_BENEFICIARY_AGE: Int,
) {
    fun getTotalForAYear(income: Double, beneficiaryAge: Int = 0, accountOpeningYear: Boolean = false): Double =
        CommonClb.getTotalForAYear(income, beneficiaryAge, accountOpeningYear)
}

@JsExport
val CanadaLearningBond: RespCanadaLearningBond = RespCanadaLearningBond(
    OPENING_YEAR_CLB = CommonClb.openingYearClb,
    YEARLY_CLB = CommonClb.yearlyClb,
    MAX_BENEFICIARY_AGE = CommonClb.maxBeneficiaryAge,
)

// ----- british-columbia-training-and-education-savings-grant.ts -----

@JsExport
class RespBritishColumbiaTrainingAndEducationSavingsGrant internal constructor(
    val BENEFICIARY_AGE_ALLOCATION: Int,
    val MAX_GRANT: Double,
) {
    fun getTotalForAYear(beneficiaryAge: Int): Double = CommonBctesg.getTotalForAYear(beneficiaryAge)
}

@JsExport
val BritishColumbiaTrainingAndEducationSavingsGrant: RespBritishColumbiaTrainingAndEducationSavingsGrant =
    RespBritishColumbiaTrainingAndEducationSavingsGrant(
        BENEFICIARY_AGE_ALLOCATION = CommonBctesg.beneficiaryAgeAllocation,
        MAX_GRANT = CommonBctesg.maxGrant,
    )

// ----- tuition-fees.ts -----

// Legacy type: ByProvince<number> — a plain object keyed by province code.
private fun byProvinceToJsObject(map: Map<Jurisdiction, Double>): dynamic {
    val obj = js("{}")
    for ((province, value) in map) {
        obj[province.code] = value
    }
    return obj
}

@JsExport
class RespTuitionFees internal constructor(
    val TuitionFeesData: dynamic,
) {
    fun getTuitionFeesByProvinceCode(provinceCode: String): Double =
        CommonTuitionFees.getTuitionFeesByProvinceCode(Jurisdiction.fromCode(provinceCode))
}

@JsExport
val TuitionFees: RespTuitionFees = RespTuitionFees(
    TuitionFeesData = byProvinceToJsObject(CommonTuitionFees.tuitionFeesData),
)
