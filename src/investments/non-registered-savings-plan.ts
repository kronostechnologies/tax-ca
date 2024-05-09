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
        RATE: 0.667,
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
