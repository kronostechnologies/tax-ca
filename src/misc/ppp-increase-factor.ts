/*
Sources
    https://www.finance-investissement.com/zone-experts_/martin-dupras/la-valeur-reelle-de-reporter-la-rente-du-rrq-mise-a-jour-2024/
    https://www.finance-investissement.com/zone-experts_/martin-dupras/la-valeur-reelle-de-reporter-la-rente-du-rrq/

Note
    Cumulative difference in %, according to the table calculated by Martin Dupras,
    from the reference age of 65, after 40 years of contributions, divided by 12 months.
    The formula consuming these values is only utilized by kronos-fna.

Revised
    2024-12
 */

export interface PPPIncreaseFactor {
    FIRST_YEAR: number;
    SECOND_YEAR: number;
    THIRD_YEAR: number;
    FOURTH_YEAR: number;
    FIFTH_YEAR: number;
    SIXTH_YEAR: number;
    SEVENTH_YEAR: number;
}

export const PPP_INCREASE_FACTOR: PPPIncreaseFactor = {
    FIRST_YEAR: 0.791,
    SECOND_YEAR: 0.733,
    THIRD_YEAR: 0.683,
    FOURTH_YEAR: 0.65,
    FIFTH_YEAR: 0.608,
    SIXTH_YEAR: 0.583,
    SEVENTH_YEAR: 0.55,
};
