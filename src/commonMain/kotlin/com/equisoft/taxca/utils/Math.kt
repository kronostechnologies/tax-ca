package com.equisoft.taxca.utils

import kotlin.math.floor
import kotlin.math.pow

fun clamp(num: Double, min: Double, max: Double): Double {
    if (num <= min) {
        return min
    }
    return if (num >= max) max else num
}

fun roundToPrecision(value: Double, precision: Int = 0): Double {
    if (value.isNaN()) {
        return 0.0
    }
    val factor = 10.0.pow(precision)
    // floor(x + 0.5) matches JS Math.round (ties toward +Infinity), unlike
    // kotlin.math.round which rounds ties away from zero for negative values.
    return floor(value * factor + 0.5) / factor
}
