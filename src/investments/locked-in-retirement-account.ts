/*
Revised
    2025-08-12
*/

import { ByJurisdiction, FederalCode, ProvinceCode } from '../misc';

interface ConversionRule {
    minimumAge: number;
    maximumAge: number;
}

export const MAX_CONVERSION_AGE = 71;

export const conversionRules: ByJurisdiction<ConversionRule> = {
    FEDERAL: { minimumAge: 55, maximumAge: MAX_CONVERSION_AGE },
    AB: { minimumAge: 50, maximumAge: MAX_CONVERSION_AGE },
    BC: { minimumAge: 50, maximumAge: MAX_CONVERSION_AGE },
    MB: { minimumAge: 0, maximumAge: MAX_CONVERSION_AGE },
    NB: { minimumAge: 0, maximumAge: MAX_CONVERSION_AGE },
    NL: { minimumAge: 0, maximumAge: MAX_CONVERSION_AGE },
    NS: { minimumAge: 55, maximumAge: MAX_CONVERSION_AGE },
    ON: { minimumAge: 55, maximumAge: MAX_CONVERSION_AGE },
    PE: { minimumAge: 0, maximumAge: MAX_CONVERSION_AGE },
    QC: { minimumAge: 55, maximumAge: MAX_CONVERSION_AGE },
    SK: { minimumAge: 55, maximumAge: MAX_CONVERSION_AGE }
}

export const unlockingPct: ByJurisdiction<number> = {
    FEDERAL: 0.50,
    AB: 0.50,
    BC: 0,
    MB: 1.00,
    NB: 0.50,
    NL: 0.50,
    NS: 0.50,
    ON: 0.50,
    PE: 0,
    QC: 0,
    SK: 1.00
};

export const getUnlockingPct = (jurisdiction: ProvinceCode | FederalCode): number => {
    const rule = unlockingRules[jurisdiction];
    if (!rule) {
        throw new Error(`Unlocking rules not defined for jurisdiction: ${jurisdiction}`);
    }
    return rule.percentage;
};

export const canUnlock = (jurisdiction: ProvinceCode | FederalCode): boolean => {
    const rule = unlockingRules[jurisdiction];
    if (!rule) return false;
    return rule.percentage > 0;
};

export const canConvert = (jurisdiction: ProvinceCode | FederalCode, age: number): boolean => {
    const rule = conversionRules[jurisdiction];
    if (!rule) return false;
    return age >= rule.minimumAge && age <= rule.maximumAge;
};

export const getMinimumConversionAge = (jurisdiction: ProvinceCode | FederalCode): number => {
    const rule = conversionRules[jurisdiction];
    if (!rule) {
        throw new Error(`Conversion rules not defined for jurisdiction: ${jurisdiction}`);
    }
    return rule.minimumAge;
};
