// JS Date <-> LocalDate boundary conversions for the compatibility facade.
// The legacy API reads dates through UTC accessors, so conversions use UTC fields.

package com.equisoft.taxca.interop

import kotlin.js.Date
import kotlinx.datetime.LocalDate

fun Date.toLocalDateUtc(): LocalDate = LocalDate(getUTCFullYear(), getUTCMonth() + 1, getUTCDate())
