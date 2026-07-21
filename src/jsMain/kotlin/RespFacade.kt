// JS compatibility facade for src/investments/registered-education-savings-plan
// (see api-baseline.md). Root package so exports are flat, matching
// `import { RESP, Beneficiary, ... } from '@equisoft/tax-ca'`.
// Exported data consts are plain JS objects (own, enumerable, writable properties);
// method lambdas re-read the object's current property values on every call so consumer
// mutations affect computations exactly like legacy `this.X` / module-scope reads did.

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

private fun buildResp(): dynamic {
    val obj = js("{}")
    obj.MAX_CONTRIBUTION = CommonResp.maxContribution
    return obj
}

@JsExport
val RESP: dynamic = buildResp()

// ----- beneficiary.ts -----

private fun buildBeneficiary(): dynamic {
    val obj = js("{}")
    obj.MAX_AGE = CommonBeneficiary.maxAge
    return obj
}

@JsExport
val Beneficiary: dynamic = buildBeneficiary()

// ----- income-level.ts -----

// Legacy runtime shape of the TS string enum: { LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH' }.
private fun buildIncomeLevelType(): dynamic {
    val obj = js("{}")
    obj.LOW = CommonIncomeLevelType.LOW.name
    obj.MEDIUM = CommonIncomeLevelType.MEDIUM.name
    obj.HIGH = CommonIncomeLevelType.HIGH.name
    return obj
}

@JsExport
val IncomeLevelType: dynamic = buildIncomeLevelType()

private fun buildIncomeLevel(): dynamic {
    val obj = js("{}")
    obj.LOW_INCOME_THRESHOLD = CommonIncomeLevel.lowIncomeThreshold
    obj.MEDIUM_INCOME_THRESHOLD = CommonIncomeLevel.mediumIncomeThreshold
    obj.getIncomeLevel = { income: Double ->
        CommonIncomeLevel.copy(
            lowIncomeThreshold = obj.LOW_INCOME_THRESHOLD as Double,
            mediumIncomeThreshold = obj.MEDIUM_INCOME_THRESHOLD as Double,
        ).getIncomeLevel(income).name
    }
    return obj
}

@JsExport
val IncomeLevel: dynamic = buildIncomeLevel()

// ----- savings-grant.ts -----

// Rebuilds the common data class from the JS object's CURRENT properties so the method
// lambdas below honour consumer mutations (e.g. `CanadaEducationSavingsGrant.MAX_GRANT = 0`).
private fun savingsGrantFromJs(obj: dynamic): CommonSavingsGrant = CommonSavingsGrant(
    maxGrant = obj.MAX_GRANT as Double,
    maxBeneficiaryAge = obj.MAX_BENEFICIARY_AGE as Int,
    maxAmountYearlyForGrant = obj.MAX_AMOUNT_YEARLY_FOR_GRANT as Double,
    yearlyGrantPercent = obj.YEARLY_GRANT_PERCENT as Double,
    maxAmountForSuppGrant = obj.MAX_AMOUNT_FOR_SUPP_GRANT as Double,
    suppGrantPercent = CommonSuppGrantPercent(
        lowIncome = obj.SUPP_GRANT_PERCENT.LOW_INCOME as Double,
        mediumIncome = obj.SUPP_GRANT_PERCENT.MEDIUM_INCOME as Double,
    ),
)

