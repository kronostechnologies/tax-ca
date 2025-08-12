import { FederalCode, ProvinceCode } from '../../misc';
import {
    unlockingPct,
    canConvert,
    canUnlock,
    getUnlockingPct,
    getMinimumConversionAge,
} from '../locked-in-retirement-account';

describe('locked-in-retirement-account', () => {
    describe('unlockingPct', () => {
        it('should have percentages for all jurisdictions', () => {
            const jurisdictions: (ProvinceCode | FederalCode)[] = ['FEDERAL', 'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'ON', 'PE', 'QC', 'SK'];
            jurisdictions.forEach(jurisdiction => {
                expect(unlockingPct[jurisdiction]).toBeDefined();
                expect(unlockingPct[jurisdiction]).toBeGreaterThanOrEqual(0);
                expect(unlockingPct[jurisdiction]).toBeLessThanOrEqual(1);
            });
        });

        it('should have correct percentages by jurisdiction', () => {
            expect(unlockingPct.FEDERAL).toBe(0.50);
            expect(unlockingPct.AB).toBe(0.50);
            expect(unlockingPct.BC).toBe(0);
            expect(unlockingPct.MB).toBe(1.00);
            expect(unlockingPct.NB).toBe(0.50);
            expect(unlockingPct.NL).toBe(0.50);
            expect(unlockingPct.NS).toBe(0.50);
            expect(unlockingPct.ON).toBe(0.50);
            expect(unlockingPct.PE).toBe(0);
            expect(unlockingPct.QC).toBe(0);
            expect(unlockingPct.SK).toBe(1.00);
        });
    });

    describe('getUnlockingPct', () => {
        it('should return correct percentage for each jurisdiction', () => {
            expect(getUnlockingPct('FEDERAL')).toBe(0.50);
            expect(getUnlockingPct('AB')).toBe(0.50);
            expect(getUnlockingPct('BC')).toBe(0);
            expect(getUnlockingPct('MB')).toBe(1.00);
            expect(getUnlockingPct('NB')).toBe(0.50);
            expect(getUnlockingPct('NL')).toBe(0.50);
            expect(getUnlockingPct('NS')).toBe(0.50);
            expect(getUnlockingPct('ON')).toBe(0.50);
            expect(getUnlockingPct('PE')).toBe(0);
            expect(getUnlockingPct('QC')).toBe(0);
            expect(getUnlockingPct('SK')).toBe(1.00);
        });
    });

    describe('canUnlock', () => {
        it('should return true for jurisdictions with unlocking percentage > 0', () => {
            expect(canUnlock('FEDERAL')).toBe(true);
            expect(canUnlock('AB')).toBe(true);
            expect(canUnlock('MB')).toBe(true);
            expect(canUnlock('NB')).toBe(true);
            expect(canUnlock('NL')).toBe(true);
            expect(canUnlock('NS')).toBe(true);
            expect(canUnlock('ON')).toBe(true);
            expect(canUnlock('SK')).toBe(true);
        });

        it('should return false for jurisdictions with 0% unlocking', () => {
            expect(canUnlock('BC')).toBe(false);
            expect(canUnlock('PE')).toBe(false);
            expect(canUnlock('QC')).toBe(false);
        });
    });

    describe('canConvert', () => {
        it('should return true when age is within valid conversion range', () => {
            expect(canConvert('FEDERAL', 70)).toBe(true);
            expect(canConvert('AB', 60)).toBe(true);
            expect(canConvert('BC', 60)).toBe(true);
            expect(canConvert('MB', 30)).toBe(true);
            expect(canConvert('NB', 30)).toBe(true);
            expect(canConvert('NL', 30)).toBe(true);
            expect(canConvert('NS', 65)).toBe(true);
            expect(canConvert('ON', 65)).toBe(true);
            expect(canConvert('PE', 30)).toBe(true);
            expect(canConvert('QC', 65)).toBe(true);
            expect(canConvert('SK', 65)).toBe(true);
        });

        it('should return false when age is below minimum conversion age', () => {
            expect(canConvert('FEDERAL', 54)).toBe(false);
            expect(canConvert('AB', 49)).toBe(false);
            expect(canConvert('BC', 49)).toBe(false);
            expect(canConvert('MB', -1)).toBe(false)
            expect(canConvert('NB', -1)).toBe(false);
            expect(canConvert('NL', -1)).toBe(false);
            expect(canConvert('NS', 54)).toBe(false);
            expect(canConvert('ON', 54)).toBe(false);
            expect(canConvert('PE', -1)).toBe(false);
            expect(canConvert('QC', 54)).toBe(false);
            expect(canConvert('SK', 54)).toBe(false);
        });

        it('should return false when age is above maximum conversion age', () => {
            expect(canConvert('FEDERAL', 72)).toBe(false);
            expect(canConvert('AB', 72)).toBe(false);
            expect(canConvert('BC', 72)).toBe(false);
            expect(canConvert('MB', 72)).toBe(false);
            expect(canConvert('NB', 72)).toBe(false);
            expect(canConvert('NL', 72)).toBe(false);
            expect(canConvert('NS', 72)).toBe(false);
            expect(canConvert('ON', 72)).toBe(false);
            expect(canConvert('PE', 72)).toBe(false);
            expect(canConvert('QC', 72)).toBe(false);
            expect(canConvert('SK', 72)).toBe(false);
        });

        it('should return true at boundary ages', () => {
            expect(canConvert('FEDERAL', 55)).toBe(true);
            expect(canConvert('FEDERAL', 71)).toBe(true);
            expect(canConvert('AB', 50)).toBe(true);
            expect(canConvert('AB', 71)).toBe(true);
            expect(canConvert('BC', 50)).toBe(true);
            expect(canConvert('BC', 71)).toBe(true);
            expect(canConvert('MB', 0)).toBe(true);
            expect(canConvert('MB', 71)).toBe(true);
            expect(canConvert('NB', 0)).toBe(true);
            expect(canConvert('NB', 71)).toBe(true);
            expect(canConvert('NL', 0)).toBe(true);
            expect(canConvert('NL', 71)).toBe(true);
            expect(canConvert('NS', 55)).toBe(true);
            expect(canConvert('NS', 71)).toBe(true);
            expect(canConvert('ON', 55)).toBe(true);
            expect(canConvert('ON', 71)).toBe(true);
            expect(canConvert('PE', 0)).toBe(true);
            expect(canConvert('PE', 71)).toBe(true);
            expect(canConvert('QC', 55)).toBe(true);
            expect(canConvert('QC', 71)).toBe(true);
            expect(canConvert('SK', 55)).toBe(true);
            expect(canConvert('SK', 71)).toBe(true);
        });

        it('should return false for invalid jurisdiction', () => {
            expect(canConvert('INVALID' as ProvinceCode, 65)).toBe(false);
        });
    });

    describe('getMinimumConversionAge', () => {
        it('should return correct minimum conversion age for each jurisdiction', () => {
            expect(getMinimumConversionAge('FEDERAL')).toBe(55);
            expect(getMinimumConversionAge('AB')).toBe(50);
            expect(getMinimumConversionAge('BC')).toBe(50);
            expect(getMinimumConversionAge('MB')).toBe(0);
            expect(getMinimumConversionAge('NB')).toBe(0);
            expect(getMinimumConversionAge('NL')).toBe(0);
            expect(getMinimumConversionAge('NS')).toBe(55);
            expect(getMinimumConversionAge('ON')).toBe(55);
            expect(getMinimumConversionAge('PE')).toBe(0);
            expect(getMinimumConversionAge('QC')).toBe(55);
            expect(getMinimumConversionAge('SK')).toBe(55);
        });

        it('should throw error for invalid jurisdiction', () => {
            expect(() => getMinimumConversionAge('INVALID' as ProvinceCode))
                .toThrow('Conversion rules not defined for jurisdiction: INVALID');
        });
    });
});
