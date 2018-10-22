import lif from './investments/lif';
import rrif from './investments/rrif';
import tfsa from './investments/tfsa';
import rrsp from './investments/rrsp';
import cpp from './pension/cpp';
import oas from './pension/oas';
import qpp from './pension/qpp';
import spp from './pension/spp';
import qpip from './taxes/qpip';
import ei from './taxes/ei';
import income_tax from './taxes/income_tax';
import cpi from './misc/cpi';
import iqpf from './misc/iqpf';
import life_expectancy from './misc/life_expectancy';

module.exports = {
	investments: {
		lif,
		rrif,
		tfsa,
		rrsp,
	},
	pension: {
		cpp,
		oas,
		qpp,
		spp,
	},
	taxes: {
		ei,
		income_tax,
		qpip,
	},
	misc: {
		cpi,
		iqpf,
		life_expectancy,
	}
};
