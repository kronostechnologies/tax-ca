// Type-level smoke test: the Kotlin/JS-generated declarations must support the same
// usage patterns as the legacy package (docs/kmp-migration/api-baseline.md).
// Checked with `tsc --noEmit`; runtime parity is covered by parity.cjs.

import { clamp, DEFINED_BENEFIT, roundToPrecision } from '../build/dist/js/productionLibrary/tax-ca';

const rounded: number = roundToPrecision(1.56789, 2);
const roundedDefault: number = roundToPrecision(1.5678);
const clamped: number = clamp(50, 10, 30);
const maxContribution: number = DEFINED_BENEFIT.MAX_CONTRIBUTION;

export const witness = { rounded, roundedDefault, clamped, maxContribution };
