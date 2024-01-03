/*
Sources
    https://www.canada.ca/en/treasury-board-secretariat/services/pension-plan/plan-information/retirement-income-sources.html
Revised
    2023-12-27
*/

export interface SupplementalPensionPlan {
    MAX_BRIDGE_BENEFIT_AGE: number;
    MIN_AGE: number;
}

export const SPP: SupplementalPensionPlan = {
    MAX_BRIDGE_BENEFIT_AGE: 65,
    MIN_AGE: 55,
};
