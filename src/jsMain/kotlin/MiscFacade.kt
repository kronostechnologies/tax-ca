// JS compatibility facade for src/misc (see api-baseline.md).

@file:OptIn(ExperimentalJsExport::class)
@file:Suppress("ClassName", "PropertyName", "NON_EXPORTABLE_TYPE")

import com.equisoft.taxca.misc.Jurisdiction
import com.equisoft.taxca.misc.MonthlyConsumerPriceIndex
import com.equisoft.taxca.misc.ConsumerPriceIndex as CommonConsumerPriceIndex
import com.equisoft.taxca.misc.Ipf as CommonIpf
import com.equisoft.taxca.misc.LifeExpectancy as CommonLifeExpectancy
import com.equisoft.taxca.misc.PppIncreaseFactor as CommonPppIncreaseFactor

// code-types

@JsExport
val PROVINCIAL_CODES: dynamic = run {
    val obj = js("{}")
    for (province in Jurisdiction.provinces) {
        obj[province.jurisdictionName] = province.code
    }
    obj
}

@JsExport
val FEDERAL_CODE: String = Jurisdiction.CA.code

// consumer-price-index

private fun monthlyConsumerPriceIndexToJs(months: MonthlyConsumerPriceIndex): dynamic {
    val obj = js("{}")
    obj.JAN = months.jan
    obj.FEB = months.feb
    obj.MAR = months.mar
    obj.APR = months.apr
    obj.MAY = months.may
    obj.JUN = months.jun
    obj.JUL = months.jul
    obj.AUG = months.aug
    obj.SEP = months.sep
    obj.OCT = months.oct
    obj.NOV = months.nov
    obj.DEC = months.dec
    return obj
}

@JsExport
val CONSUMER_PRICE_INDEX: dynamic = run {
    val obj = js("{}")
    for ((year, months) in CommonConsumerPriceIndex) {
        obj[year] = monthlyConsumerPriceIndexToJs(months)
    }
    obj
}

// ipf-stats

@JsExport
class ReturnRates internal constructor(
    val SHORT_TERM: Double,
    val FIXED_INCOME: Double,
    val CANADIAN_EQUITIES: Double,
    val US_EQUITIES: Double,
    @Deprecated("Use FOREIGN_DEVELOPED_MARKET_EQUITIES instead. Will be removed in a future version.")
    val INTL_DEVELOPED_MARKET_EQUITIES: Double,
    val FOREIGN_DEVELOPED_MARKET_EQUITIES: Double,
    val EMERGING_MARKET_EQUITIES: Double,
    val CONSERVATIVE_PORTFOLIO: Double,
    val BALANCED_PORTFOLIO: Double,
    val DYNAMIC_PORTFOLIO: Double,
)

@JsExport
class IPFStatistics internal constructor(
    val INFLATION: Double,
    val PERFORMANCE_RATE: Double,
    val YMPE_GROWTH_RATE: Double,
    val RETURN_RATES: ReturnRates,
    val BORROWING_RATE: Double,
)

@JsExport
val IPF: IPFStatistics = IPFStatistics(
    INFLATION = CommonIpf.inflation,
    PERFORMANCE_RATE = CommonIpf.performanceRate,
    YMPE_GROWTH_RATE = CommonIpf.ympeGrowthRate,
    RETURN_RATES = ReturnRates(
        SHORT_TERM = CommonIpf.returnRates.shortTerm,
        FIXED_INCOME = CommonIpf.returnRates.fixedIncome,
        CANADIAN_EQUITIES = CommonIpf.returnRates.canadianEquities,
        US_EQUITIES = CommonIpf.returnRates.usEquities,
        // Deprecated legacy alias: same value as FOREIGN_DEVELOPED_MARKET_EQUITIES.
        INTL_DEVELOPED_MARKET_EQUITIES = CommonIpf.returnRates.foreignDevelopedMarketEquities,
        FOREIGN_DEVELOPED_MARKET_EQUITIES = CommonIpf.returnRates.foreignDevelopedMarketEquities,
        EMERGING_MARKET_EQUITIES = CommonIpf.returnRates.emergingMarketEquities,
        CONSERVATIVE_PORTFOLIO = CommonIpf.returnRates.conservativePortfolio,
        BALANCED_PORTFOLIO = CommonIpf.returnRates.balancedPortfolio,
        DYNAMIC_PORTFOLIO = CommonIpf.returnRates.dynamicPortfolio,
    ),
    BORROWING_RATE = CommonIpf.borrowingRate,
)

// life-expectancy

private fun ageMapToJsObject(map: Map<Int, Int>): dynamic {
    val obj = js("{}")
    for ((age, value) in map) {
        obj[age] = value
    }
    return obj
}

@JsExport
class CombinedLifeExpectancy internal constructor(
    val MALE: dynamic,
    val FEMALE: dynamic,
)

@JsExport
val LIFE_EXPECTANCY: CombinedLifeExpectancy = CombinedLifeExpectancy(
    MALE = ageMapToJsObject(CommonLifeExpectancy.male),
    FEMALE = ageMapToJsObject(CommonLifeExpectancy.female),
)

// ppp-increase-factor

@JsExport
class PPPIncreaseFactor internal constructor(
    val FIRST_YEAR: Double,
    val SECOND_YEAR: Double,
    val THIRD_YEAR: Double,
    val FOURTH_YEAR: Double,
    val FIFTH_YEAR: Double,
    val SIXTH_YEAR: Double,
    val SEVENTH_YEAR: Double,
)

@JsExport
val PPP_INCREASE_FACTOR: PPPIncreaseFactor = PPPIncreaseFactor(
    FIRST_YEAR = CommonPppIncreaseFactor.firstYear,
    SECOND_YEAR = CommonPppIncreaseFactor.secondYear,
    THIRD_YEAR = CommonPppIncreaseFactor.thirdYear,
    FOURTH_YEAR = CommonPppIncreaseFactor.fourthYear,
    FIFTH_YEAR = CommonPppIncreaseFactor.fifthYear,
    SIXTH_YEAR = CommonPppIncreaseFactor.sixthYear,
    SEVENTH_YEAR = CommonPppIncreaseFactor.seventhYear,
)
