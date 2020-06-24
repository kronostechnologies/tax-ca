import CPI from './misc/cpi';
import IQPF from './misc/iqpf';
import LIFE_EXPECTANCY from './misc/life-expectancy';
import CPP from './pension/cpp';
import OAS from './pension/oas';
import QPP from './pension/qpp';
import SPP from './pension/spp';

import * as LifeIncomeFund from './investments/life-income-fund';
import * as RegisteredRetirementIncomeFund from './investments/registered-retirement-income-fund';
import * as RegisteredRetirementSavingsPlan from './investments/registered-retirement-savings-plan';
import * as TaxFreeSavingsAccount from './investments/tax-free-savings-account';

import * as EmploymentInsurance from './taxes/employment-insurance';
import * as IncomeTax from './taxes/income-tax';
import * as QuebecParentalInsurancePlan from './taxes/quebec-parental-insurance-plan';

export = {
    INVESTMENTS: {
        LifeIncomeFund,
        RegisteredRetirementIncomeFund,
        RegisteredRetirementSavingsPlan,
        TaxFreeSavingsAccount,
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
