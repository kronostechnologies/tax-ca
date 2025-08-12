import { FederalCode, ProvinceCode } from '../../misc';
import {
    MAX_CONVERSION_AGE,
    conversionRules,
    unlockingPct,
    canConvert,
    canUnlock,
} from '../locked-in-retirement-account';
import {
    mockedConversionRules,
    mockedUnlockingPct,
} from './fixtures/locked-in-retirement-account';

describe('locked-in-retirement-account', () => {
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
    });

    describe('canUnlock', () => {
        beforeEach(() => {
            jest.resetModules();
            jest.mock('../locked-in-retirement-account', () => {
                const originalModule = jest.requireActual('../locked-in-retirement-account');
                return {
                    __esModule: true,
                    ...originalModule,
                    unlockingPct: mockedUnlockingPct,
                };
            });
        });

        it('should return true for jurisdictions with unlocking percentage > 0', () => {
            expect(canUnlock('CA')).toBe(true);
        });

        it('should return false for jurisdictions with null unlocking rules', () => {
            expect(canUnlock('NU')).toBe(false);
        });

        it('should returns false when unlockingPct is 0', () => {
            expect(canUnlock('BC')).toBe(false);
        });
    });

    describe('canConvert', () => {
        beforeEach(() => {
            jest.resetModules();
            jest.mock('../locked-in-retirement-account', () => {
                const originalModule = jest.requireActual('../locked-in-retirement-account');
                return {
                    __esModule: true,
                    ...originalModule,
                    conversionRules: mockedConversionRules,
                };
            });
        });

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
            expect(canConvert('NT', 65)).toBe(false);
        });
    });
});
