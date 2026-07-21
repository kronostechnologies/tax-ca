package com.equisoft.taxca.investments.resp

val QuebecEducationSavingsIncentive: SavingsGrant = SavingsGrant(
    maxGrant = 3600.0,
    maxBeneficiaryAge = 17,
    maxAmountYearlyForGrant = 2500.0,
    yearlyGrantPercent = 0.1,
    maxAmountForSuppGrant = 500.0,
    suppGrantPercent = SuppGrantPercent(
        lowIncome = 0.1,
        mediumIncome = 0.05,
    ),
)
