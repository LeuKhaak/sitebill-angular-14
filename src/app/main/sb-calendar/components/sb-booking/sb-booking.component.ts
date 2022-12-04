import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CalendarEvent, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {isSameDay, isSameMonth} from 'date-fns';
import {Subject} from 'rxjs';
import {ModelService} from '../../../../_services/model.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SbRatesEditDialogComponent} from '../sb-rates/sb-rates-edit-dialog/sb-rates-edit-dialog.component';
import {SB_MONTHS, SB_RATE_TYPES} from '../../classes/sb-calendar.constants';
import {SbCalendarService} from '../../services/sb-calendar.service';
import {takeUntil} from 'rxjs/operators';
import {SbRatesEditDialogDataModel} from '../../models/sb-rates-edit-dialog-data.model';
import {ConfirmComponent} from '../../../../dialogs/confirm/confirm.component';

@Component({
    selector: 'sb-booking',
    templateUrl: './sb-booking.component.html',
    styleUrls: [
        '../../../../../../node_modules/angular-calendar/css/angular-calendar.css',
        './sb-booking.component.scss',
    ],
})
export class SbBookingComponent implements OnInit, OnDestroy {
    @Input('keyValue') set setKeyValue(value) {
        if (!value) {
            return;
        }
        this.keyValue = value;
        this.initEventsList();
    }

    @ViewChild('modalContent') modalContent: TemplateRef<any>;

    keyValue: string;

    view: CalendarView = CalendarView.Month;

    CalendarView = CalendarView;

    viewDate: Date = new Date();

    refresh: Subject<any> = new Subject();

    rateTypes = SB_RATE_TYPES;

    activeDayIsOpen = true;

    confirmDialogRef: MatDialogRef<ConfirmComponent>;

    private readonly destroy$ = new Subject<void>();

    constructor(
        protected modelService: ModelService,
        public editRatesDialog: MatDialog,
        public calendarService: SbCalendarService,
    ) {
    }

    ngOnInit(): void {
        this.initEventsSubscription();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    initEventsList() {
        this.updateEventsList();
    }

    initEventsSubscription() {
        this.calendarService.updateEventsTrigger$
            .pipe(
                takeUntil(this.destroy$),
            )
            .subscribe(() => {
                this.updateEventsList();
            });
    }

    getMonthTitle() {
        if (this.viewDate) {
            return `${SB_MONTHS[this.viewDate.getMonth()].title} ${this.viewDate.getFullYear()}`;
        }
        return '';
    }

    dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
            this.viewDate = date;
        }
    }

    eventTimesChanged(
        {
            event,
            newStart,
            newEnd
        }: CalendarEventTimesChangedEvent
    ) {

        const events = this.calendarService.events.map((item) => {
            if (item === event) {
                return {
                    ...event,
                    start: newStart,
                    end: newEnd
                };
            }
            return item;
        });

        this.calendarService.events$.next(events);
    }

    onViewDateUpdate() {
        this.activeDayIsOpen = false;
        this.updateEventsList();
    }

    onEditRatesClick(event, viewDate, keyValue) {
        const data: SbRatesEditDialogDataModel = {
            event,
            viewDate,
            keyValue
        };

        const dialogRef = this.editRatesDialog.open(SbRatesEditDialogComponent, {
            data,
            panelClass: 'rates-edit-dialog',
        });

        dialogRef.afterClosed().subscribe((result) => {
            // console.log(result);
        });
    }

    private updateEventsList() {
        this.calendarService.updateEventsList(this.keyValue, this.viewDate)
            .pipe(
                takeUntil(this.destroy$),
            )
            .subscribe(() => true);
    }

    onDeleteRatesClick(keyValue: string) {

        this.confirmDialogRef = this.editRatesDialog.open(ConfirmComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Вы уверены, что хотите удалить запись?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.calendarService.deleteRate(keyValue).subscribe((result_delete) => {
                    this.updateEventsList();
                });
            }
            this.confirmDialogRef = null;
        });

    }
}