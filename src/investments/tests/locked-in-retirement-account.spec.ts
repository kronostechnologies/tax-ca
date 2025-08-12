import { FederalCode, ProvinceCode } from '../../misc';
import {
    MAX_CONVERSION_AGE,
    conversionRules,
    unlockingPct,
    canConvert,
    canUnlock,
} from '../locked-in-retirement-account';

describe('locked-in-retirement-account', () => {
    describe('MAX_CONVERSION_AGE', () => {
        it('should be set to 71', () => {
            expect(MAX_CONVERSION_AGE).toBe(71);
        });
    });

    describe('conversionRules', () => {
        it('should have rules for all jurisdictions', () => {
            const jurisdictions: (ProvinceCode | FederalCode)[] = [
                'CA',
                'AB',
                'BC',
                'MB',
                'NB',
                'NL',
                'NS',
                'NT',
                'NU',
                'ON',
                'PE',
                'QC',
                'SK',
                'YT',
            ];
            jurisdictions.forEach((jurisdiction) => {
                expect(conversionRules[jurisdiction]).toBeDefined();
            });
        });

        it('should have correct conversion rules by jurisdiction', () => {
            expect(conversionRules.CA).toEqual({ minimumAge: 55, maximumAge: MAX_CONVERSION_AGE });
            expect(conversionRules.AB).toEqual({ minimumAge: 50, maximumAge: MAX_CONVERSION_AGE });
            expect(conversionRules.BC).toEqual({ minimumAge: 50, maximumAge: MAX_CONVERSION_AGE });
            expect(conversionRules.MB).toEqual({ minimumAge: 0, maximumAge: MAX_CONVERSION_AGE });
            expect(conversionRules.NB).toEqual({ minimumAge: 0, maximumAge: MAX_CONVERSION_AGE });
            expect(conversionRules.NL).toEqual({ minimumAge: 55, maximumAge: MAX_CONVERSION_AGE });
            expect(conversionRules.NS).toEqual({ minimumAge: 55, maximumAge: MAX_CONVERSION_AGE });
            expect(conversionRules.NT).toBe(null);
            expect(conversionRules.NU).toBe(null);
            expect(conversionRules.ON).toEqual({ minimumAge: 55, maximumAge: MAX_CONVERSION_AGE });
            expect(conversionRules.PE).toBe(null);
            expect(conversionRules.QC).toEqual({ minimumAge: 55, maximumAge: MAX_CONVERSION_AGE });
            expect(conversionRules.SK).toEqual({ minimumAge: 55, maximumAge: MAX_CONVERSION_AGE });
            expect(conversionRules.YT).toBe(null);
        });
    });

    describe('unlockingPct', () => {
        it('should have values defined for all jurisdictions', () => {
            const jurisdictions: (ProvinceCode | FederalCode)[] = [
                'CA',
                'AB',
                'BC',
                'MB',
                'NB',
                'NL',
                'NS',
                'NT',
                'NU',
                'ON',
                'PE',
                'QC',
                'SK',
                'YT',
            ];
            jurisdictions.forEach((jurisdiction) => {
                expect(unlockingPct[jurisdiction]).toBeDefined();
            });
        });

        it('should have correct percentages by jurisdiction', () => {
            expect(unlockingPct.CA).toBe(0.50);
            expect(unlockingPct.AB).toBe(0.50);
            expect(unlockingPct.BC).toBe(null);
            expect(unlockingPct.MB).toBe(1.00);
            expect(unlockingPct.NB).toBe(0.50);
            expect(unlockingPct.NL).toBe(0.50);
            expect(unlockingPct.NS).toBe(0.50);
            expect(unlockingPct.NT).toBe(null);
            expect(unlockingPct.NU).toBe(null);
            expect(unlockingPct.ON).toBe(0.50);
            expect(unlockingPct.PE).toBe(null);
            expect(unlockingPct.QC).toBe(null);
            expect(unlockingPct.SK).toBe(1.00);
            expect(unlockingPct.YT).toBe(null);
        });
    });

    describe('canUnlock', () => {
        it('should return true for jurisdictions with unlocking percentage > 0', () => {
            expect(canUnlock('CA')).toBe(true);
            expect(canUnlock('AB')).toBe(true);
            expect(canUnlock('MB')).toBe(true);
            expect(canUnlock('NB')).toBe(true);
            expect(canUnlock('NL')).toBe(true);
            expect(canUnlock('NS')).toBe(true);
            expect(canUnlock('ON')).toBe(true);
            expect(canUnlock('SK')).toBe(true);
        });

        it('should return false for jurisdictions with null unlocking rules', () => {
            expect(canUnlock('BC')).toBe(false);
            expect(canUnlock('NT')).toBe(false);
            expect(canUnlock('NU')).toBe(false);
            expect(canUnlock('PE')).toBe(false);
            expect(canUnlock('QC')).toBe(false);
            expect(canUnlock('YT')).toBe(false);
        });
    });

    describe('canConvert', () => {
        it('should return true when age is within valid conversion range', () => {
            expect(canConvert('CA', 70)).toBe(true);
            expect(canConvert('AB', 60)).toBe(true);
            expect(canConvert('BC', 60)).toBe(true);
            expect(canConvert('MB', 30)).toBe(true);
            expect(canConvert('NB', 30)).toBe(true);
            expect(canConvert('NL', 65)).toBe(true);
            expect(canConvert('NS', 65)).toBe(true);
            expect(canConvert('ON', 65)).toBe(true);
            expect(canConvert('QC', 65)).toBe(true);
            expect(canConvert('SK', 65)).toBe(true);
        });

        it('should return false when age is below minimum conversion age', () => {
            expect(canConvert('CA', 54)).toBe(false);
            expect(canConvert('AB', 49)).toBe(false);
            expect(canConvert('BC', 49)).toBe(false);
            expect(canConvert('MB', -1)).toBe(false);
            expect(canConvert('NB', -1)).toBe(false);
            expect(canConvert('NL', 54)).toBe(false);
            expect(canConvert('NS', 54)).toBe(false);
            expect(canConvert('ON', 54)).toBe(false);
            expect(canConvert('QC', 54)).toBe(false);
            expect(canConvert('SK', 54)).toBe(false);
        });

        it('should return false when age is above maximum conversion age', () => {
            expect(canConvert('CA', 72)).toBe(false);
            expect(canConvert('AB', 72)).toBe(false);
            expect(canConvert('BC', 72)).toBe(false);
            expect(canConvert('MB', 72)).toBe(false);
            expect(canConvert('NB', 72)).toBe(false);
            expect(canConvert('NL', 72)).toBe(false);
            expect(canConvert('NS', 72)).toBe(false);
            expect(canConvert('ON', 72)).toBe(false);
            expect(canConvert('QC', 72)).toBe(false);
            expect(canConvert('SK', 72)).toBe(false);
        });

        it('should return true at boundary ages', () => {
            expect(canConvert('CA', 55)).toBe(true);
            expect(canConvert('CA', 71)).toBe(true);
            expect(canConvert('AB', 50)).toBe(true);
            expect(canConvert('AB', 71)).toBe(true);
            expect(canConvert('BC', 50)).toBe(true);
            expect(canConvert('BC', 71)).toBe(true);
            expect(canConvert('MB', 0)).toBe(true);
            expect(canConvert('MB', 71)).toBe(true);
            expect(canConvert('NB', 0)).toBe(true);
            expect(canConvert('NB', 71)).toBe(true);
            expect(canConvert('NL', 55)).toBe(true);
            expect(canConvert('NL', 71)).toBe(true);
            expect(canConvert('NS', 55)).toBe(true);
            expect(canConvert('NS', 71)).toBe(true);
            expect(canConvert('ON', 55)).toBe(true);
            expect(canConvert('ON', 71)).toBe(true);
            expect(canConvert('QC', 55)).toBe(true);
            expect(canConvert('QC', 71)).toBe(true);
            expect(canConvert('SK', 55)).toBe(true);
            expect(canConvert('SK', 71)).toBe(true);
        });

        it('should return false for jurisdictions with null conversion rules', () => {
            expect(canConvert('NT', 65)).toBe(false);
            expect(canConvert('NU', 65)).toBe(false);
            expect(canConvert('PE', 65)).toBe(false);
            expect(canConvert('YT', 65)).toBe(false);
        });
    });
});
