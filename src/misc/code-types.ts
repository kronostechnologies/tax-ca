export type ProvinceCode = 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'PE' | 'ON' | 'QC' | 'SK' | 'NT' | 'NU' | 'YT';
export type FederalCode = 'CA';
export type FederalName = 'CANADA';
export type ProvinceName =
    'ALBERTA'
    | 'BRITISH_COLUMBIA'
    | 'MANITOBA'
    | 'NEW_BRUNSWICK'
    | 'NEWFOUNDLAND'
    | 'NOVA_SCOTIA'
    | 'PRINCE_EDWARD_ISLAND'
    | 'ONTARIO'
    | 'QUEBEC'
    | 'SASKATCHEWAN'
    | 'NORTHWEST_TERRITORIES'
    | 'NUNAVUT'
    | 'YUKON';

export const PROVINCIAL_CODES: { [key in ProvinceName]: ProvinceCode } = {
    ALBERTA: 'AB',
    BRITISH_COLUMBIA: 'BC',
    MANITOBA: 'MB',
    NEW_BRUNSWICK: 'NB',
    NEWFOUNDLAND: 'NL',
    NOVA_SCOTIA: 'NS',
    PRINCE_EDWARD_ISLAND: 'PE',
    ONTARIO: 'ON',
    QUEBEC: 'QC',
    SASKATCHEWAN: 'SK',
    NORTHWEST_TERRITORIES: 'NT',
    NUNAVUT: 'NU',
    YUKON: 'YT',
};

export const FEDERAL_CODE: FederalCode = 'CA';
export type ByProvince<T> = { [key in ProvinceCode]: T };
export type ByJurisdiction<T> = { [key in ProvinceCode | FederalCode]: T };
