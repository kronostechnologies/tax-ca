/*
Sources
    https://www.canada.ca/en/treasury-board-secretariat/services/pension-plan/plan-information/retirement-income-sources.html

    NOT USED IN FNA-ENGINE

Last revision
    2024-12-24
*/

export interface SupplementalPensionPlan {
    MAX_BRIDGE_BENEFIT_AGE: number;
    MIN_AGE: number;
}

export const SPP: SupplementalPensionPlan = {
    MAX_BRIDGE_BENEFIT_AGE: 65,
    MIN_AGE: 55,
};
