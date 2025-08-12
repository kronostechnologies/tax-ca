import * as LiraModule from '../locked-in-retirement-account';
import {
    canConvert,
    canUnlock,
} from '../locked-in-retirement-account';
import {
    mockedConversionRules,
} from './fixtures/locked-in-retirement-account';

describe('locked-in-retirement-account', () => {
    describe('canUnlock', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('should return true for jurisdictions with unlocking percentage > 0', () => {
            jest.spyOn(LiraModule, 'getUnlockingPct').mockReturnValue(0.5);
            expect(canUnlock('CA')).toBe(true);
        });

        it('should return false for jurisdictions with null unlocking rules', () => {
            jest.spyOn(LiraModule, 'getUnlockingPct').mockReturnValue(null);
            expect(canUnlock('CA')).toBe(false);
        });

        it('should returns false when unlockingPct is 0', () => {
            jest.spyOn(LiraModule, 'getUnlockingPct').mockReturnValue(0);
            expect(canUnlock('CA')).toBe(false);
        });
    });

    describe('canConvert', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('should return true when age is within valid conversion range', () => {
            jest.spyOn(LiraModule, 'getConversionRules').mockReturnValue(mockedConversionRules.CA);
            expect(canConvert('CA', 70)).toBe(true);
        });

        it('should return false when age is below minimum conversion age', () => {
            jest.spyOn(LiraModule, 'getConversionRules').mockReturnValue(mockedConversionRules.CA);
            expect(canConvert('CA', 54)).toBe(false);
        });

        it('should return false when age is above maximum conversion age', () => {
            jest.spyOn(LiraModule, 'getConversionRules').mockReturnValue(mockedConversionRules.CA);
            expect(canConvert('CA', 72)).toBe(false);
        });

        it('should return true at boundary ages', () => {
            jest.spyOn(LiraModule, 'getConversionRules').mockReturnValue(mockedConversionRules.CA);
            expect(canConvert('CA', 55)).toBe(true);
            expect(canConvert('CA', 71)).toBe(true);
        });

        it('should return false for jurisdictions with null conversion rules', () => {
            jest.spyOn(LiraModule, 'getConversionRules').mockReturnValue(mockedConversionRules.NT);
            expect(canConvert('CA', 65)).toBe(false);
        });
    });
});
