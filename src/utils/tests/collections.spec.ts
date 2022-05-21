import { maxBy } from '../collections';

describe('maxBy', () => {
    it('should return maximum value by mapping function', () => {
        const maxB = { a: 1, b: 5 };
        const maxA = { a: 5, b: 2 };
        const values = [maxA, maxB];

        const valueWithMaxB = maxBy(values, (x) => x.b);

        expect(valueWithMaxB).toBe(maxB);
    });

    it('should return first value if multiple maximums', () => {
        const maxA = { a: 5, b: 2 };
        const maxB = { a: 1, b: 5 };
        const maxA2 = { ...maxA };
        const values = [maxA, maxB, maxA2];

        const valueWithMaxA = maxBy(values, (x) => x.a);

        expect(valueWithMaxA).toBe(maxA);
    });
});
