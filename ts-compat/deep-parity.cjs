// Deep regression gate for the npm package.
//
// Compares the built package (dist/) against the committed golden corpus
// (ts-compat/golden.json): the full export tree (every value, every key, in order) plus
// the outputs of every exported function over dense input grids, and self-contained
// behavioral probes for the consumer patterns that once broke (spread, mutation,
// method replacement).
//
// The golden corpus was recorded on 2026-07-17 from a build verified bit-for-bit
// against the last legacy TypeScript build (18,923 checks, 0 mismatches) and against
// the real consumers (kronos-fna 231/231, fna-engine 689/689, financial-api 4/4).
//
// Verify:   yarn build && node ts-compat/deep-parity.cjs
// A yearly data revision is EXPECTED to fail this gate; regenerate deliberately with:
//           node ts-compat/deep-parity.cjs --record
// and review the golden.json diff — it lists exactly which values changed.

process.env.NODE_ENV = 'test'; // freeze now() to 2020-01-01T12:00:00Z, like the legacy package

const fs = require('node:fs');
const path = require('node:path');
const next = require('../dist');

const GOLDEN_PATH = path.join(__dirname, 'golden.json');
const RECORD = process.argv.includes('--record');

let checks = 0;
const failures = [];

function fail(label, message) {
    failures.push(`${label}: ${message}`);
    if (failures.length > 50) report(false);
}

// ---------- value encoding (JSON-safe, order-preserving) ----------
function encode(v, seen = new Set()) {
    if (typeof v === 'function') return { $: 'fn' };
    if (typeof v === 'undefined') return { $: 'undefined' };
    if (typeof v === 'number') {
        if (Number.isNaN(v)) return { $: 'NaN' };
        if (v === Infinity) return { $: 'Infinity' };
        if (v === -Infinity) return { $: '-Infinity' };
        return v; // note: -0 encodes as 0, which is the tolerated deviation
    }
    if (v instanceof Date) return { $: 'Date', v: v.toISOString() };
    if (Array.isArray(v)) return v.map((x) => encode(x, seen));
    if (v !== null && typeof v === 'object') {
        if (seen.has(v)) return { $: 'cycle' };
        seen.add(v);
        const out = {};
        for (const key of Object.keys(v)) out[key] = encode(v[key], seen);
        seen.delete(v);
        return out;
    }
    return v; // string | boolean | null
}

function isMarker(v) {
    return v !== null && typeof v === 'object' && !Array.isArray(v) && typeof v.$ === 'string';
}

function compareEncoded(label, golden, actual) {
    checks += 1;
    if (isMarker(golden) || isMarker(actual)) {
        const g = JSON.stringify(golden);
        const a = JSON.stringify(actual);
        if (g !== a) fail(label, `${g} vs ${a}`);
        return;
    }
    if (Array.isArray(golden)) {
        if (!Array.isArray(actual)) return fail(label, `array vs ${typeof actual}`);
        if (golden.length !== actual.length) return fail(label, `length ${golden.length} vs ${actual.length}`);
        golden.forEach((item, i) => compareEncoded(`${label}[${i}]`, item, actual[i]));
        return;
    }
    if (golden !== null && typeof golden === 'object') {
        if (actual === null || typeof actual !== 'object' || Array.isArray(actual)) {
            return fail(label, `object vs ${JSON.stringify(actual)}`);
        }
        const goldenKeys = Object.keys(golden);
        const actualKeys = Object.keys(actual);
        // Key SEQUENCE matters: consumers spread and enumerate these objects.
        if (goldenKeys.join(',') !== actualKeys.join(',')) {
            fail(label, `own-key sequence differs:\n  golden: ${goldenKeys.join(',')}\n  actual: ${actualKeys.join(',')}`);
        }
        for (const key of goldenKeys) compareEncoded(`${label}.${key}`, golden[key], actual[key]);
        return;
    }
    if (golden !== actual) fail(label, `${JSON.stringify(golden)} vs ${JSON.stringify(actual)}`);
}

