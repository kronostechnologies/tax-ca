import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

export function monthsDelta(firstDate: Date, secondDate: Date): number {
    return moment.range(firstDate, secondDate).diff('months');
}