// Property order matches the object literal returned by the legacy initializeSavingsGrant.
private fun buildSavingsGrant(common: CommonSavingsGrant): dynamic {
    val obj = js("{}")
    obj.MAX_AMOUNT_FOR_SUPP_GRANT = common.maxAmountForSuppGrant
    obj.MAX_AMOUNT_YEARLY_FOR_GRANT = common.maxAmountYearlyForGrant
    obj.MAX_BENEFICIARY_AGE = common.maxBeneficiaryAge
    obj.MAX_GRANT = common.maxGrant
    val suppGrantPercent = js("{}")
    suppGrantPercent.LOW_INCOME = common.suppGrantPercent.lowIncome
    suppGrantPercent.MEDIUM_INCOME = common.suppGrantPercent.mediumIncome
    obj.SUPP_GRANT_PERCENT = suppGrantPercent
    obj.YEARLY_GRANT_PERCENT = common.yearlyGrantPercent
    obj.getBaseGrant = { contribution: Double ->
        savingsGrantFromJs(obj).getBaseGrant(contribution)
    }
    obj.getSuppGrant = { contribution: Double, incomeLevel: String ->
        // Legacy switch falls through to 0 for anything but LOW/MEDIUM.
        val level = CommonIncomeLevelType.entries.firstOrNull { it.name == incomeLevel }
        if (level == null) 0.0 else savingsGrantFromJs(obj).getSuppGrant(contribution, level)
    }
    obj.getTotalForAYear = { income: Double,
        contribution: Double,
        totalGrantAlreadyGiven: Double?,
        beneficiaryAge: Int?,
        ->
        savingsGrantFromJs(obj).getTotalForAYear(
            income,
            contribution,
            totalGrantAlreadyGiven ?: 0.0,
            beneficiaryAge ?: 0,
        )
    }
    return obj
}

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
fun initializeSavingsGrant(SavingsGrantConfig: SavingsGrantConfigInput): dynamic =
    buildSavingsGrant(
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
val CanadaEducationSavingsGrant: dynamic = buildSavingsGrant(CommonCesg)

// ----- quebec-education-savings-incentive.ts -----

@JsExport
val QuebecEducationSavingsIncentive: dynamic = buildSavingsGrant(CommonQesi)

// ----- canada-learning-bond.ts -----

private fun buildCanadaLearningBond(): dynamic {
    val obj = js("{}")
    obj.OPENING_YEAR_CLB = CommonClb.openingYearClb
    obj.YEARLY_CLB = CommonClb.yearlyClb
    obj.MAX_BENEFICIARY_AGE = CommonClb.maxBeneficiaryAge
    obj.getTotalForAYear = { income: Double, beneficiaryAge: Int?, accountOpeningYear: Boolean? ->
        CommonClb.copy(
            openingYearClb = obj.OPENING_YEAR_CLB as Double,
            yearlyClb = obj.YEARLY_CLB as Double,
            maxBeneficiaryAge = obj.MAX_BENEFICIARY_AGE as Int,
        ).getTotalForAYear(income, beneficiaryAge ?: 0, accountOpeningYear ?: false)
    }
    return obj
}

@JsExport
val CanadaLearningBond: dynamic = buildCanadaLearningBond()

// ----- british-columbia-training-and-education-savings-grant.ts -----

private fun buildBctesg(): dynamic {
    val obj = js("{}")
    obj.BENEFICIARY_AGE_ALLOCATION = CommonBctesg.beneficiaryAgeAllocation
    obj.MAX_GRANT = CommonBctesg.maxGrant
    obj.getTotalForAYear = { beneficiaryAge: Int ->
        CommonBctesg.copy(
            beneficiaryAgeAllocation = obj.BENEFICIARY_AGE_ALLOCATION as Int,
            maxGrant = obj.MAX_GRANT as Double,
        ).getTotalForAYear(beneficiaryAge)
    }
    return obj
}

@JsExport
val BritishColumbiaTrainingAndEducationSavingsGrant: dynamic = buildBctesg()

// ----- tuition-fees.ts -----

// Legacy type: ByProvince<number> — a plain object keyed by province code.
private fun byProvinceToJsObject(map: Map<Jurisdiction, Double>): dynamic {
    val obj = js("{}")
    for ((province, value) in map) {
        obj[province.code] = value
    }
    return obj
}

private fun buildTuitionFees(): dynamic {
    val obj = js("{}")
    // Legacy property order: method first, then the data table.
    obj.getTuitionFeesByProvinceCode = { provinceCode: String ->
        // Re-read the current table so consumer mutations behave exactly like the legacy
        // `TuitionFeesData[provinceCode]` lookup (unknown codes yield undefined).
        obj.TuitionFeesData[provinceCode]
    }
    obj.TuitionFeesData = byProvinceToJsObject(CommonTuitionFees.tuitionFeesData)
    return obj
}

@JsExport
val TuitionFees: dynamic = buildTuitionFees()
