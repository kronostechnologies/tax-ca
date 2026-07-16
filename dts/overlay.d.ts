// Hand-maintained TypeScript declaration overlay, appended to the Kotlin-generated
// tax-ca.d.ts by the `jsNodeProductionLibraryDistribution` task (see build.gradle.kts).
//
// Kotlin `external interface` types (used for structured function INPUTS so plain JS
// objects work without name mangling) are referenced by the generated declarations but
// not emitted — they are declared here instead.

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
