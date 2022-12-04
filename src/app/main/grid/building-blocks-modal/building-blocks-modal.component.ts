import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {ModelService} from '../../../_services/model.service';
import {SnackService} from '../../../_services/snack.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SitebillEntity} from "../../../_models";

@Component({
    selector: 'building-blocks-modal',
    templateUrl: './building-blocks-modal.component.html',
    styleUrls: ['./building-blocks-modal.component.scss'],
    animations: fuseAnimations
})
export class BuildingBlocksModalComponent  implements OnInit {
    public link: string;
    entity: SitebillEntity;

    onSave = new EventEmitter();

    constructor(
        protected modelService: ModelService,
        private dialogRef: MatDialogRef<BuildingBlocksModalComponent>,
        protected _snackService: SnackService,
        @Inject(MAT_DIALOG_DATA) public _data: any
    ) {
    }


    ngOnInit() {
        this.entity = new SitebillEntity();
        this.entity.set_app_name('building_blocks');
        this.entity.set_table_name('building_blocks');
        this.entity.set_primary_key('id');
        this.entity.set_default_value('object_id', this._data.get_param('object_id'));
        this.entity.set_default_value('object_type', this._data.get_table_name());
    }


    close() {
        this.dialogRef.close();
    }

    save(event) {
        //this.onSave.emit(event);
    }
}
