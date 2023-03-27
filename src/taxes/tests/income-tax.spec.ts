import { mergeTaxBracketRates } from '../income-tax';

describe('mergeTaxes', () => {
    it('should merge two tax brackets', () => {
        const A = [
            { FROM: 0, TO: 40000, RATE: 1 },
            { FROM: 40000, TO: 80000, RATE: 2 },
            { FROM: 80000, TO: 100000, RATE: 3 },
        ];

        const B = [
            { FROM: 0, TO: 50000, RATE: 1 },
            { FROM: 50000, TO: 75000, RATE: 2 },
            { FROM: 75000, TO: 100000, RATE: 3 },
        ];

        const expected = [
            { FROM: 0, TO: 40000, RATE: 2 },
            { FROM: 40000, TO: 50000, RATE: 3 },
            { FROM: 50000, TO: 75000, RATE: 4 },
            { FROM: 75000, TO: 80000, RATE: 5 },
            { FROM: 80000, TO: 100000, RATE: 6 },
        ];

        const result = mergeTaxBracketRates(A, B);

        expect(result).toStrictEqual(expected);
    });

    it('should handle brackets with same FROM', () => {
        const A = [
            { FROM: 0, TO: 50000, RATE: 1 },
            { FROM: 50000, TO: 75000, RATE: 2 },
            { FROM: 75000, TO: 100000, RATE: 3 },
        ];

        const B = [
            { FROM: 0, TO: 25000, RATE: 1 },
            { FROM: 25000, TO: 50000, RATE: 1.5 },
            { FROM: 50000, TO: 75000, RATE: 2 },
            { FROM: 75000, TO: 100000, RATE: 3 },
        ];

        const expected = [
            { FROM: 0, TO: 25000, RATE: 2 },
            { FROM: 25000, TO: 50000, RATE: 2.5 },
            { FROM: 50000, TO: 75000, RATE: 4 },
            { FROM: 75000, TO: 100000, RATE: 6 },
        ];

        const result = mergeTaxBracketRates(A, B);

        expect(result).toStrictEqual(expected);
    });

    it('should handle brackets with same TO', () => {
        const A = [
            { FROM: 0, TO: 50000, RATE: 1 },
            { FROM: 50000, TO: 75000, RATE: 2 },
            { FROM: 75000, TO: 100000, RATE: 3 },
        ];

        const B = [
            { FROM: 0, TO: 50000, RATE: 1 },
            { FROM: 50000, TO: 75000, RATE: 2 },
            { FROM: 75000, TO: 100000, RATE: 3 },
        ];

        const expected = [
            { FROM: 0, TO: 50000, RATE: 2 },
            { FROM: 50000, TO: 75000, RATE: 4 },
            { FROM: 75000, TO: 100000, RATE: 6 },
        ];

        const result = mergeTaxBracketRates(A, B);

        expect(result).toStrictEqual(expected);
    });

    it('should handle brackets with different lengths', () => {
        const A = [
            { FROM: 0, TO: 100000, RATE: 1 }
        ];

        const B = [
            { FROM: 0, TO: 50000, RATE: 1 },
            { FROM: 50000, TO: 75000, RATE: 2 },
            { FROM: 75000, TO: 100000, RATE: 3 },
        ];

        const expected = [
            { FROM: 0, TO: 50000, RATE: 2 },
            { FROM: 50000, TO: 75000, RATE: 3 },
            { FROM: 75000, TO: 100000, RATE: 4 },
        ];

        const result = mergeTaxBracketRates(A, B);

        expect(result).toStrictEqual(expected);
    });
});
