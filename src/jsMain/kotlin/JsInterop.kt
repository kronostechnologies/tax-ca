// Shared helpers for the JS compatibility facade: convert common Kotlin structures to
// the exact plain-JS shapes the legacy package exposed (verified by ts-compat/parity.cjs).

package com.equisoft.taxca.interop

fun yearMapToJsObject(map: Map<Int, Double>): dynamic {
    val obj = js("{}")
    for ((year, value) in map) {
        obj[year] = value
    }
    return obj
}

fun pairsToJsArray(pairs: List<Pair<Int, Double>>): Array<Array<Double>> =
    pairs.map { arrayOf(it.first.toDouble(), it.second) }.toTypedArray()

// Legacy type: number | { MIN: number, MAX: number }
fun basicPersonalAmountToJs(min: Double, max: Double, isRange: Boolean): dynamic {
    if (!isRange) {
        return min
    }
    val obj = js("{}")
    obj.MIN = min
    obj.MAX = max
    return obj
}
