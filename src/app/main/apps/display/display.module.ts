import { NgModule } from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {FlexModule} from "@angular/flex-layout";
import {NgxUploaderModule} from "ngx-uploader";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DisplayComponent} from "./display.component";

@NgModule({
    declarations: [
        DisplayComponent
    ],
    exports: [
        DisplayComponent
    ],
    imports: [
        MatIconModule,
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        FlexModule,
        NgxUploaderModule,
        NgxDatatableModule,
        NgSelectModule,
        FormsModule,
        MatInputModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
    ],
    providers: [
    ],
    entryComponents: [
    ]
})

export class DisplayModule
{
}
