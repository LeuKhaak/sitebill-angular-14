import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import {GridModule} from '../grid/grid.module';
import {BillingService} from '../../_services/billing.service';
import {SharedModule} from '../../shared.module';
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
import {StandaloneRunnerComponent} from "./standalone-runner.component";
import {ProfileModule} from "../profile/profile.module";
import {ModelsEditorModule} from "../models-editor/models-editor.module";

const routes = [
    {
        path     : 'apps-data',
        loadChildren: () => import('app/main/apps/apps-data/apps-data.module').then(m => m.AppsDataModule),
    },
    {
        path     : '**',
        component: StandaloneRunnerComponent
    },
];

@NgModule({
    declarations: [
        StandaloneRunnerComponent,
    ],
    imports: [
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
        SharedModule,
        ProfileModule,
        ModelsEditorModule,
    ],
    providers: [
        BillingService
    ],
    entryComponents: [
    ]
})

export class StandaloneRunnerModule
{
}
