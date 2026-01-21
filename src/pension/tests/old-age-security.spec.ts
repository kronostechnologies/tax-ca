import { OAS } from '../old-age-security';

describe('getRequestDateFactor', () => {
    it('should return 0 when request date is before the participant 65th (minimum age) birthday', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2043-01-01'); // at his 63th birthday

        const ratio = OAS.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(0);
    });

    it('should return 1 when request date is exactly the same as the participant 65th (minimum age) birthday', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2045-01-01'); // at his 65th birthday

        const ratio = OAS.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1);
    });

    it('should return 1 when request date before last birthday (OAS already requested)', () => {
        const birthDate = new Date('1953-07-01');
        const requestDate = new Date('2018-07-01');

        const ratio = OAS.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1);
    });

    it('should return factor relating to last birthday', () => {
        const birthDate = new Date('1963-07-01');
        const requestDate = new Date('2029-09-01'); // 2 months after 66ht birthDay

        const ratio = OAS.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + (14 * OAS.MONTHLY_DELAY_BONUS));
    });

    it('should return 1 when currently receiving payment and aged between min and max ages', () => {
        const birthDate = new Date('1956-06-06');
        const requestDate = new Date('2021-06-06');

        const ratio = OAS.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1);
    });

    it('should return 1 when request date is after the participant 65th (minimum age) birthday but for less than a month ', () => { // eslint-disable-line max-len
        const birthDate = new Date('1980-01-15');
        const requestDate = new Date('2045-02-01'); // two weeks after his 65th birthday

        const ratio = OAS.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1);
    });

    it('should return 1 + X times the MONTHLY delay bonus when waiting for x months', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2045-07-01'); // 6 months after his 65th birthday

        const ratio = OAS.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + (6 * OAS.MONTHLY_DELAY_BONUS));
    });

    it('should return 1 + 12 times the MONTHLY delay bonus when waiting for exactly a year', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2046-01-01'); // on his 66th birthday

        const ratio = OAS.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + (12 * OAS.MONTHLY_DELAY_BONUS));
    });

    it('should return 1 + 24 times the MONTHLY delay bonus when waiting for 67 and client has more than 65 yo', () => { // eslint-disable-line max-len
        const birthDate = new Date('1953-07-01');
        const requestDate = new Date('2020-07-01');

        const ratio = OAS.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + (24 * OAS.MONTHLY_DELAY_BONUS));
    });

    it('should return 1 + 60 times the MONTHLY delay bonus when waiting has max age on request', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2055-01-01'); // on his 70th birthday

        const ratio = OAS.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + (60 * OAS.MONTHLY_DELAY_BONUS));
    });

    it('should return max delay bonus (1 + 60 times the MONTHLY delay bonus) when request is after max age', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2065-01-01'); // on his 80th birthday

        const ratio = OAS.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + (60 * OAS.MONTHLY_DELAY_BONUS));
    });

    it('should compute bonus from analysis year when analysis year > reference age', () => {
        const birthDate = new Date('1953-01-01'); // 67 years old
        const requestDate = new Date('2020-09-15'); // 8 months after 67th birthday

        const ratio = OAS.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + (32 * OAS.MONTHLY_DELAY_BONUS));
    });

    it('should return 1 when analysis year is > than MAX date', () => {
        const birthDate = new Date('1948-01-01'); // 72 years old
        const requestDate = new Date('2020-01-01');

        const ratio = OAS.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1);
    });
});
describe('getMinRequestDateFactor', () => {
    it('should return factor 1 when does not have 65yo yet', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2043-01-01');

        const ratio = OAS.getMinRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1);
    });

    it('when currently receiving payment and aged between min and max ages', () => {
        const birthDate = new Date('1956-06-06');
        const requestDate = new Date('2021-06-06');

        const ratio = OAS.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1);
    });

    it('should return factor 1 when is 70yo+', () => {
        const birthDate = new Date('1945-01-01');
        const requestDate = new Date('2043-01-01');

        const ratio = OAS.getMinRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1);
    });

    it('should return factor ratio when between min and max request date', () => {
        const birthDate = new Date('1952-01-01');
        const requestDate = new Date('2043-01-01');

        const ratio = OAS.getMinRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + (36 * OAS.MONTHLY_DELAY_BONUS));
    });
});
describe('getRepaymentMax', () => {
    it('should return correct amount when below 74', () => {
        const amount = OAS.getRepaymentMax(73);
        expect(amount).toBe(OAS.REPAYMENT.MAX);
    });
    it('should return correct amount when 74', () => {
        const amount = OAS.getRepaymentMax(74);
        expect(amount).toBe(OAS.INCREASE.REPAYMENT_MAX);
    });
    it('should return correct amount when above 74', () => {
        const amount = OAS.getRepaymentMax(75);
        expect(amount).toBe(OAS.INCREASE.REPAYMENT_MAX);
    });
});
describe('getMinimumRequestAge', () => {
    it('should return 65 when no years outside Canada', () => {
        const age = OAS.getMinimumRequestAge(0);
        expect(age).toBe(65);
    });
    it('should return 65 when 35 years outside Canada', () => {
        const age = OAS.getMinimumRequestAge(35);
        expect(age).toBe(65);
    });
    it('should return 68 when 40 years outside Canada', () => {
        const age = OAS.getMinimumRequestAge(40);
        expect(age).toBe(68);
    });
    it('should return 88 when 60 years outside Canada', () => {
        const age = OAS.getMinimumRequestAge(60);
        expect(age).toBe(88);
    });
});
