// tslint:disable:max-line-length
/*
Sources
    https://www.canada.ca/en/department-finance/news/2024/06/capital-gains-inclusion-rate.html
    https://www.revenuquebec.ca/en/press-room/tax-news/details/2024-06-19/capital-gains-inclusion-rate-increase-1/

Revised
    2024-12-30
*/
// tslint:enable:max-line-length

import { Rate } from '../taxes';

export const CAPITAL_GAINS_BRACKETS: Rate[] = [
    {
        FROM: 0,
        TO: 250000,
        RATE: 0.5,
    },
    {
        FROM: 250000,
        TO: Infinity,
        RATE: 2 / 3,
    },
];

export function getCapitalGainsTaxableAmount(totalCapitalGains: number): number {
    return CAPITAL_GAINS_BRACKETS.reduce((taxableAmount, currentBracket) => {
        const currentBracketRate = currentBracket.RATE;

        const bracketTaxableAmount = Math.min(totalCapitalGains, currentBracket.TO);

        if (bracketTaxableAmount <= currentBracket.FROM) return taxableAmount;

        return taxableAmount + ((bracketTaxableAmount - currentBracket.FROM) * currentBracketRate);
    }, 0);
}
