import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SbRatesEditDialogDataModel} from '../../../models/sb-rates-edit-dialog-data.model';

@Component({
    templateUrl: 'sb-rates-edit-dialog.component.html',
    styleUrls: [
        'sb-rates-edit-dialog.component.scss',
    ]
})
export class SbRatesEditDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: SbRatesEditDialogDataModel,
        public dialogRef: MatDialogRef<SbRatesEditDialogComponent>
    ) {
    }

    onFormClose() {
        this.dialogRef.close();
    }
}