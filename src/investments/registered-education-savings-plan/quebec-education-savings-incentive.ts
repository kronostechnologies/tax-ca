import { initializeSavingsGrant, SavingsGrant, SavingsGrantConfig } from './savings-grant';

const quebecEducationSavingsIncentiveConfig: SavingsGrantConfig = {
    MAX_GRANT: 3600,
    MAX_BENEFICIARY_AGE: 17,
    MAX_AMOUNT_YEARLY_FOR_GRANT: 2500,
    YEARLY_GRANT_PERCENT: 0.1,
    MAX_AMOUNT_FOR_SUPP_GRANT: 500,
    SUPP_GRANT_PERCENT: {
        LOW_INCOME: 0.1,
        MEDIUM_INCOME: 0.05,
    },
};

// eslint-disable-next-line max-len
export const QuebecEducationSavingsIncentive: SavingsGrant = initializeSavingsGrant(quebecEducationSavingsIncentiveConfig);
