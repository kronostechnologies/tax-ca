import { CPP } from '../canada-pension-plan';

describe('getRequestDateFactor', () => {
    it('should return 0 when request date is before the participant 60th (minimum age) birthday', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2039-01-01'); // at his 59th birthday

        const ratio = CPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(0);
    });

    it('should return 1 when request date is exactly the same as the participant 65th (reference age) birthday', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2045-01-01'); // at his 65th birthday

        const ratio = CPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1);
    });

    it('should count the bonus from the reference age even when the request date is in the past', () => {
        const birthDate = new Date('1953-07-01');
        const requestDate = new Date('2019-07-01'); // on his 66th birthday, 12 months after the reference age

        const ratio = CPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + (12 * CPP.MONTHLY_DELAY.BONUS));
    });

    it('should count the bonus from the reference age, not from the last birthday', () => {
        const birthDate = new Date('1953-07-01');
        const requestDate = new Date('2019-09-01'); // 14 months after the 65th birthday (reference age)

        const ratio = CPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + (14 * CPP.MONTHLY_DELAY.BONUS));
    });

    it('should apply the penalty when the request date is before the reference age', () => {
        const birthDate = new Date('1957-06-06');
        const requestDate = new Date('2018-06-06'); // on 61th birthDay, 48 months before the reference age

        const ratio = CPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 - (48 * CPP.MONTHLY_DELAY.PENALTY));
    });

    it(
        'should return 1 when request date is after the participant 65th (reference age) birthday but for less than a month ', // eslint-disable-line max-len
        () => {
            const birthDate = new Date('1980-01-15');
            const requestDate = new Date('2045-02-01'); // two weeks after his 65th birthday

            const ratio = CPP.getRequestDateFactor(birthDate, requestDate);

            expect(ratio).toBe(1);
        },
    );

    it('should return 1 + X times the MONTHLY delay bonus when waiting for x months', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2045-07-01'); // 6 months after his 65th birthday

        const ratio = CPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + (6 * CPP.MONTHLY_DELAY.BONUS));
    });

    it('should return 1 + 12 times the MONTHLY delay bonus when waiting for exactly a year', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2046-01-01'); // on his 66th birthday

        const ratio = CPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + (12 * CPP.MONTHLY_DELAY.BONUS));
    });

    it('should return 1 + 60 times the MONTHLY delay bonus when waiting has max age on request', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2055-01-01'); // on his 70th birthday

        const ratio = CPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + (60 * CPP.MONTHLY_DELAY.BONUS));
    });

    it('should return max delay bonus (1 + 60 times the MONTHLY delay bonus) when request is after max age', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2065-01-01'); // on his 80th birthday

        const ratio = CPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + (60 * CPP.MONTHLY_DELAY.BONUS));
    });

    it('should return 1 - X times the MONTHLY delay penalty when taking pension x months earlier', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2044-07-01'); // 6 months before his 65th birthday

        const ratio = CPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 - (6 * CPP.MONTHLY_DELAY.PENALTY));
    });

    it('should return 1 - 12 times the MONTHLY delay penalty when taking pension a year earlier', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2044-01-01'); // on his 64th birthday

        const ratio = CPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 - (12 * CPP.MONTHLY_DELAY.PENALTY));
    });

    it('should count the bonus from the reference age for a request several years past 65', () => {
        const birthDate = new Date('1953-01-01');
        const requestDate = new Date('2020-09-15'); // 32 months after the 65th birthday (reference age)

        const ratio = CPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + (32 * CPP.MONTHLY_DELAY.BONUS));
    });

    it('should clamp to the max bonus when the request date is past the maximum request age', () => {
        const birthDate = new Date('1948-01-01');
        const requestDate = new Date('2020-01-01'); // on his 72nd birthday, past the 70 max request age

        const ratio = CPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + (60 * CPP.MONTHLY_DELAY.BONUS));
    });

    it('should use a custom reference date on calculation when given', () => {
        const birthDate = new Date('1980-01-01');
        const referenceDate = new Date('2046-01-01');
        const requestDate = new Date('2046-07-01'); // 6 months after his 66th birthday, the custom reference date

        const ratio = CPP.getRequestDateFactor(birthDate, requestDate, referenceDate);

        expect(ratio).toBe(1 + (6 * CPP.MONTHLY_DELAY.BONUS));
    });

    describe('ABF-13000 regression: bonus for clients already past the reference age', () => {
        it('should bonify a request on the 66th birthday (DOB 1960-01-01)', () => {
            const birthDate = new Date('1960-01-01');
            const requestDate = new Date('2026-01-01'); // 66th birthday, 12 months past the reference age

            const ratio = CPP.getRequestDateFactor(birthDate, requestDate);

            expect(ratio).toBe(1 + (12 * CPP.MONTHLY_DELAY.BONUS)); // 1.084
        });

        it('should bonify a request on the 68th birthday (DOB 1958-01-01)', () => {
            const birthDate = new Date('1958-01-01');
            const requestDate = new Date('2026-01-01'); // 68th birthday, 36 months past the reference age

            const ratio = CPP.getRequestDateFactor(birthDate, requestDate);

            expect(ratio).toBe(1 + (36 * CPP.MONTHLY_DELAY.BONUS)); // 1.252
        });

        it('should bonify a request on the 68th birthday for a mid-year birth date (DOB 1958-08-01)', () => {
            const birthDate = new Date('1958-08-01');
            const requestDate = new Date('2026-08-01'); // 68th birthday, 36 months past the reference age

            const ratio = CPP.getRequestDateFactor(birthDate, requestDate);

            expect(ratio).toBe(1 + (36 * CPP.MONTHLY_DELAY.BONUS)); // 1.252
        });

        it('should be independent of the current system date', () => {
            jest.useFakeTimers().setSystemTime(new Date('2030-06-15T00:00:00Z'));
            try {
                const birthDate = new Date('1960-01-01');
                const requestDate = new Date('2026-01-01'); // 66th birthday, 12 months past the reference age

                const ratio = CPP.getRequestDateFactor(birthDate, requestDate);

                expect(ratio).toBe(1 + (12 * CPP.MONTHLY_DELAY.BONUS));
            } finally {
                jest.useRealTimers();
            }
        });
    });
});
