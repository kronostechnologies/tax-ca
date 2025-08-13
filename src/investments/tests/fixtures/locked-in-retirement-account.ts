import { ByJurisdiction, FederalCode, ProvinceCode } from '../../../misc';
import { ConversionRule } from '../../locked-in-retirement-account';

const MOCKED_MAX_CONVERSION_AGE = 71;

export const mockedUnlockingPct: ByJurisdiction<number | null> = {
    CA: 0.50,
    AB: 0.50,
    BC: 0,
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

export const mockedConversionRules: ByJurisdiction<ConversionRule | null> = {
    CA: { minimumAge: 55, maximumAge: MOCKED_MAX_CONVERSION_AGE },
    AB: { minimumAge: 50, maximumAge: MOCKED_MAX_CONVERSION_AGE },
    BC: { minimumAge: 50, maximumAge: MOCKED_MAX_CONVERSION_AGE },
    MB: { minimumAge: 0, maximumAge: MOCKED_MAX_CONVERSION_AGE },
    NB: { minimumAge: 0, maximumAge: MOCKED_MAX_CONVERSION_AGE },
    NL: { minimumAge: 55, maximumAge: MOCKED_MAX_CONVERSION_AGE },
    NS: { minimumAge: 55, maximumAge: MOCKED_MAX_CONVERSION_AGE },
    NT: null,
    NU: null,
    ON: { minimumAge: 55, maximumAge: MOCKED_MAX_CONVERSION_AGE },
    PE: null,
    QC: { minimumAge: 55, maximumAge: MOCKED_MAX_CONVERSION_AGE },
    SK: { minimumAge: 55, maximumAge: MOCKED_MAX_CONVERSION_AGE },
    YT: null,
};

export const jurisdictions: (ProvinceCode | FederalCode)[] = [
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
