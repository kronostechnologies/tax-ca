import { clamp, roundToPrecision } from '../math';

describe('roundToPrecision', () => {
    it('should round to integer by default', () => {
        const roundedValue = roundToPrecision(1.5678);

        expect(roundedValue).toBe(2);
    });

    it.each`
        value       | precision | expected
        ${1.56789}  | ${1}      | ${1.6}
        ${1.56789}  | ${2}      | ${1.57}
        ${1.56789}  | ${3}      | ${1.568}
    `('should round $value with a precision of $precision digits', ({ value, precision, expected }) => {
        const roundedValue = roundToPrecision(value, precision);

        expect(roundedValue).toBe(expected);
    });
});

describe('clamp', () => {
    it.each`
        value       | min       | max       | expected
        ${50}       | ${10}     | ${30}     | ${30}
        ${5}        | ${10}     | ${30}     | ${10}
        ${20}       | ${10}     | ${30}     | ${20}
        ${10}       | ${10}     | ${30}     | ${10}
        ${30}       | ${10}     | ${30}     | ${30}
    `('should clamp $value between $min and $max', ({ value, min, max, expected }) => {
        expect(clamp(value, min, max)).toBe(expected);
    });
});
