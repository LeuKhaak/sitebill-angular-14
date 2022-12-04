import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {fuseAnimations} from "../../../../../../../@fuse/animations";
import {SitebillEntity, SitebillModelItem} from "../../../../../../_models";
import {ModelService} from "../../../../../../_services/model.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {NgxGalleryImage} from "ngx-gallery-9";

@Component({
    selector: 'attach-modal',
    templateUrl: './attach-modal.component.html',
    styleUrls: ['./attach-modal.component.scss'],
    animations: fuseAnimations
})
export class AttachModalComponent  implements OnInit {
    public link: string;
    protected _unsubscribeAll: Subject<any>;
    public show_uploader = false;
    public show_attach_button = false;
    public files_column_name = 'files';

    @Output() attach_entity: EventEmitter<SitebillEntity> = new EventEmitter();


    onSave = new EventEmitter();
    galleryImages: any;
    public entity: SitebillEntity;

    constructor(
        private dialogRef: MatDialogRef<AttachModalComponent>,
        protected modelService: ModelService,
        @Inject(MAT_DIALOG_DATA) public _data: any
    ) {
        this._unsubscribeAll = new Subject();
        this.galleryImages = {};
        this.galleryImages[this.files_column_name] = [];
    }


    ngOnInit() {
        if ( !this._data.entity ) {
            this.entity = new SitebillEntity();
            this.entity.set_app_name('files_queue');
            this.entity.set_table_name('files_queue');
            this.entity.primary_key = 'id';

            this.modelService.load_only_model(this.entity.get_app_name())
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if (result) {
                        this.entity.model = result.columns;
                        this.show_uploader = true;
                    }
                });
        } else {
            this.entity = this._data.entity;
            this.show_uploader = true;
            if ( this._data.entity &&
                this._data.entity.model &&
                this._data.entity.model[this.files_column_name] &&
                this._data.entity.model[this.files_column_name].value &&
                this._data.entity.model[this.files_column_name].value.length > 0
            ) {
                this.show_attach_button = true;
            }
        }
    }


    close() {
        this.dialogRef.close();
    }

    save(event) {
        //this.onSave.emit(event);
    }

    OnDestroy () {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    attach() {
        this.attach_entity.emit(this.entity);
        this.dialogRef.close();
    }

    upload_complete(entity: SitebillEntity) {
        this.refreshModel();
    }

    refreshModel () {
        this.modelService.loadById(this.entity.get_app_name(), this.entity.get_primary_key(), this.entity.get_key_value())
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.entity.model = [];
                for (const [key_obj, value_obj] of Object.entries(result.data)) {
                    this.entity.model[key_obj] = new SitebillModelItem(value_obj);
                }
                if ( this.entity.model['files'] && this.entity.model['files'].value && this.entity.model['files'].value.length > 0 ) {
                    this.show_attach_button = true;
                } else {
                    this.show_attach_button = false;
                }
            });
    }

    onImageArrayChange(image_array: NgxGalleryImage[]) {
        console.log('ATTACH');
        this.refreshModel();
    }
}
