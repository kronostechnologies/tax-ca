/*
Revised 2019-12-23
*/

export interface SupplementalPensionPlan {
    MAX_BRIDGE_BENEFIT_AGE: number;
    MIN_AGE: number;
}

export const SPP: SupplementalPensionPlan = {
    MAX_BRIDGE_BENEFIT_AGE: 65,
    MIN_AGE: 55,
};
