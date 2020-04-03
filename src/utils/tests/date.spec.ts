import { monthsDelta } from '../date';

type TestCase = [Date, Date, number];

describe('monthsDelta', () => {
    const testCases: TestCase[] = [
        [new Date(2020, 0, 1), new Date(2020, 0, 1), 0],
        [new Date(2020, 3, 1), new Date(2020, 0, 1), -3],
        [new Date(2020, 0, 1), new Date(2020, 3, 1), 3],
        [new Date(2020, 0, 15), new Date(2020, 3, 17), 3],
        [new Date(2020, 0, 15), new Date(2020, 4, 1), 3],
        [new Date(2020, 0, 15), new Date(2020, 3, 13), 2],
        [new Date(2020, 0, 30), new Date(2020, 1, 1), 0],
        [new Date(2020, 2, 31), new Date(2020, 3, 30), 0],
        [new Date(2020, 2, 30), new Date(2021, 3, 30), 13],
    ];

    testCases.forEach(([from, to, expected]) => {
        const testName = `should return ${expected} months between ${from.toDateString()} and ${to.toDateString()}`;
        const testCase = () => expect(monthsDelta(from, to)).toBe(expected);

        it(testName, testCase);
    });
});
