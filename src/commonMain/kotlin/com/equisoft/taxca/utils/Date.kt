package com.equisoft.taxca.utils

import kotlinx.datetime.LocalDate
import kotlinx.datetime.number

fun getMonthsDiff(firstDate: LocalDate, secondDate: LocalDate): Int {
    val monthsDiff = secondDate.month.number - firstDate.month.number
    val yearsDiff = secondDate.year - firstDate.year

    return monthsDiff + (12 * yearsDiff) - (if (secondDate.day < firstDate.day) 1 else 0)
}

fun addYearsToDate(date: LocalDate, years: Int): LocalDate {
    val targetYear = date.year + years
    // JS Date.setUTCFullYear overflows Feb 29 into Mar 1 on non-leap years; kotlinx's
    // date arithmetic clamps to Feb 28 instead, so build the date explicitly.
    return if (date.month.number == 2 && date.day == 29 && !isLeapYear(targetYear)) {
        LocalDate(targetYear, 3, 1)
    } else {
        LocalDate(targetYear, date.month, date.day)
    }
}

// Age truncates toward zero (JS Math.trunc), which Kotlin Int division also does.
fun getAge(birthDate: LocalDate, atDate: LocalDate): Int = getMonthsDiff(birthDate, atDate) / 12

private fun isLeapYear(year: Int): Boolean = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
