// import CPP from '../cpp';

describe('getAAF', () => {
    it('should return true', () => {
        expect(true).toBe(true);
    });
    /*
    it.each`
        birthdate                                   | requestAge                                    | expected
        ${new Date(1955, 0, 1)}  | ${new Date(2020, 0, 1)}    | ${1}
        ${new Date(1955, 0, 15)}  | ${new Date(2020, 1, 1)}    | ${1}
        ${new Date(1955, 0, 1)}  | ${new Date(2020, 6, 1)}    | ${1 + 6*CPP.MONTHLY_DELAY.BONUS}
        ${new Date(1955, 0, 1)}  | ${new Date(2021, 0, 1)}    | ${1 + 12*CPP.MONTHLY_DELAY.BONUS}
        ${new Date(1955, 0, 1)}  | ${new Date(2030, 0, 1)}    | ${1 + 60*CPP.MONTHLY_DELAY.BONUS}
        ${new Date(1955, 0, 1)}  | ${new Date(2019, 6, 1)}    | ${1 - 6*CPP.MONTHLY_DELAY.PENALTY}
        ${new Date(1955, 0, 1)}  | ${new Date(2019, 0, 1)}    | ${1 - 12*CPP.MONTHLY_DELAY.PENALTY}
        ${new Date(1955, 0, 1)}  | ${new Date(2010, 0, 1)}    | ${1 - 60*CPP.MONTHLY_DELAY.PENALTY}
    `('should round $value with a precision of $precision digits', ({ birthdate, requestAge, expected }) => {
        const AAF = CPP.getRequestDateFactor(birthdate, requestAge);

        expect(AAF).toBe(expected);
    });
    */
});
