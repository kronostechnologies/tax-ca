/*
 Sources
 https://www.canada.ca/en/employment-social-development/services/student-financial-aid/education-savings/resp/resp-promoters/infocapsules/bc.html

 Last updated
 2025-12-21
 */

package com.equisoft.taxca.investments.resp

// The TS source merges an interface and a const named
// `BritishColumbiaTrainingAndEducationSavingsGrant`; Kotlin forbids a top-level class
// and val sharing a name, so the class carries a `Resp` prefix.
data class RespBritishColumbiaTrainingAndEducationSavingsGrant(
    val beneficiaryAgeAllocation: Int,
    val maxGrant: Double,
) {
    // Pour simplifier, on assume que si l'enfant a > 6ans, la subvention a déjà été allouée
    // Comme on peut l'allouer une seule fois, on la donne à 6ans
    fun getTotalForAYear(beneficiaryAge: Int): Double =
        if (beneficiaryAge == beneficiaryAgeAllocation) maxGrant else 0.0
}

val BritishColumbiaTrainingAndEducationSavingsGrant: RespBritishColumbiaTrainingAndEducationSavingsGrant =
    RespBritishColumbiaTrainingAndEducationSavingsGrant(
        beneficiaryAgeAllocation = 6,
        maxGrant = 1200.0,
    )
