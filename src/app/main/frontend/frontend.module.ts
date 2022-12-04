import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { FrontendComponent } from './frontend.component';
import {GridModule} from '../grid/grid.module';
import {PriceComponent} from './price.component';
import {BillingService} from '../../_services/billing.service';
import {SharedModule} from '../../shared.module';
import {PageComponent} from './page/page.component';
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatMenuModule} from "@angular/material/menu";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatTabsModule} from "@angular/material/tabs";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatRadioModule} from "@angular/material/radio";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatSliderModule} from "@angular/material/slider";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatExpansionModule} from "@angular/material/expansion";
import {FrontSearchComponent} from "./front-search/front-search.component";

const routes = [
    {
        path     : 'prices',
        component: PriceComponent
    },
    {
        path     : 'search',
        component: FrontSearchComponent
    },
    {
        path     : 'content/:slug',
        component: PageComponent
    },
    {
        path     : '**',
        component: FrontendComponent
    },
];

@NgModule({
    declarations: [
        FrontendComponent,
        PriceComponent,
        PageComponent,
        FrontSearchComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatGridListModule,
        MatDividerModule,
        MatFormFieldModule,
        MatMenuModule,
        MatSelectModule,
        MatTableModule,
        MatTabsModule,
        MatDialogModule,
        MatDatepickerModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatSidenavModule,
        MatToolbarModule,
        MatRadioModule,
        MatCardModule,
        MatInputModule,
        MatSliderModule,
        MatAutocompleteModule,
        MatSnackBarModule,
        MatButtonToggleModule,
        MatExpansionModule,
        GridModule,
        FuseSharedModule,
        SharedModule
    ],
    providers: [
        BillingService
    ],
    entryComponents: [
    ]
})

export class FrontendModule
{
}
