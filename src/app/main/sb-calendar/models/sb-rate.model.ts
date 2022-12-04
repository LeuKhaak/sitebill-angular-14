import * as moment from 'moment';
import {Moment} from 'moment';
import {SB_RATE_TYPES} from '../classes/sb-calendar.constants';

export class SbRateModel {
    // api fields
    id?: string;
    amount: number;
    active: string | number;
    day_number?: string | number;
    month_number?: string | number;
    period_start_m?: string | number;
    period_start_d?: string | number;
    period_end_m?: string | number;
    period_end_d?: string | number;

    // local fields
    rateType: string;
    rateTypeValue: string;
    title: string;

    meta = {
        hasFieldMonth: false,
        hasFieldWeekday: false,
        hasFieldPeriod: false,
        hasFieldSeason: false,
    };

    private seasonStart: Moment;
    private seasonEnd: Moment;

    get isActive() {
        return this.active === '1' || this.active === 1;
    }

    set isActive(value: boolean) {
        this.active = value ? 1 : 0;
    }

    set season_start(value) {
        this.seasonStart = this.parseToMoment(value);
    }

    get season_start() {
        return this.seasonStart ? this.seasonStart.format('YYYY-MM-DD') : '0000-00-00';
    }

    set season_end(value) {
        this.seasonEnd = this.parseToMoment(value);
    }

    get season_end() {
        return this.seasonEnd ? this.seasonEnd.format('YYYY-MM-DD') : '0000-00-00';
    }

    set rate_type(value) {
        const valueString = value.toString().trim();
        if (valueString && SB_RATE_TYPES[valueString]) {
            this.title = SB_RATE_TYPES[valueString].title;
            this.rateType = SB_RATE_TYPES[valueString].rateType;
            this.rateTypeValue = valueString;
        }
    }

    get rate_type() {
        return this.rateTypeValue;
    }

    set period_start(value) {
        if (value && typeof value === 'string') {
            const se = value.split('-');
            if (se.length === 2) {
                this.period_start_m = parseInt(se[0], 10);
                this.period_start_d = parseInt(se[1], 10);
            }
        }
    }

    get period_start() {
        return this.period_start_d && this.period_start_m ? `${this.period_start_m}-${this.period_start_d}` : '';
    }

    set period_end(value) {
        if (value && typeof value === 'string') {
            const se = value.split('-');
            if (se.length === 2) {
                this.period_end_m = parseInt(se[0], 10);
                this.period_end_d = parseInt(se[1], 10);
            }
        }
    }

    get period_end() {
        return this.period_end_d && this.period_end_m ? `${this.period_end_m}-${this.period_end_d}` : '';
    }

    constructor(data) {
        this.update(data);
    }

    exportValue() {
        const data = {
            month_number: this.month_number ? this.month_number : 0,
            day_number: this.day_number ? this.day_number : 0,
            period_start: this.period_start,
            period_end: this.period_end,
            season_start: this.season_start,
            season_end: this.season_start,
            active: this.active,
            rate_type: this.rateTypeValue,
            amount: this.amount,
        };
        return data;
    }

    update(data) {
        if (!data) {
            return;
        }

        Object.assign(this, data);

        this.amount = data.amount ? parseFloat(data.amount) : 0;

        this.setMeta();
    }

    setMeta() {
        if (this.rateType === 'RPERIOD') {
            this.meta.hasFieldPeriod = true;
        } else if (this.rateType === 'RMONTH' || this.rateType === 'SMONTH') {
            this.meta.hasFieldMonth = true;
        } else if (this.rateType === 'RWEEKDAY' || this.rateType === 'SWEEKDAY') {
            this.meta.hasFieldWeekday = true;
        }

        if (this.rateType[0] === 'S') {
            this.meta.hasFieldSeason = true;
        }
    }

    private parseToMoment(value) {
        let prop = null;
        if (typeof value === 'object') {
            if (moment.isMoment(value)) {
                prop = value;
            } else if (value instanceof Date) {
                prop = moment(value);
            }
        } else if (typeof value === 'number') {
            prop = moment(value);
        } else if (typeof value === 'string' && value !== '0000-00-00') {
            prop = moment(value, 'YYYY-MM-DD');
        }
        return prop;
    }
}