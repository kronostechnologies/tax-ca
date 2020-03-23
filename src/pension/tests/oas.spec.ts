import OAS from '../oas';

describe('getAAF', () => {
    it.each`
        birthdate                                   | requestAge                                    | expected
        ${new Date(1955, 0, 1)}  | ${new Date(2020, 0, 1)}    | ${1}
        ${new Date(1955, 0, 15)}  | ${new Date(2020, 1, 1)}    | ${1}
        ${new Date(1955, 0, 1)}  | ${new Date(2020, 6, 1)}    | ${1 + 6*OAS.MONTHLY_DELAY_BONUS}
        ${new Date(1955, 0, 1)}  | ${new Date(2021, 0, 1)}    | ${1 + 12*OAS.MONTHLY_DELAY_BONUS}
        ${new Date(1955, 0, 1)}  | ${new Date(2030, 0, 1)}    | ${1 + 60*OAS.MONTHLY_DELAY_BONUS}
        ${new Date(1955, 0, 1)}  | ${new Date(2019, 0, 1)}    | ${0}
    `('should round $value with a precision of $precision digits', ({ birthdate, requestAge, expected }) => {
        const AAF = OAS.getAAF(birthdate, requestAge);

        expect(AAF).toBe(expected);
    });
});
