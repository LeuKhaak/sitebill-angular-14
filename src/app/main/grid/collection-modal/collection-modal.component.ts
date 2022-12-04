import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {ModelService} from '../../../_services/model.service';
import {SnackService} from '../../../_services/snack.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SitebillEntity} from "../../../_models";
import {EntityStorageService} from "../../../_services/entity-storage.service";

@Component({
    selector: 'collection-modal',
    templateUrl: './collection-modal.component.html',
    styleUrls: ['./collection-modal.component.scss'],
    animations: fuseAnimations
})
export class CollectionModalComponent  implements OnInit {
    public link: string;
    entity: SitebillEntity;

    entity_memorylist_user: SitebillEntity;
    onSave = new EventEmitter();

    constructor(
        protected modelService: ModelService,
        private dialogRef: MatDialogRef<CollectionModalComponent>,
        protected _snackService: SnackService,
        private entityStorageService: EntityStorageService,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
    }


    ngOnInit() {
        this.entity = new SitebillEntity();
        this.entity.set_app_name('memorylist');
        this.entity.set_table_name('memorylist');
        this.entity.set_primary_key('memorylist_id');
        this.entity.set_hidden('memorylist_id');

        this.entity.set_hidden('domain');
        this.entity.set_default_value('domain', 'localhost');

        this.entity.set_hidden('deal_id');
        this.entity.set_default_value('deal_id', 1);

        this.entity.set_hidden('user_id');
        this.entity.set_param('user_id', this.modelService.get_user_id().toString());
        this.entity.set_default_value('user_id', this.modelService.get_user_id());

        this.entityStorageService.set_entity('memorylist', this.entity);

        this.entity_memorylist_user = new SitebillEntity();
        this.entity_memorylist_user.set_app_name('memorylist_user');
        this.entity_memorylist_user.set_table_name('memorylist_user');
        this.entity_memorylist_user.set_primary_key('id');
        this.entity_memorylist_user.set_hidden('id');
        //this.entity_memorylist_user.set_default_value('user_id', this.modelService.get_user_id());

        //this.entity.set_key_value(0);
    }

    copy() {
        //this.clipboard.copy(this.link);
        this._snackService.message('Ссылка скопирована в буфер обмена');


    }

    close() {
        this.dialogRef.close();
    }


    save(event) {
        if ( event.memorylist_id ) {
            this._snackService.message('Объект добавлен в подборку');
        }
        this.onSave.emit(event);

    }
}
