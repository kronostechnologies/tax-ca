/*
Sources
https://institutpf.org/assets/Documents/Normes-projection/InstitutPF-NHP-feuillet_fr.pdf

Revised
2026-04-23
*/

package com.equisoft.taxca.misc

data class ReturnRates(
    val shortTerm: Double,
    val fixedIncome: Double,
    val canadianEquities: Double,
    val usEquities: Double,
    val foreignDevelopedMarketEquities: Double,
    val emergingMarketEquities: Double,
    val conservativePortfolio: Double,
    val balancedPortfolio: Double,
    val dynamicPortfolio: Double,
)

data class IPFStatistics(
    val inflation: Double,
    val performanceRate: Double,
    val ympeGrowthRate: Double,
    val returnRates: ReturnRates,
    val borrowingRate: Double,
)

val Ipf: IPFStatistics = IPFStatistics(
    inflation = 0.021,
    performanceRate = 0.01,
    ympeGrowthRate = 0.031,
    returnRates = ReturnRates(
        shortTerm = 0.024,
        fixedIncome = 0.032,
        canadianEquities = 0.063,
        usEquities = 0.064,
        foreignDevelopedMarketEquities = 0.066,
        emergingMarketEquities = 0.075,
        conservativePortfolio = 0.027,
        balancedPortfolio = 0.034,
        dynamicPortfolio = 0.044,
    ),
    borrowingRate = 0.044,
)
