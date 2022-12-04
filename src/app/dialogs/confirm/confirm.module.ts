import { NgModule } from '@angular/core';

import { ConfirmComponent } from 'app/dialogs/confirm/confirm.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {FlexLayoutModule} from "@angular/flex-layout";
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [
        ConfirmComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        FlexLayoutModule,
        CommonModule
    ],
    entryComponents: [
        ConfirmComponent
    ],
})
export class ConfirmDialogModule {
}
