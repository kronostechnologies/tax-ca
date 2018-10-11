/*
Sources:
	https://www.ceridian.ca/en/resources/compliance-centre/canada-pension-plan-cpp-qpp/index.html
	https://www.payworks.ca/payroll-legislation/CPPEI.asp
	http://www.cra-arc.gc.ca/tx/bsnss/tpcs/pyrll/clcltng/cpp-rpc/cnt-chrt-pf-eng.html
	http://www.esdc.gc.ca/en/cpp/benefit_amount.page
	http://drpensions.ca/cpp-rate-table.html
	http://drpensions.ca/cpp-rate-table.html
	http://www.esdc.gc.ca/en/cpp/survivor_pension.page
	http://www.esdc.gc.ca/en/cpp/death_benefit.page
	http://retirehappy.ca/calculate-cpp-post-retirement-benefit-prb/
	http://www.esdc.gc.ca/en/reports/pension/cpp_technical_amendments.page
	http://www.parl.gc.ca/content/lop/researchpublications/2011-54-e.htm
	http://www.esdc.gc.ca/en/cpp/consumer_price_index.page
	http://www.statcan.gc.ca/tables-tableaux/sum-som/l01/cst01/econ46a-eng.htm
*/

import _ from 'lodash';

export default {
	contributions: {
		max_pensionable_earnings: 55900,
		min_pensionable_earnings: 3500,
		rate: {
			self_employed: 0.099,
			salaried: 0.0495,
		},
	},
	death_benefit: { rate: 0.5 },
	default_reference_age: 65,
	flat_benefit: {
		orphan: 2935.68,
		disability: 5822.40,
		under_45: 2271.72, // a flat rate portion plus 37.5 per cent of the contributor's retirement pension, if the surviving spouse or common-law partner is not receiving other CPP benefits minus 1/120 for each month the spouse or common-law partner is under the age of 45 at the time of the contributor's death
		under_45_with_child: 2271.72, // a flat rate portion plus 37.5 per cent of the contributor's retirement pension, if the surviving spouse or common-law partner is not receiving other CPP benefits
		under_45_disabled: 2271.72, // a flat rate portion plus 37.5 per cent of the contributor's retirement pension, if the surviving spouse or common-law partner is not receiving other CPP benefits
		from_45_to_64: 2271.72, // a flat rate portion plus 37.5 per cent of the contributor's retirement pension, if the surviving spouse or common-law partner is not receiving other CPP benefits
		over_64_without_pension: 0, // 60 per cent of the contributor's retirement pension, if the surviving spouse or common-law partner is not receiving other CPP benefits
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
			return (1 - (65 - Math.max(60, age)) * 12 * lower);
		}
		return (1 + (Math.min(70, age) - 65) * 12 * higher);
	},
	getIndexationRate() {
		let sum = 0;

		for(let i = 0; i < this.indexation_rate_references.length; i++) {
			sum += this.indexation_rate_references[i][1];
		}

		return _.round(sum / this.indexation_rate_references.length, 2);
	},
	getMPEA(year) {
		return (this.max_income[year - 4] + this.max_income[year - 3] + this.max_income[year - 2] + this.max_income[year - 1] + this.max_income[year]) / 5;
	},
	getPostRetirementBenefit(pensionnable_earning, ympe, mpea, aaf) {
		return (pensionnable_earning / ympe) * 0.00625 * mpea * aaf / 12;
	},
	indexation_rate_references: [ // Previous year inflation used as indexation
		[2007, 2.0],
		[2008, 2.2],
		[2009, 2.3],
		[2010, 0.3],
		[2011, 1.8],
		[2012, 2.9],
		[2013, 1.5],
		[2014, 0.9],
		[2015, 2.0],
		[2016, 1.1],
		[2017, 1.4],
		[2018, 1.6]
	],
	max_pension: {
		retirement: 13610.04,
		combined_retirement_survivor: 13610.04,
		survivor_over_64: 8166,
		survivor_under_65: 7375.44,
		death_benefit: 2500,
	},
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
	max_request_age: 70,
	min_request_age: 60,
	replacement_factor: 0.25,
	survivor_rate: {
		over_64: 0.6,
		under_65: 0.375,
	},
};
