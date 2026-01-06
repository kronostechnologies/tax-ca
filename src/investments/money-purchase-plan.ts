/*
Sources
    https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html

Revised
    2026-01-06
 */

export interface MoneyPurchasePlan {
    MAX_CONTRIBUTION: number;
}

export const MONEY_PURCHASE: MoneyPurchasePlan = {
    MAX_CONTRIBUTION: 35390,
};
