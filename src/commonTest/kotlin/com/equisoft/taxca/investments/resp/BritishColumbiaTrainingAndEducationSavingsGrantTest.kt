package com.equisoft.taxca.investments.resp

import kotlin.test.Test
import kotlin.test.assertEquals

class BritishColumbiaTrainingAndEducationSavingsGrantTest {
    @Test
    fun shouldGiveMaxGrantAtBeneficiaryAgeAllocation() {
        val result = BritishColumbiaTrainingAndEducationSavingsGrant.getTotalForAYear(
            BritishColumbiaTrainingAndEducationSavingsGrant.beneficiaryAgeAllocation,
        )
        assertEquals(BritishColumbiaTrainingAndEducationSavingsGrant.maxGrant, result)
    }

    @Test
    fun shouldNotGiveMaxGrantIfBeneficiaryAgeAboveBeneficiaryAgeAllocation() {
        val result = BritishColumbiaTrainingAndEducationSavingsGrant.getTotalForAYear(
            BritishColumbiaTrainingAndEducationSavingsGrant.beneficiaryAgeAllocation + 1,
        )
        assertEquals(0.0, result)
    }

    @Test
    fun shouldNotGiveMaxGrantIfBeneficiaryAgeBelowBeneficiaryAgeAllocation() {
        val result = BritishColumbiaTrainingAndEducationSavingsGrant.getTotalForAYear(
            BritishColumbiaTrainingAndEducationSavingsGrant.beneficiaryAgeAllocation - 1,
        )
        assertEquals(0.0, result)
    }
}
