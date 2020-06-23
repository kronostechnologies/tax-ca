import * as LIF from './investments/lif';
import RRIF from './investments/rrif';
import RRSP from './investments/rrsp';
import TFSA from './investments/tfsa';
import CPI from './misc/cpi';
import IQPF from './misc/iqpf';
import LIFE_EXPECTANCY from './misc/life-expectancy';
import CPP from './pension/cpp';
import OAS from './pension/oas';
import QPP from './pension/qpp';
import SPP from './pension/spp';

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
        CPP,
        OAS,
        QPP,
        SPP,
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
