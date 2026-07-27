/*
 Sources
 https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3710004501&cubeTimeFrame.startYear=2024+%2F+2025&cubeTimeFrame.endYear=2024+%2F+2025&referencePeriods=20240101%2C20240101

 Last updated
 2025-12-21
 */

package com.equisoft.taxca.investments.resp

import com.equisoft.taxca.misc.Jurisdiction

// The TS source merges an interface and a const named `TuitionFees`; Kotlin forbids a
// top-level class and val sharing a name, so the class carries a `Resp` prefix.
data class RespTuitionFees(
    val tuitionFeesData: Map<Jurisdiction, Double>,
) {
    fun getTuitionFeesByProvinceCode(provinceCode: Jurisdiction): Double =
        tuitionFeesData.getValue(provinceCode)
}

val TuitionFees: RespTuitionFees = RespTuitionFees(
    tuitionFeesData = mapOf(
        Jurisdiction.AB to 8067.0,
        Jurisdiction.BC to 6862.0,
        Jurisdiction.MB to 5993.0,
        Jurisdiction.NB to 9938.0,
        Jurisdiction.NL to 3746.0,
        Jurisdiction.NS to 9988.0,
        Jurisdiction.PE to 8191.0,
        Jurisdiction.ON to 8958.0,
        Jurisdiction.QC to 3963.0,
        Jurisdiction.SK to 9863.0,
        // using geography = Canada
        Jurisdiction.NT to 7734.0,
        // using geography = Canada
        Jurisdiction.NU to 7734.0,
        Jurisdiction.YT to 4470.0,
    ),
)
