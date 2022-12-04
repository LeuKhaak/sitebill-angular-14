import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {fuseAnimations} from "../../../../../@fuse/animations";
import {SitebillEntity} from "../../../../_models";
import {ModelService} from "../../../../_services/model.service";
import {SnackService} from "../../../../_services/snack.service";

@Component({
    selector: 'excel-modal',
    templateUrl: './excel-modal.component.html',
    styleUrls: ['./excel-modal.component.scss'],
    animations: fuseAnimations
})
export class ExcelModalComponent  implements OnInit {
    public link: string;
    entity: SitebillEntity;

    onSave = new EventEmitter();

    constructor(
        protected modelService: ModelService,
        private dialogRef: MatDialogRef<ExcelModalComponent>,
        protected _snackService: SnackService,
        @Inject(MAT_DIALOG_DATA) public _data: any
    ) {
    }


    ngOnInit() {
        this.entity = this._data.entity;
    }


    close() {
        this.dialogRef.close();
    }

    save(event) {
        //this.onSave.emit(event);
    }
}
