/*
Sources:
	http://www.cra-arc.gc.ca/tx/bsnss/tpcs/pyrll/clcltng/cpp-rpc/cnt-chrt-pf-eng.html
	http://www.esdc.gc.ca/en/cpp/benefit_amount.page
	---
	http://www.esdc.gc.ca/en/cpp/survivor_pension.page
	http://www.esdc.gc.ca/en/cpp/death_benefit.page
	http://www.esdc.gc.ca/en/reports/pension/cpp_technical_amendments.page
	http://www.parl.gc.ca/content/lop/researchpublications/2011-54-e.htm
	http://www.esdc.gc.ca/en/cpp/consumer_price_index.page
	http://www.statcan.gc.ca/tables-tableaux/sum-som/l01/cst01/econ46a-eng.htm
	
Revised 2018-12-21
*/

export default {
	CONTRIBUTIONS: {
		MAX_PENSIONABLE_EARNINGS: 57400,
		MIN_PENSIONABLE_EARNINGS: 3500,
		RATES: {
			SELF_EMPLOYED: 0.102,
			SALARIED: 0.051,
		},
	},
	DEATH_BENEFIT: { RATE: 0.5 },
	DEFAULT_REFERENCE_AGE: 65,
	FLAT_BENEFIT: {
		ORPHAN: 2935.68,
		DISABILITY: 16029.96,
		UNDER_45: 7375.44, // a flat rate portion plus 37.5 per cent of the contributor's retirement pension, if the surviving spouse or common-law partner is not receiving other CPP benefits minus 1/120 for each month the spouse or common-law partner is under the age of 45 at the time of the contributor's death
		UNDER_45_WITH_CHILD: 7375.44, // a flat rate portion plus 37.5 per cent of the contributor's retirement pension, if the surviving spouse or common-law partner is not receiving other CPP benefits
		UNDER_45_DISABLED: 16029.6, // a flat rate portion plus 37.5 per cent of the contributor's retirement pension, if the surviving spouse or common-law partner is not receiving other CPP benefits
		FROM_45_TO_64: 7375.44, // a flat rate portion plus 37.5 per cent of the contributor's retirement pension, if the surviving spouse or common-law partner is not receiving other CPP benefits
		OVER_64_WITHOUT_PENSION: 8166.00, // 60 per cent of the contributor's retirement pension, if the surviving spouse or common-law partner is not receiving other CPP benefits
	},
	getAAF(age) {
		const lower = 0.0060; const
			higher = 0.0070;

		if(age < 60) {
			return 0;
		}
		if(age === 65) {
			return 1;
		}
		if(age < 65) {
			return (1 - ((65 - Math.max(60, age)) * 12 * lower));
		}
		return (1 + ((Math.min(70, age) - 65) * 12 * higher));
	},
	getAverageIndexationRate() {
		let sum = 0;

		for(let i = 0; i < this.INDEXATION_RATES_REFERENCES.length; i++) {
			sum += this.INDEXATION_RATES_REFERENCES[i][1];
		}

		return Number.parseFloat(sum / this.INDEXATION_RATES_REFERENCES.length).toPrecision(3);
	},
	getMPEA(year) {
		return (this.MAX_INCOME[year - 4] + this.MAX_INCOME[year - 3] + this.MAX_INCOME[year - 2] + this.MAX_INCOME[year - 1] + this.MAX_INCOME[year]) / 5;
	},
	getPostRetirementBenefit(pensionnable_earning, ympe, mpea, aaf) {
		return (pensionnable_earning / ympe) * 0.00625 * mpea * aaf / 12;
	},
	INDEXATION_RATES_REFERENCES: [ // Previous year inflation used as indexation
		[2007, 0.020],
		[2008, 0.022],
		[2009, 0.023],
		[2010, 0.003],
		[2011, 0.018],
		[2012, 0.029],
		[2013, 0.015],
		[2014, 0.009],
		[2015, 0.020],
		[2016, 0.011],
		[2017, 0.014],
		[2018, 0.016]
	],
	MAX_PENSION: {
		RETIREMENT: 13610.04,
		COMBINED_RETIREMENT_SURVIVOR: 13610.04,
		SURVIVOR_OVER_46: 8166,
		SURVIVOR_UNDER_65: 7375.44,
		DEATH_BENEFIT: 2500,
	},
	MAX_INCOME: {
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
		2018: 55900,
		2019: 57400
	},
	MAX_REQUEST_AGE: 70,
	MIN_REQUEST_AGE: 60,
	REPLACEMENT_FACTOR: 0.25,
	SURVIVOR_RATES: {
		OVER_64: 0.6,
		UNDER_65: 0.375,
	},
};
