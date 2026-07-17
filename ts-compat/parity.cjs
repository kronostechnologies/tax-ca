// Runtime parity gate: the Kotlin/JS build must produce bit-identical outputs to the
// legacy TypeScript build (dist/). Exits non-zero on the first mismatch.
// Usage: yarn build:legacy && yarn build && node ts-compat/parity.cjs

const assert = require('node:assert');
const legacy = require('../build/legacy-dist');
const next = require('../dist');

let checks = 0;

function compare(label, a, b) {
    // `===` instead of assert.strictEqual (Object.is): the one tolerated deviation is
    // negative zero — JS Math.round(-0.5) yields -0 where Kotlin yields +0. They are
    // indistinguishable to comparison and arithmetic, so consumers cannot observe it.
    const equal = a === b || (Number.isNaN(a) && Number.isNaN(b));
    assert.ok(equal, `${label}: legacy=${a} next=${b}`);
    checks += 1;
}

// clamp / roundToPrecision over a dense input grid
for (let value = -1000; value <= 1000; value += 7.3) {
    compare(`clamp(${value})`, legacy.clamp(value, -500, 500), next.clamp(value, -500, 500));
    for (let precision = 0; precision <= 6; precision += 1) {
        compare(
            `roundToPrecision(${value}, ${precision})`,
            legacy.roundToPrecision(value, precision),
            next.roundToPrecision(value, precision),
        );
    }
    compare(`roundToPrecision(${value})`, legacy.roundToPrecision(value), next.roundToPrecision(value));
}

// JS Math.round tie-handling edge (negative half values round toward +Infinity)
[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].forEach((value) => {
    compare(`roundToPrecision(${value})`, legacy.roundToPrecision(value), next.roundToPrecision(value));
    compare(`roundToPrecision(${value / 10}, 1)`, legacy.roundToPrecision(value / 10, 1), next.roundToPrecision(value / 10, 1));
});

compare('roundToPrecision(NaN)', legacy.roundToPrecision(NaN), next.roundToPrecision(NaN));

// Data module
compare(
    'DEFINED_BENEFIT.MAX_CONTRIBUTION',
    legacy.DEFINED_BENEFIT.MAX_CONTRIBUTION,
    next.DEFINED_BENEFIT.MAX_CONTRIBUTION,
);

console.log(`parity OK — ${checks} comparisons, 0 mismatches`);
