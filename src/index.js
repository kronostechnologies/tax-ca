import qpip from './tax/qpip';
import income_tax from './tax/income_tax';
import tfsa from './investment/tfsa';
import rrsp from './investment/rrsp';
import cpp from './pension/cpp';
import oas from './pension/oas';
import qpp from './pension/qpp';
import spp from './pension/spp';
import iqpf from './standard/iqpf';

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
	util: { iqpf }
};
