import { addYearsToDate, getAge, getMonthsDiff, resetTime } from '../date';

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

    describe('getAge', () => {
        it.each`
            birthDate                  | atDate                      | expected
            ${new Date('2000-01-01')}  | ${new Date('2020-01-01')}   | ${20}
            ${new Date('2000-01-01')}  | ${new Date('2020-06-15')}   | ${20}
            ${new Date('2000-06-15')}  | ${new Date('2020-06-15')}   | ${20}
            ${new Date('2000-06-15')}  | ${new Date('2020-06-16')}   | ${20}
            ${new Date('2000-06-15')}  | ${new Date('2021-06-14')}   | ${20}
            ${new Date('2000-06-15')}  | ${new Date('2020-06-14')}   | ${19}
            ${new Date('2000-06-15')}  | ${new Date('2020-05-15')}   | ${19}
            ${new Date('2000-12-31')}  | ${new Date('2021-01-01')}   | ${20}
            ${new Date('2000-02-29')}  | ${new Date('2020-02-28')}   | ${19}
            ${new Date('2000-02-29')}  | ${new Date('2020-02-29')}   | ${20}
            ${new Date('1955-07-07')}  | ${new Date('2020-07-07')}   | ${65}
            ${new Date('1955-07-07')}  | ${new Date('2020-07-06')}   | ${64}
            ${new Date('2020-01-01')}  | ${new Date('2000-01-01')}   | ${-20}
            ${new Date('2020-06-15')}  | ${new Date('2019-06-15')}   | ${-1}
            ${new Date('2020-06-15')}  | ${new Date('2019-06-14')}   | ${-1}
        `('should return $expected years old for birthDate $birthDate at $atDate', ({
            birthDate, atDate, expected,
        }) => expect(getAge(birthDate, atDate)).toBe(expected));
    });

    describe('resetTime', () => {
        it('should remove time from a date with time', () => {
            const date = new Date('2020-06-15T14:30:45.123');
            const result = resetTime(date);
            expect(result.getHours()).toBe(0);
            expect(result.getMinutes()).toBe(0);
            expect(result.getSeconds()).toBe(0);
            expect(result.getMilliseconds()).toBe(0);
        });

        it('should preserve the date part', () => {
            const date = new Date('2020-06-15T14:30:45.123');
            const result = resetTime(date);
            expect(result.getFullYear()).toBe(2020);
            expect(result.getMonth()).toBe(5); // June is 5 (0-indexed)
            expect(result.getDate()).toBe(15);
        });

        it('should return a new Date object (not mutate the original)', () => {
            const date = new Date('2020-06-15T14:30:45.123');
            const result = resetTime(date);
            expect(result).not.toBe(date);
            expect(date.getHours()).toBe(14);
        });

        it('should handle midnight correctly', () => {
            const date = new Date('2020-06-15T00:00:00.000');
            const result = resetTime(date);
            expect(result.getHours()).toBe(0);
            expect(result.getMinutes()).toBe(0);
            expect(result.getSeconds()).toBe(0);
            expect(result.getMilliseconds()).toBe(0);
        });
    });
});
