// Type-level compatibility gate: the built package's declarations must support every
// import and usage pattern of the real consumers (fna-engine, kronos-fna — see
// docs/kmp-migration/consumers.md), under strict TypeScript. Checked with `tsc --noEmit`;
// runtime parity is covered by parity.cjs / deep-parity.cjs / jest.config.cjs.

import {
    Beneficiary,
    BritishColumbiaTrainingAndEducationSavingsGrant as BCTESG,
    ByJurisdiction,
    ByProvince,
    CanadaEducationSavingsGrant as CESG,
    CanadaLearningBond as CLB,
    canConvert,
    canUnlock,
    clamp,
    ContributionRates,
    CPP,
    DEFINED_BENEFIT,
    EI,
    ELIGIBLE_DIVIDEND,
    FEDERAL_CODE,
    FederalCode,
    getAge,
    getCapitalGainsTaxableAmount,
    getConversionRules,
    getEffectiveRate,
    getFederalBasicPersonalAmount,
    getMonthsDiff,
    getRate,
    getTotalMaxMarginalRate,
    IPF,
    LIFE_EXPECTANCY,
    NON_ELIGIBLE_DIVIDEND,
    OAS,
    PensionableEarnings,
    PPP_INCREASE_FACTOR,
    PROVINCIAL_CODES,
    ProvinceCode,
    PublicPensionPlan as Rules,
    QPIP,
    QPP,
    QuebecEducationSavingsIncentive as QESI,
    Rate,
    RESP,
    roundToPrecision,
    RRSP,
    TAX_BRACKETS,
    TFSA,
    TuitionFees,
} from '../build/dist/js/productionLibrary/tax-ca';

// misc / code types
const province: ProvinceCode = 'QC';
const federal: FederalCode = FEDERAL_CODE;
const fromNames: ProvinceCode = PROVINCIAL_CODES.QUEBEC;
const byProvince: ByProvince<number> = TuitionFees.TuitionFeesData;
const byJurisdiction: Partial<ByJurisdiction<number>> = { CA: 1, QC: 2 };
const inflation: number = IPF.INFLATION;
const deprecatedAlias: number = IPF.RETURN_RATES.INTL_DEVELOPED_MARKET_EQUITIES;
const maleLifeExpectancy: number = LIFE_EXPECTANCY.MALE[65];
const increaseFactor: number = PPP_INCREASE_FACTOR.FIRST_YEAR;

// pension
const rules: Rules = QPP;
const earnings: PensionableEarnings = CPP.PENSIONABLE_EARNINGS;
const rates: ContributionRates = QPP.CONTRIBUTION_RATES;
const ympeHistory: number = CPP.MAX_INCOME[2026];
const cppFactor: number = CPP.getRequestDateFactor(new Date('1960-01-01'), new Date('2025-01-01'));
const oasAmount: number = OAS.getMonthlyOASAmount(new Date('1960-01-01'), new Date('2025-06-01'), 0);
const dbMax: number = DEFINED_BENEFIT.MAX_CONTRIBUTION;

// taxes
const qcBracketRate: Rate = TAX_BRACKETS.QC.RATES[0];
const bpa: number | { MIN: number; MAX: number } = TAX_BRACKETS.CA.BASIC_PERSONAL_AMOUNT;
const eiRate: number = EI.PREMIUM_RATES.CA;
const qpipMax: number = QPIP.MAX_INSURABLE_EARNINGS;
const eligibleGrossUp: number = ELIGIBLE_DIVIDEND.GROSS_UP + NON_ELIGIBLE_DIVIDEND.GROSS_UP;
const effective: number = getEffectiveRate(province, 100000, 0.02, 10);
const maxMarginal: number = getTotalMaxMarginalRate(province);
const federalBpa: number = getFederalBasicPersonalAmount(100000, 0.02, 10);
const rate: number = getRate([{ FROM: 0, TO: 50000, RATE: 0.15 }], 40000, 0, 0);

// investments
const taxableGains: number = getCapitalGainsTaxableAmount(10000);
const unlockable: boolean = canUnlock(province);
const convertible: boolean = canConvert(FEDERAL_CODE, 55);
const conversionRules = getConversionRules(province);
const rrspMax: number = RRSP.MAX_CONTRIBUTION;
const tfsaMax: number = TFSA.MAX_CONTRIBUTION;

// RESP
const respMax: number = RESP.MAX_CONTRIBUTION;
const beneficiary: Beneficiary = { MAX_AGE: 0, MAX_AGE_FOR_TRANSFER: 0, MIN_AGE_FOR_TRANSFER: 0 } as unknown as Beneficiary;
const cesgGrant: typeof CESG = CESG;
const clbAmount: typeof CLB = CLB;
const qesi: typeof QESI = QESI;
const bctesg: typeof BCTESG = BCTESG;

// utils
const months: number = getMonthsDiff(new Date('2020-01-01'), new Date('2021-01-01'));
const age: number = getAge(new Date('1990-01-01'), new Date('2020-01-01'));
const clamped: number = clamp(5, 0, 10);
const rounded: number = roundToPrecision(1.2345, 2);

export const witness = {
    province, federal, fromNames, byProvince, byJurisdiction, inflation, deprecatedAlias,
    maleLifeExpectancy, increaseFactor, rules, earnings, rates, ympeHistory, cppFactor,
    oasAmount, dbMax, qcBracketRate, bpa, eiRate, qpipMax, eligibleGrossUp, effective,
    maxMarginal, federalBpa, rate, taxableGains, unlockable, convertible, conversionRules,
    rrspMax, tfsaMax, respMax, beneficiary, cesgGrant, clbAmount, qesi, bctesg, months, age,
    clamped, rounded,
};
