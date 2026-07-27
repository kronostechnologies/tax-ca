package com.equisoft.taxca.utils

fun <T> maxBy(values: List<T>, mapFn: (T) -> Double): T? = values.maxByOrNull(mapFn)
