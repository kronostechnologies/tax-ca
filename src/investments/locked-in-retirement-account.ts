/*
Revised
    2025-08-12
*/

import { ByJurisdiction, FederalCode, ProvinceCode } from '../misc';

export interface ConversionRule {
    minimumAge: number;
    maximumAge: number;
}

export const MAX_CONVERSION_AGE = 71;

const federalConversionRule: ConversionRule = {
    minimumAge: 55,
    maximumAge: MAX_CONVERSION_AGE,
};

const conversionRules: ByJurisdiction<ConversionRule | null> = {
    CA: federalConversionRule,
    AB: { minimumAge: 50, maximumAge: MAX_CONVERSION_AGE },
    BC: { minimumAge: 50, maximumAge: MAX_CONVERSION_AGE },
    MB: { minimumAge: 0, maximumAge: MAX_CONVERSION_AGE },
    NB: { minimumAge: 0, maximumAge: MAX_CONVERSION_AGE },
    NL: { minimumAge: 55, maximumAge: MAX_CONVERSION_AGE },
    NS: { minimumAge: 55, maximumAge: MAX_CONVERSION_AGE },
    NT: federalConversionRule,
    NU: federalConversionRule,
    ON: { minimumAge: 55, maximumAge: MAX_CONVERSION_AGE },
    PE: null,
    QC: { minimumAge: 55, maximumAge: MAX_CONVERSION_AGE },
    SK: { minimumAge: 55, maximumAge: MAX_CONVERSION_AGE },
    YT: federalConversionRule,
};

const federalUnlockingPct: number = 0.50;

const unlockingPct: ByJurisdiction<number | null> = {
    CA: federalUnlockingPct,
    AB: 0.50,
    BC: null,
    MB: 1.00,
    NB: 0.50,
    NL: 0.50,
    NS: 0.50,
    NT: federalUnlockingPct,
    NU: federalUnlockingPct,
    ON: 0.50,
    PE: null,
    QC: null,
    SK: 1.00,
    YT: federalUnlockingPct,
};

export const getUnlockingPct = (
    jurisdiction: ProvinceCode | FederalCode,
): number | null => unlockingPct[jurisdiction];

export const getConversionRules = (
    jurisdiction: ProvinceCode | FederalCode,
): ConversionRule | null => conversionRules[jurisdiction];

export const canUnlock = (jurisdiction: ProvinceCode | FederalCode): boolean => {
    const pct = getUnlockingPct(jurisdiction);
    if (!pct) return false;
    return pct > 0;
};

export const canConvert = (jurisdiction: ProvinceCode | FederalCode, age: number): boolean => {
    const rule = getConversionRules(jurisdiction);
    if (!rule) return false;
    return age >= rule.minimumAge && age <= rule.maximumAge;
};
