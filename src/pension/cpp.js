export default {
	// https://www.ceridian.ca/en/resources/compliance-centre/canada-pension-plan-cpp-qpp/index.html
	// https://www.payworks.ca/payroll-legislation/CPPEI.asp
	contributions: {
		max_pensionable_earnings: 55900,
		min_pensionable_earnings: 3500,
		rate: {
			self_employed: 0.099,
			salaried: 0.0495,
		},
	},
	// http://www.cra-arc.gc.ca/tx/bsnss/tpcs/pyrll/clcltng/cpp-rpc/cnt-chrt-pf-eng.html
	max_income: {
		1966: 5000,
		1967: 5000,
		1968: 5100,
		1969: 5200,
		1970: 5300,
		1971: 5400,
		1972: 5500,
		1973: 5900,
		1974: 6600,
		1975: 7400,
		1976: 8300,
		1977: 9300,
		1978: 10400,
		1979: 11700,
		1980: 13100,
		1981: 14700,
		1982: 16500,
		1983: 18500,
		1984: 20800,
		1985: 23400,
		1986: 25800,
		1987: 25900,
		1988: 26500,
		1989: 27700,
		1990: 28900,
		1991: 30500,
		1992: 32200,
		1993: 33400,
		1994: 34400,
		1995: 34900,
		1996: 35400,
		1997: 35800,
		1998: 36900,
		1999: 37400,
		2000: 37600,
		2001: 38300,
		2002: 39100,
		2003: 39900,
		2004: 40500,
		2005: 41100,
		2006: 42100,
		2007: 43700,
		2008: 44900,
		2009: 46300,
		2010: 47200,
		2011: 48300,
		2012: 50100,
		2013: 51100,
		2014: 52500,
		2015: 53600,
		2016: 54900,
		2017: 55300,
		2018: 55900
	},
	// http://www.esdc.gc.ca/en/cpp/benefit_amount.page
	// http://drpensions.ca/cpp-rate-table.html
	max: {
		retirement: 13610.04,
		combined_retirement_survivor: 13610.04,
		survivor_over_64: 8166,
		survivor_under_65: 7375.44,
		death_benefit: 2500,
	},
	// http://drpensions.ca/cpp-rate-table.html
	flat_benefit: {
		orphan: 2935.68,
		disability: 5822.40,
		under_45: 2271.72, // a flat rate portion plus 37.5 per cent of the contributor's retirement pension, if the surviving spouse or common-law partner is not receiving other CPP benefits minus 1/120 for each month the spouse or common-law partner is under the age of 45 at the time of the contributor's death
		under_45_with_child: 2271.72, // a flat rate portion plus 37.5 per cent of the contributor's retirement pension, if the surviving spouse or common-law partner is not receiving other CPP benefits
		under_45_disabled: 2271.72, // a flat rate portion plus 37.5 per cent of the contributor's retirement pension, if the surviving spouse or common-law partner is not receiving other CPP benefits
		from_45_to_64: 2271.72, // a flat rate portion plus 37.5 per cent of the contributor's retirement pension, if the surviving spouse or common-law partner is not receiving other CPP benefits
		over_64_without_pension: 0, // 60 per cent of the contributor's retirement pension, if the surviving spouse or common-law partner is not receiving other CPP benefits
	},
	// http://www.esdc.gc.ca/en/cpp/survivor_pension.page
	survivor_rate: {
		over_64: 0.6,
		under_65: 0.375,
	},
	// http://www.esdc.gc.ca/en/cpp/death_benefit.page
	death_benefit: { rate: 0.5 },
};
