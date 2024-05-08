import { Rate } from '../taxes';

export const CAPITAL_GAINS_INCLUSION_RATE: Rate[] = [
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

export function getCapitalGainsTaxableAmount(taxableCapitalGains: number): number {
    return CAPITAL_GAINS_INCLUSION_RATE.reduce((taxableAmount, inclusionRate, index) => {
        const bracketBefore = index === 0 ? null : CAPITAL_GAINS_INCLUSION_RATE[index - 1];
        const currentBracket = inclusionRate;
        const currentBracketRate = currentBracket.RATE;

        const lowerBound = bracketBefore === null ? 0 : bracketBefore.TO;
        const upperBound = currentBracket.TO;
        const upperBoundAmount = taxableCapitalGains <= upperBound ? taxableCapitalGains : upperBound;

        if (upperBoundAmount <= lowerBound) return taxableAmount;

        return taxableAmount + ((upperBoundAmount - lowerBound) * currentBracketRate);
    }, 0);
}
