import LIF from './investments/lif';
import RRIF from './investments/rrif';
import TFSA from './investments/tfsa';
import RRSP from './investments/rrsp';
import CPP from './pension/cpp';
import OAS from './pension/oas';
import QPP from './pension/qpp';
import SPP from './pension/spp';
import QPIP from './taxes/qpip';
import EI from './taxes/ei';
import INCOME_TAX from './taxes/income_tax';
import CPI from './misc/cpi';
import IQPF from './misc/iqpf';
import LIFE_EXPECTANCY from './misc/life_expectancy';

module.exports = {
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
		EI,
		INCOME_TAX,
		QPIP,
	},
	MISC: {
		CPI,
		IQPF,
		LIFE_EXPECTANCY,
	}
};
