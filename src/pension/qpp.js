/*
Sources:
	https://www.revenuquebec.ca/fr/salle-de-presse/nouvelles-fiscales/details/161100/2018-12-17/
	https://www.rrq.gouv.qc.ca/en/services/publications/regime_rentes/retraite/Pages/tableaux-revenus-travail-admissibles.aspx
	http://www.rrq.gouv.qc.ca/en/programmes/regime_rentes/regime_chiffres/Pages/regime_chiffres.aspx
	http://www.rrq.gouv.qc.ca/fra/porrq/Content/110_Calculs/117/PO117-10.htm
	http://www.rrq.gouv.qc.ca/fra/porrq/Content/110_Calculs/117/PO117-15.htm
	https://www.canada.ca/en/employment-social-development/programs/pensions/pension/statistics/2018-quarterly-january-march.html
	http://www.rrq.gouv.qc.ca/en/programmes/regime_rentes/regime_chiffres/Pages/regime_chiffres.aspx
	
Revised 2018-12-21
*/

export default {
	CONTRIBUTIONS: {
		MAX_PENSIONABLE_EARNINGS: 57400,
		MIN_PENSIONABLE_EARNINGS: 3500,
		RATES: {
			SELF_EMPLOYED: 0.111,
			SALARIED: 0.0555,
		},
	},
	DEATH_BENEFIT: { RATE: 0.5 },
	DEFAULT_REFERENCE_AGE: 65,
	FLAT_BENEFIT: {
		ORPHAN: 2935.68,
		DISABILITY: 16029.60,
		UNDER_45: 6594.84,
		UNDER_45_WITH_CHILD: 10509.60,
		UNDER_45_DISABLED: 10925.76,
		FROM_45_TO_64: 10925.76,
		OVER_64_WITHOUT_PENSION: 8166.00,
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

		for(let i = 0; i < this.INDEXATION_RATE_REFERENCES.length; i++) {
			sum += this.INDEXATION_RATE_REFERENCES[i][1];
		}

		return _.round(sum / this.INDEXATION_RATE_REFERENCES.length, 2);
	},
	INDEXATION_RATE_REFERENCES: [
		[2007, 0.021],
		[2008, 0.020],
		[2009, 0.025],
		[2010, 0.004],
		[2011, 0.017],
		[2012, 0.028],
		[2013, 0.018],
		[2014, 0.009],
		[2015, 0.018],
		[2016, 0.012],
		[2017, 0.020],
		[2018, 0.015]
	],
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
	MAX_PENSION: {
		RETIREMENT: 13610.04,
		COMBINED_RETIREMENT_SURVIVOR: 13610.04,
		SURVIVOR_OVER_64: 8166,
		SURVIVOR_FROM_45_TO_64: 10925.76,
		SURVIVOR_UNDER_45: 6594.84,
		DEATH_BENEFIT: 2500,
	},
	MAX_REQUEST_AGE: 70,
	MIN_REQUEST_AGE: 60,
	REPLACEMENT_FACTOR: 0.25,
	SURVIVOR_RATES: {
		OVER_64: 0.6,
		UNDER_65: 0.375,
	},
};
