package com.equisoft.taxca.jvm

import java.math.BigDecimal

/**
 * Canonical Double -> BigDecimal conversion for JVM consumers (decision D2 of the KMP
 * migration, docs/kmp-migration/phase-0-decisions.md).
 *
 * `BigDecimal.valueOf` uses `Double.toString` semantics, so tax constants round-trip to
 * their exact decimal literals (0.0595 -> BigDecimal("0.0595")), not binary noise.
 * Keeping the conversion here means every JVM consumer applies the same audited policy.
 */
fun Double.toDecimal(): BigDecimal = BigDecimal.valueOf(this)
