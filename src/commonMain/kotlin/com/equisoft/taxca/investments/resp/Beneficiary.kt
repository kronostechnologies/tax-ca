/*
 Sources
 https://www.canada.ca/en/services/benefits/education/education-savings/managing-plan.html

 Revised data
 2024-09-04

 Last updated
 2025-12-21
 */

package com.equisoft.taxca.investments.resp

// The TS source merges an interface and a const named `Beneficiary`; Kotlin forbids a
// top-level class and val sharing a name, so the class carries a `Resp` prefix.
data class RespBeneficiary(
    val maxAge: Int,
)

val Beneficiary: RespBeneficiary = RespBeneficiary(
    maxAge = 35,
)
