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

private fun buildReturnRates(): dynamic {
    val obj = js("{}")
    obj.SHORT_TERM = CommonIpf.returnRates.shortTerm
    obj.FIXED_INCOME = CommonIpf.returnRates.fixedIncome
    obj.CANADIAN_EQUITIES = CommonIpf.returnRates.canadianEquities
    obj.US_EQUITIES = CommonIpf.returnRates.usEquities
    // Deprecated legacy alias: same value as FOREIGN_DEVELOPED_MARKET_EQUITIES.
    obj.INTL_DEVELOPED_MARKET_EQUITIES = CommonIpf.returnRates.foreignDevelopedMarketEquities
    obj.FOREIGN_DEVELOPED_MARKET_EQUITIES = CommonIpf.returnRates.foreignDevelopedMarketEquities
    obj.EMERGING_MARKET_EQUITIES = CommonIpf.returnRates.emergingMarketEquities
    obj.CONSERVATIVE_PORTFOLIO = CommonIpf.returnRates.conservativePortfolio
    obj.BALANCED_PORTFOLIO = CommonIpf.returnRates.balancedPortfolio
    obj.DYNAMIC_PORTFOLIO = CommonIpf.returnRates.dynamicPortfolio
    return obj
}

private fun buildIpf(): dynamic {
    val obj = js("{}")
    obj.INFLATION = CommonIpf.inflation
    obj.PERFORMANCE_RATE = CommonIpf.performanceRate
    obj.YMPE_GROWTH_RATE = CommonIpf.ympeGrowthRate
    obj.RETURN_RATES = buildReturnRates()
    obj.BORROWING_RATE = CommonIpf.borrowingRate
    return obj
}

@JsExport
val IPF: dynamic = buildIpf()

// life-expectancy

private fun ageMapToJsObject(map: Map<Int, Int>): dynamic {
    val obj = js("{}")
    for ((age, value) in map) {
        obj[age] = value
    }
    return obj
}

private fun buildLifeExpectancy(): dynamic {
    val obj = js("{}")
    obj.MALE = ageMapToJsObject(CommonLifeExpectancy.male)
    obj.FEMALE = ageMapToJsObject(CommonLifeExpectancy.female)
    return obj
}

@JsExport
val LIFE_EXPECTANCY: dynamic = buildLifeExpectancy()

// ppp-increase-factor

private fun buildPppIncreaseFactor(): dynamic {
    val obj = js("{}")
    obj.FIRST_YEAR = CommonPppIncreaseFactor.firstYear
    obj.SECOND_YEAR = CommonPppIncreaseFactor.secondYear
    obj.THIRD_YEAR = CommonPppIncreaseFactor.thirdYear
    obj.FOURTH_YEAR = CommonPppIncreaseFactor.fourthYear
    obj.FIFTH_YEAR = CommonPppIncreaseFactor.fifthYear
    obj.SIXTH_YEAR = CommonPppIncreaseFactor.sixthYear
    obj.SEVENTH_YEAR = CommonPppIncreaseFactor.seventhYear
    return obj
}

@JsExport
val PPP_INCREASE_FACTOR: dynamic = buildPppIncreaseFactor()
