package com.equisoft.taxca.misc

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

// The legacy TS files have no jest specs; these are sanity spot-checks of the
// first/last entries of each ported data structure.
class MiscDataTest {
    @Test
    fun consumerPriceIndexShouldContainAllYears() {
        assertEquals(16, ConsumerPriceIndex.size)
        assertEquals((2009..2024).toList(), ConsumerPriceIndex.keys.sorted())
    }

    @Test
    fun consumerPriceIndexShouldMatchFirstAndLastEntries() {
        val firstYear = assertNotNull(ConsumerPriceIndex[2009])
        assertEquals(113.0, firstYear.jan)
        assertEquals(114.8, firstYear.dec)

        val lastYear = assertNotNull(ConsumerPriceIndex[2024])
        assertEquals(158.3, lastYear.jan)
        // DEC is estimated using NOV
        assertEquals(161.8, lastYear.nov)
        assertEquals(161.8, lastYear.dec)
    }

    @Test
    fun ipfShouldMatchPublishedStatistics() {
        assertEquals(0.021, Ipf.inflation)
        assertEquals(0.01, Ipf.performanceRate)
        assertEquals(0.031, Ipf.ympeGrowthRate)
        assertEquals(0.044, Ipf.borrowingRate)
    }

    @Test
    fun ipfReturnRatesShouldMatchPublishedStatistics() {
        assertEquals(0.024, Ipf.returnRates.shortTerm)
        assertEquals(0.066, Ipf.returnRates.foreignDevelopedMarketEquities)
        assertEquals(0.044, Ipf.returnRates.dynamicPortfolio)
    }

    @Test
    fun lifeExpectancyShouldMatchFirstAndLastEntries() {
        assertEquals(21, LifeExpectancy.male.size)
        assertEquals(21, LifeExpectancy.female.size)

        assertEquals(95, LifeExpectancy.male[0])
        assertEquals(102, LifeExpectancy.male[100])

        assertEquals(97, LifeExpectancy.female[0])
        assertEquals(103, LifeExpectancy.female[100])
    }

    @Test
    fun pppIncreaseFactorShouldMatchFirstAndLastEntries() {
        assertEquals(0.84, PppIncreaseFactor.firstYear)
        assertEquals(0.84, PppIncreaseFactor.seventhYear)
    }
}
