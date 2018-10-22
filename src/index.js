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
import life from './misc/life';

module.exports = {
	investments: {
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
		life
	}
};
