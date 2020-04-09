import OAS from '../oas';

describe('getRequestDateFactor', () => {
    let realDate: any;

    beforeAll(() => {
        const currentDate = new Date('2020-01-01');
        realDate = window.Date;
        // @ts-ignore
        window.Date = class extends Date {
            constructor(date: any) {
                if (date) {
                    // @ts-ignore
                    return super(date);
                }

                return currentDate;
            }
        };
    });

    afterAll(() => {
        window.Date = realDate;
    });

    it('should return 0 when request date is before the participant 65th (minimum age) birthday', () => {
        const birthDate = new Date('1980-01-01T12:00:00');
        const requestDate = new Date('2043-01-01T12:00:00');

       const ratio = OAS.getRequestDateFactor(birthDate, requestDate);

        // request date is at his 63th birthday
        expect(ratio).toBe(0);
    });

    it('should return 1 when request date is exactly the same as the participant 65th (minimum age) birthday', () => {
        const birthDate = new Date('1980-01-01T12:00:00');
        const requestDate = new Date('2045-01-01T12:00:00');

        const ratio = OAS.getRequestDateFactor(birthDate, requestDate);

        // request date is at his 65th birthday
        expect(ratio).toBe(1);
    });

    it('should return 1 when request date is after the participant 65th (minimum age) birthday but for less than a month ', () => {
        const birthDate = new Date('1980-01-01T12:00:00');
        const requestDate = new Date('2045-01-15T12:00:00');

        const ratio = OAS.getRequestDateFactor(birthDate, requestDate);

        // request date is two weeks after his 65th birthday
        expect(ratio).toBe(1);
    });

    /*
    it.each`
        birthdate                                   | requestAge                                    | expected
        ${new Date(1955, 0, 1)}  | ${new Date(2020, 0, 1)}    | ${1}
        ${new Date(1955, 0, 15)}  | ${new Date(2020, 1, 1)}    | ${1}
        ${new Date(1955, 0, 1)}  | ${new Date(2020, 6, 1)}    | ${1 + 6*OAS.MONTHLY_DELAY_BONUS}
        ${new Date(1955, 0, 1)}  | ${new Date(2021, 0, 1)}    | ${1 + 12*OAS.MONTHLY_DELAY_BONUS}
        ${new Date(1955, 0, 1)}  | ${new Date(2030, 0, 1)}    | ${1 + 60*OAS.MONTHLY_DELAY_BONUS}
        ${new Date(1955, 0, 1)}  | ${new Date(2019, 0, 1)}    | ${0}
    `('should round $value with a precision of $precision digits', ({ birthDate, requestAge, expected }) => {
        const AAF = OAS.getRequestDateFactor(birthDate, requestAge);

        expect(AAF).toBe(expected);
    });
    */
});
