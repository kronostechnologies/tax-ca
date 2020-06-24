import * as LIF from './investments/lif';
import RRIF from './investments/rrif';
import RRSP from './investments/rrsp';
import TFSA from './investments/tfsa';
import CPI from './misc/cpi';
import IQPF from './misc/iqpf';
import LIFE_EXPECTANCY from './misc/life-expectancy';

import * as CanadaPensionPlan from './pension/canada-pension-plan';
import * as OldAgeSecurity from './pension/old-age-security';
import * as PublicPensionPlan from './pension/public-pension-plan';
import * as QuebecPensionPlan from './pension/quebec-pension-plan';
import * as SupplementalPensionPlan from './pension/supplemental-pension-plan';

import * as EmploymentInsurance from './taxes/employment-insurance';
import * as IncomeTax from './taxes/income-tax';
import * as QuebecParentalInsurancePlan from './taxes/quebec-parental-insurance-plan';

export = {
    INVESTMENTS: {
        LIF,
        RRIF,
        TFSA,
        RRSP,
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
        CPI,
        IQPF,
        LIFE_EXPECTANCY,
    },
};
