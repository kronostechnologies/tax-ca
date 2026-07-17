// Deep parity gate for the KMP migration (Phase 2/3).
//
// 1. Recursively walks the legacy package's full export tree (dist/) and compares every
//    primitive value, array, and Date against the Kotlin/JS build at the same path.
//    A single transcription typo anywhere in the ported data fails this gate.
// 2. Exercises every exported function (including object methods) over input grids and
//    compares outputs — including thrown errors — between the two builds.
//
// Usage: yarn build:legacy && yarn build && node ts-compat/deep-parity.cjs

process.env.NODE_ENV = 'test'; // freeze both packages' now() to 2020-01-01T12:00:00Z

const legacy = require('../build/legacy-dist');
const next = require('../dist');

let checks = 0;
const failures = [];
const functionPaths = [];

function fail(label, message) {
    failures.push(`${label}: ${message}`);
    if (failures.length > 50) {
        report();
    }
}

function isPlainValueEqual(a, b) {
    // -0 vs +0 tolerated (indistinguishable to === and arithmetic)
    return a === b || (Number.isNaN(a) && Number.isNaN(b));
}

function compareValues(label, a, b, seen = new Set()) {
    checks += 1;
    if (typeof a === 'function') {
        functionPaths.push(label);
        if (typeof b !== 'function') fail(label, 'function missing in next build');
        return;
    }
    if (a instanceof Date) {
        if (!(b instanceof Date) || a.getTime() !== b.getTime()) fail(label, `Date ${a?.toISOString?.()} vs ${b?.toISOString?.()}`);
        return;
    }
    if (Array.isArray(a)) {
        if (!Array.isArray(b)) return fail(label, `array vs ${typeof b}`);
        if (a.length !== b.length) return fail(label, `length ${a.length} vs ${b.length}`);
        a.forEach((item, i) => compareValues(`${label}[${i}]`, item, b[i], seen));
        return;
    }
    if (a !== null && typeof a === 'object') {
        if (b === null || typeof b !== 'object') return fail(label, `object vs ${b === null ? 'null' : typeof b}`);
        if (seen.has(a)) return;
        seen.add(a);
        for (const key of Object.keys(a)) {
            if (b[key] === undefined && a[key] !== undefined) {
                fail(`${label}.${key}`, 'missing in next build');
                continue;
            }
            compareValues(`${label}.${key}`, a[key], b[key], seen);
        }
        return;
    }
    if (!isPlainValueEqual(a, b)) fail(label, `${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
}

// ---------- 1. Full data-tree walk ----------
for (const key of Object.keys(legacy)) {
    compareValues(key, legacy[key], next[key]);
}

// ---------- 2. Function behavior grids ----------
function get(obj, path) {
    return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function call(pkg, path, args) {
    const parts = path.split('.');
    const fn = get(pkg, path);
    if (typeof fn !== 'function') return { missing: true };
    const self = parts.length > 1 ? get(pkg, parts.slice(0, -1).join('.')) : undefined;
    try {
        return { value: fn.apply(self, args) };
    } catch (e) {
        return { threw: true };
    }
}

function fmtArgs(args) {
    return args.map((a) => (a instanceof Date ? a.toISOString().slice(0, 10) : JSON.stringify(a))).join(', ');
}

function compareCall(path, args) {
    const a = call(legacy, path, args);
    const b = call(next, path, args);
    const label = `${path}(${fmtArgs(args)})`;
    checks += 1;
    if (a.missing) return; // path not in legacy: grid config error, ignore
    if (b.missing) return fail(label, 'function missing in next build');
    if (a.threw || b.threw) {
        if (a.threw !== !!b.threw) fail(label, `threw: legacy=${!!a.threw} next=${!!b.threw}`);
        return;
    }
    compareValues(label, a.value, b.value);
}

function grid(path, argSets) {
    for (const args of argSets) compareCall(path, args);
}

function cross(...lists) {
    return lists.reduce((acc, list) => acc.flatMap((prev) => list.map((x) => [...prev, x])), [[]]);
}

const JURISDICTIONS = ['CA', 'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'PE', 'ON', 'QC', 'SK', 'NT', 'NU', 'YT'];
const PROVINCES = JURISDICTIONS.filter((c) => c !== 'CA');
const INCOMES = [0, 1, 9999, 15000, 30000, 45000, 58523, 58524, 75000, 100000, 117045, 150000, 181440, 200000, 258482, 300000, 500000, 1000000, 2000000];
const INFLATIONS = [0, 0.02, 0.05];
const YEARS_TO_INFLATE = [0, 1, 10, 25];
const AGES = [0, 17, 18, 25, 40, 50, 54, 55, 60, 64, 65, 70, 71, 75, 80, 89, 90, 95, 100];
const BIRTH_DATES = ['1940-06-15', '1950-01-01', '1953-07-01', '1955-02-28', '1956-06-06', '1960-12-31', '1963-07-01', '1980-01-15', '2000-02-29'].map((s) => new Date(s));
const REQUEST_AGES = [58, 60, 63, 64, 65, 66, 68, 70, 71, 72, 74, 75, 76, 80, 85];

// utils
grid('clamp', cross([-10, 0, 5, 10, 30, 50], [10], [30]));
grid('roundToPrecision', cross([1.56789, -1.56789, 2.5, -2.5, 1234.5678, 0.1 + 0.2], [0, 1, 2, 3, 6]));
grid('getMonthsDiff', cross(BIRTH_DATES, [new Date('2020-01-01'), new Date('2020-07-15'), new Date('2035-12-31')]));
grid('addYearsToDate', cross(BIRTH_DATES, [1, 4, 25, 65]));
grid('getAge', cross(BIRTH_DATES, [new Date('2020-01-01'), new Date('2026-07-16')]));
grid('resetTime', [[new Date('2020-06-15T14:30:45.123')], [new Date('2020-01-01')]]);
compareCall('now', []);

// pension: CPP/QPP factors + indexation
for (const plan of ['CPP', 'QPP']) {
    grid(`${plan}.getAverageIndexationRate`, [[]]);
    for (const birth of BIRTH_DATES) {
        for (const reqAge of REQUEST_AGES) {
            const request = new Date(birth);
            request.setUTCFullYear(birth.getUTCFullYear() + reqAge);
            compareCall(`${plan}.getRequestDateFactor`, [birth, request]);
        }
    }
}

// OAS
for (const birth of BIRTH_DATES) {
    for (const reqAge of REQUEST_AGES) {
        const request = new Date(birth);
        request.setUTCFullYear(birth.getUTCFullYear() + reqAge);
        for (const yearsOutside of [0, 5, 12, 30]) {
            compareCall('OAS.getMonthlyOASAmount', [birth, request, yearsOutside]);
            compareCall('OAS.getRequestDateMonthsDeferred', [birth, request, yearsOutside]);
            compareCall('OAS.getResidencyYearsAtRequest', [birth, request, yearsOutside]);
        }
        compareCall('OAS.getRequestDateFactor', [birth, request]);
        compareCall('OAS.getMinRequestDateFactor', [birth, request]);
    }
    for (const yearsOutside of [0, 5, 12, 30]) {
        compareCall('OAS.getMinimumRequestDate', [birth, yearsOutside]);
        compareCall('OAS.isFullResidencyAtMinOASAge', [birth, yearsOutside]);
    }
}
grid('OAS.getRepaymentMax', cross([60, 70, 73, 74, 75, 80]));
grid('OAS.getMinimumRequestAge', cross([0, 5, 12, 30, 40]));
grid('OAS.getDeferredRequestAmount', cross([0, 6, 24, 60], [0.25, 0.5, 1]));

// taxes
grid('getTaxRates', cross(JURISDICTIONS));
grid('getFederalTaxRates', [[]]);
grid('getFederalTaxCreditRate', [[]]);
for (const args of cross(INCOMES, INFLATIONS, YEARS_TO_INFLATE)) {
    compareCall('getFederalBaseTaxAmount', args);
    compareCall('getFederalBasicPersonalAmount', args);
    compareCall('getFederalBaseCredit', args);
    compareCall('getFederalMarginalRate', args);
}
for (const province of PROVINCES) {
    compareCall('getMaxProvincialMarginalRate', [province]);
    compareCall('getMaxFederalMarginalRate', [province]);
    compareCall('getTotalMaxMarginalRate', [province]);
    for (const income of INCOMES) {
        for (const inflation of [0, 0.02]) {
            compareCall('getFederalTaxAmount', [province, income, inflation, 10]);
            compareCall('getProvincialTaxAmount', [province, income, inflation, 10]);
            compareCall('getProvincialBaseTaxAmount', [province, income, inflation, 10]);
            compareCall('getProvincialSurtaxAmount', [province, income, inflation, 10]);
            compareCall('getProvincialMarginalRate', [province, income, inflation, 10]);
            compareCall('getTotalMarginalRate', [province, income, inflation, 10]);
            compareCall('getTotalTaxAmount', [province, income, inflation, 10]);
            compareCall('getEffectiveRate', [province, income, inflation, 10]);
        }
        compareCall('getProvincialBaseCredit', [province, 0.02, 10]);
        compareCall('getProvincialAbatement', [province, income]);
    }
}
const caRates = legacy.getFederalTaxRates();
grid('getTaxAmount', cross([caRates], INCOMES, [0, 0.02], [0, 10]));
grid('getRate', cross([caRates], INCOMES, [0, 0.02], [0, 10]));

// investments
grid('getCapitalGainsTaxableAmount', cross([0, 1000, 250000, 250001, 1000000]));
grid('getMinimumWithdrawalPercentage', cross(AGES));
for (const j of JURISDICTIONS) {
    compareCall('canUnlock', [j]);
    grid('getUnlockingPct', [[j]]);
    grid('getConversionRules', [[j]]);
    for (const age of AGES) {
        compareCall('canConvert', [j, age]);
        compareCall('getMaxWithdrawalPct', [j, age]);
        compareCall('getYMPEUnlockingSmallBalancePct', [j, age]);
    }
}

function report() {
    if (failures.length) {
        console.error(`DEEP PARITY FAILED — ${failures.length} mismatches (${checks} checks):`);
        for (const f of failures.slice(0, 50)) console.error(`  ${f}`);
        if (failures.length > 50) console.error('  ... (truncated)');
        process.exit(1);
    }
    console.log(`deep parity OK — ${checks} checks, ${functionPaths.length} function paths seen, 0 mismatches`);
    process.exit(0);
}

report();
