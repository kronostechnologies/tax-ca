package com.equisoft.taxca.pension

import java.math.BigDecimal
import kotlin.test.Test
import kotlin.test.assertEquals

class DefinedBenefitPensionPlanViewsTest {
    @Test
    fun bigDecimalViewPreservesDecimalLiteral() {
        assertEquals(BigDecimal("3932.22"), DefinedBenefit.maxContributionDecimal)
    }
}
