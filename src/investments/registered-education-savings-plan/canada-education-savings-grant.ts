/*
 Sources
 https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/registered-education-savings-plans-resps/canada-education-savings-programs-cesp/canada-education-savings-grant-cesg.html

 Last updated
 2025-02-07
 */

import { initializeSavingsGrant, SavingsGrant, SuppGrantPercent } from './savings-grant';

const MAX_GRANT = 7200;
const MAX_BENEFICIARY_AGE = 17;
const MAX_AMOUNT_YEARLY_FOR_GRANT = 2500;
const YEARLY_GRANT_PERCENT = 0.2;

const MAX_AMOUNT_FOR_SUPP_GRANT = 500;
const SUPP_GRANT_PERCENT: SuppGrantPercent = {
    LOW_INCOME: 0.2,
    MEDIUM_INCOME: 0.1,
};

export const CanadaEducationSavingsGrant: SavingsGrant = initializeSavingsGrant(
    MAX_GRANT,
    MAX_BENEFICIARY_AGE,
    MAX_AMOUNT_YEARLY_FOR_GRANT,
    YEARLY_GRANT_PERCENT,
    MAX_AMOUNT_FOR_SUPP_GRANT,
    SUPP_GRANT_PERCENT,
);
