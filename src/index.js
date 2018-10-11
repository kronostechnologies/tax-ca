import tfsa from './investment/tfsa';
import rrsp from './investment/rrsp';
import cpp from './pension/cpp';
import oas from './pension/oas';
import qpp from './pension/qpp';
import spp from './pension/spp';
import qpip from './tax/qpip';
import income_tax from './tax/income_tax';
import cpi from './util/cpi';
import iqpf from './util/iqpf';
import life from './util/life';

export default {
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
		income_tax,
		qpip,
	},
	util: {
		cpi,
		iqpf,
		life
	}
};
