import { monthsDelta } from '../date';

describe('monthsDelta', () => {
    it.each`
        firstDate                                  | secondDate                                  | expected
        ${new Date(2020, 0, 1)}  | ${new Date(2020, 0, 1)}   | ${0}
        ${new Date(2020, 3, 1)}  | ${new Date(2020, 0, 1)}   | ${-3}
        ${new Date(2020, 0, 1)}  | ${new Date(2020, 3, 1)}   | ${3}
        ${new Date(2020, 0, 15)} | ${new Date(2020, 3, 17)}  | ${3}
        ${new Date(2020, 0, 15)} | ${new Date(2020, 4, 1)}   | ${3}
        ${new Date(2020, 0, 15)} | ${new Date(2020, 3, 13)}  | ${2}
        ${new Date(2020, 0, 30)} | ${new Date(2020, 1, 1)}   | ${0}
        ${new Date(2020, 2, 31)} | ${new Date(2020, 3, 30)}  | ${0}
        ${new Date(2020, 2, 30)} | ${new Date(2021, 3, 30)}  | ${13}
    `('should return $expected months between $firstDate and $secondDate', ({ firstDate, secondDate, expected }) => {
        expect(monthsDelta(firstDate, secondDate)).toBe(expected);
    });
});
