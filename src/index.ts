import * as LifeIncomeFund from './investments/life-income-fund';
import * as RegisteredRetirementIncomeFund from './investments/registered-retirement-income-fund';
import * as RegisteredRetirementSavingsPlan from './investments/registered-retirement-savings-plan';
import * as TaxFreeSavingsAccount from './investments/tax-free-savings-account';

import * as CanadaPensionPlan from './pension/canada-pension-plan';
import * as OldAgeSecurity from './pension/old-age-security';
import * as PublicPensionPlan from './pension/public-pension-plan';
import * as QuebecPensionPlan from './pension/quebec-pension-plan';
import * as SupplementalPensionPlan from './pension/supplemental-pension-plan';

import * as EmploymentInsurance from './taxes/employment-insurance';
import * as IncomeTax from './taxes/income-tax';
import * as QuebecParentalInsurancePlan from './taxes/quebec-parental-insurance-plan';

import * as ConsumerPriceIndex from './misc/consumer-price-index';
import * as IQPFStats from './misc/iqpf-stats';
import * as LifeExpectancy from './misc/life-expectancy';

export = {
    INVESTMENTS: {
        LifeIncomeFund,
        RegisteredRetirementIncomeFund,
        RegisteredRetirementSavingsPlan,
        TaxFreeSavingsAccount,
    },
    PENSION: {
        CanadaPensionPlan,
        OldAgeSecurity,
        PublicPensionPlan,
        QuebecPensionPlan,
        SupplementalPensionPlan,
    },
    TAXES: {
        EmploymentInsurance,
        IncomeTax,
        QuebecParentalInsurancePlan,
    },
    MISC: {
        ConsumerPriceIndex,
        IQPFStats,
        LifeExpectancy,
    },
};
