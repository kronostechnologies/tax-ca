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

export const conversionRules: ByJurisdiction<ConversionRule | null> = {
    CA: { minimumAge: 55, maximumAge: MAX_CONVERSION_AGE },
    AB: { minimumAge: 50, maximumAge: MAX_CONVERSION_AGE },
    BC: { minimumAge: 50, maximumAge: MAX_CONVERSION_AGE },
    MB: { minimumAge: 0, maximumAge: MAX_CONVERSION_AGE },
    NB: { minimumAge: 0, maximumAge: MAX_CONVERSION_AGE },
    NL: { minimumAge: 55, maximumAge: MAX_CONVERSION_AGE },
    NS: { minimumAge: 55, maximumAge: MAX_CONVERSION_AGE },
    NT: null,
    NU: null,
    ON: { minimumAge: 55, maximumAge: MAX_CONVERSION_AGE },
    PE: null,
    QC: { minimumAge: 55, maximumAge: MAX_CONVERSION_AGE },
    SK: { minimumAge: 55, maximumAge: MAX_CONVERSION_AGE },
    YT: null,
};

export const unlockingPct: ByJurisdiction<number | null> = {
    CA: 0.50,
    AB: 0.50,
    BC: null,
    MB: 1.00,
    NB: 0.50,
    NL: 0.50,
    NS: 0.50,
    NT: null,
    NU: null,
    ON: 0.50,
    PE: null,
    QC: null,
    SK: 1.00,
    YT: null,
};

export const canUnlock = (jurisdiction: ProvinceCode | FederalCode): boolean => {
    const pct = unlockingPct[jurisdiction];
    if (!pct) return false;
    return pct > 0;
};

export const canConvert = (jurisdiction: ProvinceCode | FederalCode, age: number): boolean => {
    const rule = conversionRules[jurisdiction];
    if (!rule) return false;
    return age >= rule.minimumAge && age <= rule.maximumAge;
};
