import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {ModelService} from '../../../_services/model.service';
import {SnackService} from '../../../_services/snack.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SitebillEntity} from "../../../_models";

@Component({
    selector: 'coworker-modal',
    templateUrl: './coworker-modal.component.html',
    styleUrls: ['./coworker-modal.component.scss'],
    animations: fuseAnimations
})
export class CoworkerModalComponent  implements OnInit {
    public link: string;
    entity: SitebillEntity;

    onSave = new EventEmitter();

    constructor(
        protected modelService: ModelService,
        private dialogRef: MatDialogRef<CoworkerModalComponent>,
        protected _snackService: SnackService,
        @Inject(MAT_DIALOG_DATA) public _data: any
    ) {
    }


    ngOnInit() {
        this.entity = new SitebillEntity();
        this.entity.set_app_name('cowork');
        this.entity.set_table_name('cowork');
        this.entity.set_primary_key('cowork_id');
        this.entity.set_default_value('id', this._data.get_param('id'));
        this.entity.set_default_value('object_type', this._data.get_table_name());
    }


    close() {
        this.dialogRef.close();
    }

    save(event) {
        //this.onSave.emit(event);
    }
}
