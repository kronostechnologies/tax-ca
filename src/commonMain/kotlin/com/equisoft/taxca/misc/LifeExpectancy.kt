/*
Sources
    http://app.iqpf.org/?locale=en#/guidelines/life-expectancy

Revised
    2022-04-30
*/

package com.equisoft.taxca.misc

data class CombinedLifeExpectancy(
    val male: Map<Int, Int>,
    val female: Map<Int, Int>,
)

val LifeExpectancy: CombinedLifeExpectancy = CombinedLifeExpectancy(
    male = mapOf(
        0 to 95,
        5 to 95,
        10 to 95,
        15 to 95,
        20 to 95,
        25 to 95,
        30 to 95,
        35 to 94,
        40 to 94,
        45 to 94,
        50 to 94,
        55 to 94,
        60 to 94,
        65 to 94,
        70 to 94,
        75 to 94,
        80 to 94,
        85 to 95,
        90 to 96,
        95 to 99,
        100 to 102,
    ),
    female = mapOf(
        0 to 97,
        5 to 97,
        10 to 97,
        15 to 97,
        20 to 97,
        25 to 97,
        30 to 97,
        35 to 97,
        40 to 97,
        45 to 96,
        50 to 96,
        55 to 96,
        60 to 96,
        65 to 96,
        70 to 96,
        75 to 96,
        80 to 96,
        85 to 97,
        90 to 98,
        95 to 100,
        100 to 103,
    ),
)
