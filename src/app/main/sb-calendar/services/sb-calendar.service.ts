import { Injectable } from '@angular/core';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import { HttpClient } from '@angular/common/http';
import { ModelService } from '../../../_services/model.service';
import {BehaviorSubject, EMPTY, Subject} from 'rxjs';
import { SbRateModel } from '../models/sb-rate.model';
import { SB_EVENTS_STATE } from '../classes/sb-calendar.constants';
import {endOfMonth, format, startOfMonth} from 'date-fns';
import {SbCalendarHelper} from '../classes/sb-calendar-helper';
import {catchError, map, takeUntil, tap} from 'rxjs/operators';

@Injectable()
export class SbCalendarService {

    events$ = new BehaviorSubject<CalendarEvent[]>([]); // events list Observable
    eventsState$ = new BehaviorSubject(SB_EVENTS_STATE.ready); // events list current state Observable
    updateEventsTrigger$ = new Subject(); // push .next() here to trigger events$ update

    get events(): CalendarEvent[] {
        return this.events$.getValue();
    }

    constructor(
        private http: HttpClient,
        private modelService: ModelService,
    ) {

    }

    getBookingReservations(key_value, start_date, end_date) {
        const body = {
            action: 'reservation',
            do: 'calender_data',
            id: key_value,
            start: start_date,
            end: end_date,
            session_key: this.modelService.get_session_key_safe()
        };
        return this.http.post(`${ this.modelService.get_api_url() }/apps/api/rest.php`, body);
    }

    saveRate(objectId: string, model: SbRateModel) {
        const body = {
            action: 'reservation',
            do: model.id ? 'rate_edit' : 'rate_create',
            data: model.exportValue(),
            object_id: objectId,
            session_key: this.modelService.get_session_key_safe(),
        };
        if (model.id) {
            body['id'] = model.id;
        }
        return this.http.post(`${ this.modelService.get_api_url() }/apps/api/rest.php`, body);
    }

    deleteRate(objectId: string) {
        const body = {
            action: 'reservation',
            do: 'rate_delete',
            object_id: objectId,
            session_key: this.modelService.get_session_key_safe(),
        };
        return this.http.post(`${ this.modelService.get_api_url() }/apps/api/rest.php`, body);
    }


    updateEventsList(keyValue: string, viewDate: Date) {
        const start = format(startOfMonth(viewDate), SbCalendarHelper.dateFormat);
        const end = format(endOfMonth(viewDate), SbCalendarHelper.dateFormat);

        return this.getBookingReservations(keyValue, start, end)
            .pipe(
                tap(() => this.eventsState$.next(SB_EVENTS_STATE.loading)),
                catchError(() => {
                    this.events$.next([]);
                    this.eventsState$.next(SB_EVENTS_STATE.error);
                    return EMPTY;
                }),
                map((result) => {
                    this.events$.next(SbCalendarHelper.parseEventsFromBooking(result));
                    this.eventsState$.next(SB_EVENTS_STATE.ready);
                }),
            );
    }
}