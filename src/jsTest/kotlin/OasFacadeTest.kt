import kotlin.js.Date
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertTrue

class OasFacadeTest {
    @Test
    fun validateRequestDateEnforcesBothInclusiveResidencyAdjustedBounds() {
        val birthDate = Date("1980-01-15T00:00:00Z")

        assertFailsWith<IllegalArgumentException> {
            OAS.validateRequestDate(Date("2048-01-14T23:59:59Z"), birthDate, 40)
        }
        OAS.validateRequestDate(Date("2048-01-15T00:00:00Z"), birthDate, 40)
        OAS.validateRequestDate(Date("2078-01-15T23:59:59Z"), birthDate, 40)
        assertFailsWith<IllegalArgumentException> {
            OAS.validateRequestDate(Date("2078-01-16T00:00:00Z"), birthDate, 40)
        }
    }

    @Test
    fun shouldApplyAgeIncreaseAfterOneCompleteMonthForPartialResidency() {
        val birthDate = Date("1980-12-31T12:00:00Z")
        val requestDates = listOf(
            Date("2055-12-31T12:00:00Z") to 1.0,
            Date("2056-01-01T00:00:00Z") to 1.0,
            Date("2056-01-30T12:00:00Z") to 1.0,
            Date("2056-01-31T00:00:00Z") to 1.1,
            Date("2056-02-01T00:00:00Z") to 1.1,
        )

        for ((requestDate, increaseFactor) in requestDates) {
            val yearsOutsideCanada = 27
            val residencyYears =
                OAS.getResidencyYearsAtRequest(birthDate, requestDate, yearsOutsideCanada) as Int
            val baseAmount =
                (OAS.MONTHLY_PAYMENT_MAX as Double) * (residencyYears.toDouble() / (OAS.MAX_RESIDENCY as Int))

            val result = OAS.getMonthlyOASAmount(birthDate, requestDate, yearsOutsideCanada) as Double

            assertEquals(baseAmount * increaseFactor, result)
            assertEquals("1980-12-31T12:00:00.000Z", birthDate.toISOString())
        }
    }

    @Test
    fun deferredMonthsReturnsZeroBeforeMinimumRequestDate() {
        val birthDate = Date("1980-01-01T00:00:00Z")

        assertEquals(0, OAS.getRequestDateMonthsDeferred(birthDate, Date("2044-01-01T00:00:00Z"), 0) as Int)
        assertEquals(0, OAS.getRequestDateMonthsDeferred(birthDate, Date("2047-12-31T00:00:00Z"), 40) as Int)
    }

    @Test
    fun monthlyAmountRespectsInclusiveResidencyAdjustedBounds() {
        val birthDate = Date("1980-01-15T00:00:00Z")
        data class Case(val yearsOutside: Int, val minYear: Int, val maxYear: Int)

        for ((yearsOutside, minYear, maxYear) in listOf(
            Case(0, 2045, 2050),
            Case(10, 2045, 2050),
            Case(40, 2048, 2078),
        )) {
            assertEquals(0.0, OAS.getMonthlyOASAmount(birthDate, Date("$minYear-01-14T00:00:00Z"), yearsOutside) as Double)
            assertTrue((OAS.getMonthlyOASAmount(birthDate, Date("$minYear-01-15T00:00:00Z"), yearsOutside) as Double) > 0.0)
            assertTrue((OAS.getMonthlyOASAmount(birthDate, Date("$maxYear-01-15T00:00:00Z"), yearsOutside) as Double) > 0.0)
            assertEquals(0.0, OAS.getMonthlyOASAmount(birthDate, Date("$maxYear-01-16T00:00:00Z"), yearsOutside) as Double)
        }
    }

    @Test
    fun monthlyAmountReadsMutatedAgeLimits() {
        val originalMinAge = OAS.MIN_AGE as Int
        val originalMaxAge = OAS.MAX_AGE as Int
        val birthDate = Date("1980-01-15T00:00:00Z")

        try {
            OAS.MIN_AGE = 66
            OAS.MAX_AGE = 71

            assertEquals(0.0, OAS.getMonthlyOASAmount(birthDate, Date("2046-01-14T00:00:00Z"), 0) as Double)
            assertTrue((OAS.getMonthlyOASAmount(birthDate, Date("2046-01-15T00:00:00Z"), 0) as Double) > 0.0)
            assertTrue((OAS.getMonthlyOASAmount(birthDate, Date("2051-01-15T00:00:00Z"), 0) as Double) > 0.0)
            assertEquals(0.0, OAS.getMonthlyOASAmount(birthDate, Date("2051-01-16T00:00:00Z"), 0) as Double)
        } finally {
            OAS.MIN_AGE = originalMinAge
            OAS.MAX_AGE = originalMaxAge
        }
    }

    @Test
    fun shouldReadCurrentIncreasePropertiesAndDispatchThroughObject() {
        val originalAge = OAS.INCREASE.AGE as Int
        val originalRate = OAS.INCREASE.RATE as Double
        val originalDeferredRequestAmount = OAS.getDeferredRequestAmount
        try {
            OAS.INCREASE.AGE = 69
            OAS.INCREASE.RATE = 0.2
            OAS.getDeferredRequestAmount = { _: Int, _: Double? -> 1000.0 }

            val result = OAS.getMonthlyOASAmount(
                Date("1980-01-31T12:00:00Z"),
                Date("2049-03-01T00:00:00Z"),
                20,
            ) as Double

            assertEquals(1200.0, result)
        } finally {
            OAS.INCREASE.AGE = originalAge
            OAS.INCREASE.RATE = originalRate
            OAS.getDeferredRequestAmount = originalDeferredRequestAmount
        }
    }
}
