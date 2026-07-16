// JS compatibility facade: reproduces the public API of the legacy TypeScript
// package (docs/kmp-migration/api-baseline.md). Files in this source set use the
// root package so exports are flat, matching `import { ... } from '@equisoft/tax-ca'`.

@file:OptIn(ExperimentalJsExport::class)
@file:Suppress("ClassName", "PropertyName", "NON_EXPORTABLE_TYPE")

import com.equisoft.taxca.pension.DefinedBenefit
import com.equisoft.taxca.utils.clamp as commonClamp
import com.equisoft.taxca.utils.roundToPrecision as commonRoundToPrecision

@JsExport
fun clamp(num: Double, min: Double, max: Double): Double = commonClamp(num, min, max)

@JsExport
fun roundToPrecision(value: Double, precision: Int = 0): Double = commonRoundToPrecision(value, precision)

@JsExport
class DefinedBenefitPensionPlan internal constructor(
    val MAX_CONTRIBUTION: Double,
)

@JsExport
val DEFINED_BENEFIT: DefinedBenefitPensionPlan = DefinedBenefitPensionPlan(
    MAX_CONTRIBUTION = DefinedBenefit.maxContribution,
)
