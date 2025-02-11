/*
 Sources
 https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/registered-education-savings-plans-resps/canada-education-savings-programs-cesp/canada-education-savings-grant-cesg.html

 Last updated
 2025-02-07
 */

import { initializeSavingsGrant, SavingsGrant, SavingsGrantConfig, SuppGrantPercent } from './savings-grant';

const canadaEducationSavingsGrantConfig: SavingsGrantConfig = {
    MAX_GRANT: 7200,
    MAX_BENEFICIARY_AGE: 17,
    MAX_AMOUNT_YEARLY_FOR_GRANT: 2500,
    YEARLY_GRANT_PERCENT: 0.2,
    MAX_AMOUNT_FOR_SUPP_GRANT: 500,
    SUPP_GRANT_PERCENT: {
        LOW_INCOME: 0.2,
        MEDIUM_INCOME: 0.1,
    } as SuppGrantPercent,
};

export const CanadaEducationSavingsGrant: SavingsGrant = initializeSavingsGrant(canadaEducationSavingsGrantConfig);
