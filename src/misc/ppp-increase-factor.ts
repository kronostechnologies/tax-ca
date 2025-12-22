/*
Sources
    https://www.finance-investissement.com/zone-experts_/martin-dupras/la-valeur-reelle-de-reporter-la-rente-du-rrq-mise-a-jour-2024/
    https://www.finance-investissement.com/zone-experts_/martin-dupras/la-valeur-reelle-de-reporter-la-rente-du-rrq/

Note
    Used to be the cumulative difference in %, according to the table calculated by Martin Dupras,
    from the reference age of 65, after 40 years of contributions, divided by 12 months.
    The formula consuming these values is only utilized by kronos-fna.

    Since Jan. 2024, years over the age of 65 do not reduce the increase factor of 8.4%/yr (0.7%/mth)
    Reference: https://www.finance-investissement.com/zone-experts_/apff/rrq-changements-en-vigueur-au-1er-janvier-2024/

Revised
    2025-12-22
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
    FIRST_YEAR: 0.84,
    SECOND_YEAR: 0.84,
    THIRD_YEAR: 0.84,
    FOURTH_YEAR: 0.84,
    FIFTH_YEAR: 0.84,
    SIXTH_YEAR: 0.84,
    SEVENTH_YEAR: 0.84,
};
