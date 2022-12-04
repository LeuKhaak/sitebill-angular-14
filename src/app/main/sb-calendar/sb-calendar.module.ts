import {NgModule} from '@angular/core';

import {CalendarModule, DateAdapter} from 'angular-calendar';
import {CommonModule} from '@angular/common';
import {SbBookingComponent} from './components/sb-booking/sb-booking.component';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {SitebillPipesModule} from '../../pipes/sitebillpipes.module';
import {SbRatesFormComponent} from './components/sb-rates/sb-rates-form/sb-rates-form.component';
import {SbRatesEditDialogComponent} from './components/sb-rates/sb-rates-edit-dialog/sb-rates-edit-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SbCalendarService} from './services/sb-calendar.service';
import {SbCalendarRoutesModule} from './sb-calendar-routes.module';
import {SbBookingPageComponent} from './pages/sb-booking/sb-booking.page.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTabsModule} from "@angular/material/tabs";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";

const bundle = [
    SbBookingComponent,
    SbBookingPageComponent,
    SbRatesFormComponent,
    SbRatesEditDialogComponent,
];

@NgModule({
    imports: [
        CommonModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        FormsModule,
        ReactiveFormsModule,
        SitebillPipesModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatDatepickerModule,
        MatButtonModule,
        MatDialogModule,
        MatTabsModule,
        MatSelectModule,
        MatCheckboxModule,
        MatIconModule,
    ],
    declarations: [...bundle],
    exports: [...bundle],
    providers: [
        SbCalendarService,
    ],
    entryComponents: [
        SbRatesEditDialogComponent,
    ],
})
export class CalendarPrivateModule {
}

@NgModule({
    imports: [
        CalendarPrivateModule,
    ],
    exports: [
        ...bundle,
    ],
})
export class SbCalendarModule {
}

@NgModule({
    imports: [
        CalendarPrivateModule,
        SbCalendarRoutesModule,
    ],
    exports: [
        ...bundle,
    ]
})
export class SbCalendarModuleWithRoutes {
}