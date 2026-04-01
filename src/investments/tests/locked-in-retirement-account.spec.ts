import * as LiraModule from '../locked-in-retirement-account';
import {
    canConvert,
    canUnlock,
} from '../locked-in-retirement-account';
import {
    jurisdictions,
} from './fixtures/locked-in-retirement-account';

describe('locked-in-retirement-account', () => {
    describe('getUnlockingPct', () => {
        it('should return a value between 0 and 1 or null', () => {
            jurisdictions.forEach((jurisdiction) => {
                const result = LiraModule.getUnlockingPct(jurisdiction);
                expect(result === null || (typeof result === 'number' && result >= 0 && result <= 1)).toBe(true);
            });
        });
    });

    describe('canUnlock', () => {
        it('should return true for jurisdictions with unlocking percentage > 0', () => {
            expect(canUnlock('CA')).toBe(true);
        });

        it('should return false for jurisdictions with null unlocking rules', () => {
            expect(canUnlock('PE')).toBe(false);
        });

        it('should returns false when unlockingPct is 0', () => {
            expect(canUnlock('BC')).toBe(false);
        });
    });

    describe('canConvert', () => {
        it('should return true when age is within valid conversion range', () => {
            expect(canConvert('CA', 70)).toBe(true);
        });

        it('should return false when age is below minimum conversion age', () => {
            expect(canConvert('CA', 54)).toBe(false);
        });

        it('should return false when age is above maximum conversion age', () => {
            expect(canConvert('CA', 72)).toBe(false);
        });

        it('should return true at boundary ages', () => {
            expect(canConvert('CA', 55)).toBe(true);
            expect(canConvert('CA', 71)).toBe(true);
        });

        it('should return false for jurisdictions with null conversion rules', () => {
            expect(canConvert('PE', 65)).toBe(false);
        });
    });
});
