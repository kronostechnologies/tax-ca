import { monthsDelta } from '../date';

describe('monthsDelta', () => {
    it.each`
        firstDate                                   | secondDate                                    | expected
        ${new Date(2020, 0, 1)}  | ${new Date(2020, 0, 1)}    | ${0}
        ${new Date(2020, 3, 1)}  | ${new Date(2020, 0, 1)}    | ${-3}
        ${new Date(2020, 0, 1)}  | ${new Date(2020, 3, 1)}    | ${3}
        ${new Date(2020, 0, 15)}  | ${new Date(2020, 3, 17)}  | ${3}
        ${new Date(2020, 0, 15)}  | ${new Date(2020, 4, 1)}   | ${3}
        ${new Date(2020, 0, 15)}  | ${new Date(2020, 3, 13)}  | ${2}
        ${new Date(2020, 0, 30)}  | ${new Date(2020, 1, 1)}  | ${0}
    `('should round $value with a precision of $precision digits', ({ firstDate, secondDate, expected }) => {
        const delta = monthsDelta(firstDate, secondDate);

        expect(delta).toBe(expected);
    });
});
