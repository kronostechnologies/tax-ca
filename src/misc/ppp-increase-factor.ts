/*
Sources
    https://www.finance-investissement.com/zone-experts_/martin-dupras/la-valeur-reelle-de-reporter-la-rente-du-rrq/

Note
    Cumulative difference in %, according to the table calculated by Martin Dupras,
    from the reference age of 65, divided by 12 months.
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
    FIRST_YEAR: 0.517,
    SECOND_YEAR: 0.467,
    THIRD_YEAR: 0.425,
    FOURTH_YEAR: 0.375,
    FIFTH_YEAR: 0.358,
    SIXTH_YEAR: 0.3185,
    SEVENTH_YEAR: 0.2790,
};