// ---------- function call grids ----------
function get(obj, p) {
    return p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function callEncoded(p, args) {
    const parts = p.split('.');
    const fn = get(next, p);
    if (typeof fn !== 'function') return { $: 'missing' };
    const self = parts.length > 1 ? get(next, parts.slice(0, -1).join('.')) : undefined;
    try {
        return encode(fn.apply(self, args));
    } catch (e) {
        return { $: 'threw' };
    }
}

function fmtArgs(args) {
    return args.map((a) => (a instanceof Date ? a.toISOString().slice(0, 10) : JSON.stringify(a))).join(', ');
}

const calls = [];
function compareCall(p, args) {
    calls.push([`${p}(${fmtArgs(args)})`, p, args]);
}
const grid = (p, argSets) => argSets.forEach((args) => compareCall(p, args));
const cross = (...lists) => lists.reduce((acc, list) => acc.flatMap((prev) => list.map((x) => [...prev, x])), [[]]);

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
const caRates = next.getFederalTaxRates();
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

// ---------- record / verify ----------
const tree = {};
for (const key of Object.keys(next)) tree[key] = encode(next[key]);
const callResults = {};
for (const [label, p, args] of calls) callResults[label] = callEncoded(p, args);

if (RECORD) {
    fs.writeFileSync(GOLDEN_PATH, JSON.stringify({ tree, calls: callResults }, null, 1));
    console.log(`golden corpus recorded: ${Object.keys(tree).length} exports, ${calls.length} calls -> ${GOLDEN_PATH}`);
    process.exit(0);
}

if (!fs.existsSync(GOLDEN_PATH)) {
    console.error('golden.json missing — run: node ts-compat/deep-parity.cjs --record');
    process.exit(1);
}
const golden = JSON.parse(fs.readFileSync(GOLDEN_PATH, 'utf8'));

compareEncoded('exports', golden.tree, tree);
const goldenCalls = golden.calls;
for (const label of Object.keys(goldenCalls)) {
    if (!(label in callResults)) fail(label, 'call missing from grid definitions (re-record?)');
    else compareEncoded(label, goldenCalls[label], callResults[label]);
}
for (const label of Object.keys(callResults)) {
    if (!(label in goldenCalls)) fail(label, 'call not in golden corpus (re-record)');
}

// ---------- behavioral probes (self-contained consumer patterns) ----------
{
    // {...QPP} spread keeps data AND methods (plain-object facade requirement)
    const spread = { ...next.QPP };
    checks += 1;
    if (typeof spread.getRequestDateFactor !== 'function') fail('spread(QPP)', 'methods lost by object spread');
    checks += 1;
    if (Object.keys(spread).length !== Object.keys(next.QPP).length) fail('spread(QPP)', 'own-key count differs from source');
}
{
    // Test-suite mutation: assignment sticks AND is visible to later method calls
    const orig = next.OAS.MONTHLY_PAYMENT_MAX;
    next.OAS.MONTHLY_PAYMENT_MAX = 1000;
    checks += 1;
    if (next.OAS.MONTHLY_PAYMENT_MAX !== 1000) fail('OAS mutation', 'assignment not applied');
    checks += 1;
    if (next.OAS.getDeferredRequestAmount(0) !== 1000) fail('OAS mutation', 'method does not read mutated value');
    next.OAS.MONTHLY_PAYMENT_MAX = orig;
}
{
    // Nested mutation flows into plan methods
    const orig = next.CPP.MONTHLY_DELAY.BONUS;
    next.CPP.MONTHLY_DELAY.BONUS = 0.01;
    const factor = next.CPP.getRequestDateFactor(new Date('1960-01-01'), new Date('2027-01-01'));
    checks += 1;
    if (factor !== 1 + (24 * 0.01)) fail('CPP nested mutation', `expected ${1 + (24 * 0.01)}, got ${factor}`);
    next.CPP.MONTHLY_DELAY.BONUS = orig;
}
{
    // jest.spyOn pattern: replacing a method affects internal this-dispatched calls
    const orig = next.OAS.getMinimumRequestAge;
    next.OAS.getMinimumRequestAge = () => 66;
    const date = next.OAS.getMinimumRequestDate(new Date('1980-07-07'), 0);
    checks += 1;
    if (date.getTime() !== new Date('2046-07-07').getTime()) fail('OAS spyOn', `expected 2046-07-07, got ${date.toISOString()}`);
    next.OAS.getMinimumRequestAge = orig;
}
{
    // getTaxRates returns fresh mutable copies (structuredClone semantics)
    const first = next.getTaxRates('QC');
    const originalRate = first[0].RATE;
    first[0].RATE = 0.99;
    checks += 1;
    if (next.getTaxRates('QC')[0].RATE !== originalRate) fail('getTaxRates freshness', 'mutating a returned rate corrupted the source');
}

function report(exit = true) {
    if (failures.length) {
        console.error(`DEEP PARITY FAILED — ${failures.length} mismatches (${checks} checks):`);
        for (const f of failures.slice(0, 50)) console.error(`  ${f}`);
        if (failures.length > 50) console.error('  ... (truncated)');
        process.exit(1);
    }
    console.log(`deep parity OK — ${checks} checks vs golden corpus, 0 mismatches`);
    if (exit) process.exit(0);
}

report();
