export default {
	// https://www.rrq.gouv.qc.ca/en/services/publications/regime_rentes/retraite/Pages/tableaux-revenus-travail-admissibles.aspx
	contributions: {
		max_pensionable_earnings: 55900,
		min_pensionable_earnings: 3500,
		rate: {
			self_employed: 0.108,
			salaried: 0.054,
		},
	},
	// http://www.rrq.gouv.qc.ca/en/programmes/regime_rentes/regime_chiffres/Pages/regime_chiffres.aspx
	// http://www.rrq.gouv.qc.ca/fra/porrq/Content/110_Calculs/117/PO117-10.htm
	// http://www.rrq.gouv.qc.ca/fra/porrq/Content/110_Calculs/117/PO117-15.htm
	max: {
		retirement: 13610.04,
		combined_retirement_survivor: 13610.04,
		survivor_over_64: 8166,
		survivor_from_45_to_64: 10925.76,
		survivor_under_45: 6594.84,
		death_benefit: 2500,
	},
	// https://www.canada.ca/en/employment-social-development/programs/pensions/pension/statistics/2018-quarterly-january-march.html
	flat_benefit: {
		disability: 5822.04,
		less_than_45: 1491.12,
		less_than_45_with_child: 5405.88,
		less_than_45_disabled: 5822.04,
		from_45_to_64: 5822.04,
		over_64_without_pension: 0,
		orphan: 2935.68,
	},
	survivor_rate: {
		over_64: 0.6,
		under_65: 0.375,
	},
	death_benefit: { rate: 0.5 },
};
