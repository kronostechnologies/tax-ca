package com.equisoft.taxca.pension

import java.math.BigDecimal

// BigDecimal views convert with valueOf (string-round-trip semantics) so JVM
// consumers get exact decimal literals; see docs/kmp-migration/phase-0-decisions.md D2.
val DefinedBenefitPensionPlan.maxContributionDecimal: BigDecimal
    get() = BigDecimal.valueOf(maxContribution)
