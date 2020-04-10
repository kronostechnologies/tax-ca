import QPP from '../qpp';

describe('getRequestDateFactor', () => {
    it('should return 0 when request date is before the participant 65th (minimum age) birthday', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2039-01-01'); // at his 59th birthday

        const ratio = QPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(0);
    });

    it('should return 1 when request date is exactly the same as the participant 65th (minimum age) birthday', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2045-01-01'); // at his 65th birthday

        const ratio = QPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1);
    });

    it('should return 1 when request date is after the participant 65th (minimum age) birthday but for less than a month ', () => {
        const birthDate = new Date('1980-01-15');
        const requestDate = new Date('2045-02-01'); // two weeks after his 65th birthday

        const ratio = QPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1);
    });

    it('should return 1 + X times the MONTHLY delay bonus when waiting for x months', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2045-07-01'); // 6 months after his 65th birthday

        const ratio = QPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + 6 * QPP.MONTHLY_DELAY.BONUS);
    });

    it('should return 1 + 12 times the MONTHLY delay bonus when waiting for exactly a year', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2046-01-01'); // on his 66th birthday

        const ratio = QPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + 12 * QPP.MONTHLY_DELAY.BONUS);
    });

    it('should return 1 + 60 times the MONTHLY delay bonus when waiting has max age on request', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2055-01-01'); // on his 70th birthday

        const ratio = QPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + 60 * QPP.MONTHLY_DELAY.BONUS);
    });

    it('should return max delay bonus (1 + 60 times the MONTHLY delay bonus) when request is after max age', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2065-01-01'); // on his 80th birthday

        const ratio = QPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + 60 * QPP.MONTHLY_DELAY.BONUS);
    });

    it('should return 1 - X times the MONTHLY delay penalty when taking pension x months earlier', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2044-07-01'); // 6 months before his 65th birthday

        const ratio = QPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 - 6 * QPP.MONTHLY_DELAY.PENALTY);
    });

    it('should return 1 - 12 times the MONTHLY delay penalty when taking pension a year earlier', () => {
        const birthDate = new Date('1980-01-01');
        const requestDate = new Date('2044-01-01'); // on his 64th birthday

        const ratio = QPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 - 12 * QPP.MONTHLY_DELAY.PENALTY);
    });

    it('should compute bonus from analysis year when analysis year > reference age', () => {
        const birthDate = new Date('1953-01-01'); // 67 years old
        const requestDate = new Date('2020-09-15'); // 8 months after 67th birthday

        const ratio = QPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + 8 * QPP.MONTHLY_DELAY.BONUS);
    });

    it('should return 1 when analysis year is > than MAX date', () => {
        const birthDate = new Date('1948-01-01'); // 72 years old
        const requestDate = new Date('2020-01-01');

        const ratio = QPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1);
    });

    it('should be able to receive string or Date a param types', () => {
        const birthDate = '1980-01-01';
        const requestDate = '2045-07-01'; // 6 months after his 65th birthday

        const ratio = QPP.getRequestDateFactor(birthDate, requestDate);

        expect(ratio).toBe(1 + 6 * QPP.MONTHLY_DELAY.BONUS);
    });
});
