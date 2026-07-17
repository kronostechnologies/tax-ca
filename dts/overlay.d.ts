// Hand-maintained TypeScript declaration overlay, appended to the Kotlin-generated
// tax-ca.d.ts by the `jsNodeProductionLibraryDistribution` task (see build.gradle.kts).
//
// Kotlin `external interface` types (used for structured function INPUTS so plain JS
// objects work without name mangling) are referenced by the generated declarations but
// not emitted — they are declared here instead.

// --- Type-level API the Kotlin compiler cannot express (legacy string-literal unions
// and mapped types, from src/misc/code-types.ts) ---

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
export type ByProvince<T> = { [key in ProvinceCode]: T };
export type ByJurisdiction<T> = { [key in ProvinceCode | FederalCode]: T };

// --- Legacy TS files declared an interface and a const with the same name (merged
// declarations). Kotlin cannot; the generated d.ts exports only the consts, typed with
// Resp-prefixed classes. These aliases restore the type-position names. ---

export type Beneficiary = RespBeneficiary;
export type IncomeLevel = RespIncomeLevel;
export type CanadaLearningBond = RespCanadaLearningBond;
export type BritishColumbiaTrainingAndEducationSavingsGrant = RespBritishColumbiaTrainingAndEducationSavingsGrant;
export type TuitionFees = RespTuitionFees;

// --- Index-signature table types (legacy names where they existed). Referenced by the
// declaration patches applied in build.gradle.kts. ---

export interface MaxWithdrawalPctByAge {
    [age: number]: number;
}
export interface IndividualLifeExpectancy {
    [age: number]: number;
}
export interface NumberByYear {
    [year: number]: number;
}

// --- Kotlin `external interface` input types (referenced by generated signatures but
// not emitted, since they have no runtime existence) ---

export interface RateInput {
    FROM: number;
    TO: number;
    RATE: number;
}

export interface SuppGrantPercentInput {
    LOW_INCOME: number;
    MEDIUM_INCOME: number;
}

export interface SavingsGrantConfigInput {
    MAX_GRANT: number;
    MAX_BENEFICIARY_AGE: number;
    MAX_AMOUNT_YEARLY_FOR_GRANT: number;
    YEARLY_GRANT_PERCENT: number;
    MAX_AMOUNT_FOR_SUPP_GRANT: number;
    SUPP_GRANT_PERCENT: SuppGrantPercentInput;
}
