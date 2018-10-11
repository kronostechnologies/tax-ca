/*
Sources:
	http://www.rrq.gouv.qc.ca/fr/services/publications/regime_rentes/retraite/Pages/revenu_admissible.aspx
	https://www.rrq.gouv.qc.ca/en/services/publications/regime_rentes/retraite/Pages/tableaux-revenus-travail-admissibles.aspx
	http://www.rrq.gouv.qc.ca/en/programmes/regime_rentes/regime_chiffres/Pages/regime_chiffres.aspx
	http://www.rrq.gouv.qc.ca/fra/porrq/Content/110_Calculs/117/PO117-10.htm
	http://www.rrq.gouv.qc.ca/fra/porrq/Content/110_Calculs/117/PO117-15.htm
	https://www.canada.ca/en/employment-social-development/programs/pensions/pension/statistics/2018-quarterly-january-march.html
	http://www.rrq.gouv.qc.ca/en/programmes/regime_rentes/regime_chiffres/Pages/regime_chiffres.aspx
*/

export default {
	contributions: {
		max_pensionable_earnings: 55900,
		min_pensionable_earnings: 3500,
		rate: {
			self_employed: 0.108,
			salaried: 0.054,
		},
	},
	death_benefit: { rate: 0.5 },
	default_reference_age: 65,
	flat_benefit: {
		disability: 5822.04,
		less_than_45: 1491.12,
		less_than_45_with_child: 5405.88,
		less_than_45_disabled: 5822.04,
		from_45_to_64: 5822.04,
		over_64_without_pension: 0,
		orphan: 2935.68,
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
	indexation_rate_references: [
		[2007, 2.1],
		[2008, 2.0],
		[2009, 2.5],
		[2010, 0.4],
		[2011, 1.7],
		[2012, 2.8],
		[2013, 1.8],
		[2014, 0.9],
		[2015, 1.8],
		[2016, 1.2],
		[2017, 2.0],
		[2018, 1.5]
	],
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
	max_pension: {
		retirement: 13610.04,
		combined_retirement_survivor: 13610.04,
		survivor_over_64: 8166,
		survivor_from_45_to_64: 10925.76,
		survivor_under_45: 6594.84,
		death_benefit: 2500,
	},
	max_request_age: 70,
	min_request_age: 60,
	replacement_factor: 0.25,
	survivor_rate: {
		over_64: 0.6,
		under_65: 0.375,
	},
};
