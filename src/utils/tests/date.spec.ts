import { addYearsToDate, getMonthsDiff } from '../date';

describe('Date Utils', () => {
    describe('addYearsToDate', () => {
        it.each`
            date                      | years   | expected
            ${new Date('1950-01-01')} | ${50}   | ${new Date('2000-01-01')}
            ${new Date('1955-07-07')} | ${65}   | ${new Date('2020-07-07')}
        `('should return $expected when adding $years years to $date', ({
            date, years, expected,
        }) => {
            expect(addYearsToDate(date, years)).toStrictEqual(expected);
        });
    });

    describe('getMonthsDiff', () => {
        it.each`
            firstDate                  | secondDate                  | expected
            ${new Date('2020-01-01')}  | ${new Date('2020-01-01')}   | ${0}
            ${new Date('2020-04-01')}  | ${new Date('2020-01-01')}   | ${-3}
            ${new Date('2020-01-01')}  | ${new Date('2020-04-01')}   | ${3}
            ${new Date('2020-01-15')}  | ${new Date('2020-04-17')}   | ${3}
            ${new Date('2020-01-15')}  | ${new Date('2020-05-01')}   | ${3}
            ${new Date('2020-01-15')}  | ${new Date('2020-04-13')}   | ${2}
            ${new Date('2020-01-30')}  | ${new Date('2020-02-01')}   | ${0}
            ${new Date('2020-03-31')}  | ${new Date('2020-04-30')}   | ${0}
            ${new Date('2021-01-01')}  | ${new Date('2021-07-01')}   | ${6}
            ${new Date('2020-03-30')}  | ${new Date('2021-04-30')}   | ${13}
            ${new Date('1955-01-01')}  | ${new Date('2020-07-01')}   | ${786}
        `('should return $expected months between $firstDate and $secondDate', ({
            firstDate, secondDate, expected,
        }) => expect(getMonthsDiff(firstDate, secondDate)).toBe(expected));
    });
});
