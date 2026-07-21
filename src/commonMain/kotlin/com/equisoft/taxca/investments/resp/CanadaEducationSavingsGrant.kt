/*
 Sources
 https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/registered-education-savings-plans-resps/canada-education-savings-programs-cesp/canada-education-savings-grant-cesg.html

 Last updated
 2025-12-21
 */

package com.equisoft.taxca.investments.resp

val CanadaEducationSavingsGrant: SavingsGrant = SavingsGrant(
    maxGrant = 7200.0,
    maxBeneficiaryAge = 17,
    maxAmountYearlyForGrant = 2500.0,
    yearlyGrantPercent = 0.2,
    maxAmountForSuppGrant = 500.0,
    suppGrantPercent = SuppGrantPercent(
        lowIncome = 0.2,
        mediumIncome = 0.1,
    ),
)
