package com.equisoft.taxca.misc

enum class Jurisdiction(val code: String, val jurisdictionName: String) {
    CA("CA", "CANADA"),
    AB("AB", "ALBERTA"),
    BC("BC", "BRITISH_COLUMBIA"),
    MB("MB", "MANITOBA"),
    NB("NB", "NEW_BRUNSWICK"),
    NL("NL", "NEWFOUNDLAND"),
    NS("NS", "NOVA_SCOTIA"),
    PE("PE", "PRINCE_EDWARD_ISLAND"),
    ON("ON", "ONTARIO"),
    QC("QC", "QUEBEC"),
    SK("SK", "SASKATCHEWAN"),
    NT("NT", "NORTHWEST_TERRITORIES"),
    NU("NU", "NUNAVUT"),
    YT("YT", "YUKON"),
    ;

    val isProvince: Boolean get() = this != CA

    companion object {
        val provinces: List<Jurisdiction> = entries.filter { it != CA }

        fun fromCode(code: String): Jurisdiction = entries.first { it.code == code }
    }
}
