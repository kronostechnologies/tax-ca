package com.equisoft.taxca.investments.resp

data class RegisteredEducationSavingsPlan(
    val maxContribution: Double,
)

val Resp: RegisteredEducationSavingsPlan = RegisteredEducationSavingsPlan(
    maxContribution = 50000.0,
)
