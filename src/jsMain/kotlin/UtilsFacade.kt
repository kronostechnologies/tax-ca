// JS compatibility facade for src/utils (see api-baseline.md).

@file:OptIn(ExperimentalJsExport::class)

import com.equisoft.taxca.interop.toLocalDateUtc
import com.equisoft.taxca.utils.getAge as commonGetAge
import com.equisoft.taxca.utils.getMonthsDiff as commonGetMonthsDiff
import com.equisoft.taxca.utils.maxBy as commonMaxBy
import kotlin.js.Date

@JsExport
fun getMonthsDiff(firstDate: Date, secondDate: Date): Int =
    commonGetMonthsDiff(firstDate.toLocalDateUtc(), secondDate.toLocalDateUtc())

@JsExport
fun addYearsToDate(date: Date, years: Int): Date {
    // Legacy behavior preserves the time-of-day and lets setUTCFullYear overflow
    // Feb 29 -> Mar 1, so this stays a pure JS-Date operation.
    val newDate = Date(date.getTime())
    newDate.asDynamic().setUTCFullYear(date.getUTCFullYear() + years)
    return newDate
}

@JsExport
fun now(): Date {
    // Legacy test hook: jest runs pin the clock via NODE_ENV.
    val isTest = js("typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test'") as Boolean
    return if (isTest) Date("2020-01-01T12:00:00Z") else Date()
}

@JsExport
fun resetTime(date: Date): Date = Date(date.getFullYear(), date.getMonth(), date.getDate())

@JsExport
fun getAge(birthDate: Date, atDate: Date = now()): Int =
    commonGetAge(birthDate.toLocalDateUtc(), atDate.toLocalDateUtc())

@JsExport
fun <T> maxBy(values: Array<T>, mapFn: (T) -> Double): T? = commonMaxBy(values.toList(), mapFn)
