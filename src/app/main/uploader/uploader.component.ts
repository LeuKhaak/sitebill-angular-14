import {Component, EventEmitter, Input, Inject, Output} from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';
import { NgxGalleryImage } from 'ngx-gallery-9';
import { SitebillEntity } from 'app/_models';
import { ModelService } from 'app/_services/model.service';
import { ImageService } from 'app/_services/image.service';
import { AppConfig, APP_CONFIG } from 'app/app.config.module';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmComponent } from 'app/dialogs/confirm/confirm.component';
import { SnackService } from 'app/_services/snack.service';
import {Bitrix24Service} from '../../integrations/bitrix24/bitrix24.service';

export class UploadResult {
    state: string;
    data: any[];
    message: any[];
}

@Component({
    selector: 'uploader-component',
    templateUrl: 'uploader.component.html',
    styleUrls: ['uploader.component.sass']
})
export class UploaderComponent {
    url: string;
    api_url: string;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    confirmDialogRef: MatDialogRef<ConfirmComponent>;

    humanizeBytes: Function;
    dragOver: boolean;
    options: UploaderOptions;
    queue_size: number =  0;

    @Input('galleryImages')
    galleryImages: NgxGalleryImage[];

    @Input('entity')
    entity: SitebillEntity;

    @Input('image_field')
    image_field: string;

    @Input('max_uploads')
    max_uploads: any;

    @Input('disable_gallery_controls')
    disable_gallery_controls: boolean;

    @Output() upload_complete: EventEmitter<SitebillEntity> = new EventEmitter();

    @Input('uploader_title')
    uploader_title: string = '';
    public show_gallery = false;

    constructor(
        private modelSerivce: ModelService,
        public _matDialog: MatDialog,
        private _snackService: SnackService,
        protected bitrix24Service: Bitrix24Service,
        protected modelService: ModelService,
        protected imageService: ImageService,
        @Inject(APP_CONFIG) private config: AppConfig,
    ) {
        this.api_url = this.modelSerivce.get_api_url();

        this.files = [];
        this.uploadInput = new EventEmitter<UploadInput>();
        this.humanizeBytes = humanizeBytes;

    }

    getImages(): void {
        if (!this.galleryImages && this.entity && this.entity.model && this.entity.model[this.image_field] && this.entity.model[this.image_field].value.length > 0) {
            this.galleryImages = [];
            this.galleryImages[this.image_field] = [];
            for (let prop in this.entity.model[this.image_field].value) {

                let gallery_image = {
                    small: this.modelSerivce.get_api_url() + '/img/data/' + this.entity.model[this.image_field].value[prop].preview + '?' + new Date().getTime(),
                    medium: this.modelSerivce.get_api_url() + '/img/data/' + this.entity.model[this.image_field].value[prop].normal + '?' + new Date().getTime(),
                    big: this.modelSerivce.get_api_url() + '/img/data/' + this.entity.model[this.image_field].value[prop].normal + '?' + new Date().getTime(),
                };
                this.galleryImages[this.image_field].push(gallery_image);
            }
        } else if (!this.galleryImages) {
                this.galleryImages = [];
                this.galleryImages[this.image_field] = [];
            }
    }

    ngOnInit() {
        this.getImages();

        this.url = this.api_url + '/apps/api/rest.php?uploader_type=dropzone&element='
            + this.image_field
            + '&model=' + this.entity.get_table_name()
            + '&layer=native_ajax'
            + '&is_uploadify=1'
            + '&primary_key_value=' + this.entity.primary_key
            + '&primary_key=' + this.entity.key_value
            + '&session_key=' + this.modelSerivce.get_session_key();
        this.show_gallery = true;
    }

    onUploadOutput(output: UploadOutput): void {
        // console.log('upload event');
        // console.log('start', output.type);
        // console.log('start', this.galleryImages);
        if (output.type === 'allAddedToQueue') {
            const event: UploadInput = {
                type: 'uploadAll',
                url: this.url,
                method: 'POST',
                data: { foo: 'bar' }
            };
            this.queue_size = this.files.length;

            this.uploadInput.emit(event);

        } else if (output.type === 'done' && typeof output.file !== 'undefined') {
            this.queue_size--;
            // console.log(this.entity);
            if (this.queue_size === 0) {
                if (this.entity.key_value == null) {
                    this.modelSerivce.new_empty_record(this.entity.get_table_name())
                        .subscribe((result: UploadResult) => {
                            if (result.state === 'error') {
                                this._snackService.message('Невозможно загрузить фото к новой записи. Сначала сохраните запись без фото, а потом загрузите к ней фото.', 5000);
                                return false;
                            }
                            if (result.message[this.entity.primary_key]['value'] != null ) {
                                this.entity.key_value = result.message[this.entity.primary_key]['value'];
                                this.modelSerivce.entity.key_value = this.entity.key_value;
                                // console.log(result.message);
                                if (this.entity.get_hook() === 'add_to_collections') {
                                    this.add_to_collections(this.entity.key_value);
                                }

                                let img_folder = this.getImgFolder(result.message[this.image_field]['type']);


                                for (let prop in result.message[this.image_field]['value']) {
                                    let small_url = this.api_url +
                                        img_folder +
                                        (result.message[this.image_field]['value'][prop].preview?result.message[this.image_field]['value'][prop].preview:result
                                            .message[this.image_field]['value'][prop].normal) +
                                        '?' + new Date().getTime();

                                    if ( small_url.indexOf('\.pdf') >= 0 ) {
                                        small_url = 'https://www.sitebill.ru/storage/icons/pdf.png';
                                    }

                                    let gallery_image = {
                                        small: small_url,
                                        medium: this.api_url + img_folder + result.message[this.image_field]['value'][prop].normal + '?' + new Date().getTime(),
                                        big: this.api_url + img_folder + result.message[this.image_field]['value'][prop].normal + '?' + new Date().getTime(),
                                    };
                                    this.galleryImages[this.image_field].push(gallery_image);
                                }
                            }
                            this.upload_complete.emit(this.entity);
                        });
                } else {
                    this.uppend_uploads();
                }
            }

        } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
            this.files.push(output.file);
        } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
            const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
            this.files[index] = output.file;
        } else if (output.type === 'cancelled' || output.type === 'removed') {
            this.files = this.files.filter((file: UploadFile) => file !== output.file);
        } else if (output.type === 'dragOver') {
            this.dragOver = true;
        } else if (output.type === 'dragOut') {
            this.dragOver = false;
        } else if (output.type === 'drop') {
            this.dragOver = false;
        } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
            console.log(output.file.name + ' rejected');
        }

        this.files = this.files.filter(file => file.progress.status !== UploadStatus.Done);
    }

    getImgFolder (type: string) {
        if ( type === 'docuploads' ) {
            return '/img/mediadocs/';
        }
        return '/img/data/';
    }

    add_to_collections(data_id) {
        let title = 'bitrix deal ' + this.bitrix24Service.get_entity_id();
        this.modelService.toggle_collections(this.bitrix24Service.get_domain(), this.bitrix24Service.get_entity_id(), title, data_id)
            .subscribe((response: any) => {
            });
    }


    uppend_uploads() {
        this.modelSerivce.uppend_uploads(this.entity.get_table_name(), this.entity.primary_key, this.entity.key_value, this.image_field)
            .subscribe((result: UploadResult) => {
                if ( result.state === 'error' ) {
                    this._snackService.message('Невозможно загрузить файл. Поддерживаются только jpg и png изображения.', 5000);
                    return false;
                }

                let prefix = '';
                if (this.entity.get_table_name() == 'user') {
                    prefix = 'user/';
                }

                for (let prop in result.data) {
                    let gallery_image = {
                        small: this.api_url + '/img/data/' + prefix + result.data[prop].preview + '?' + new Date().getTime(),
                        medium: this.api_url + '/img/data/' + prefix + result.data[prop].normal + '?' + new Date().getTime(),
                        big: this.api_url + '/img/data/' + prefix + result.data[prop].normal + '?' + new Date().getTime(),
                    };
                    this.galleryImages[this.image_field].push(gallery_image);
                }
                this.upload_complete.emit(this.entity);
            });
    }

    delete_all_images() {
        this.confirmDialogRef = this._matDialog.open(ConfirmComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Вы уверены, что хотите удалить все фото?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.imageService.deleteAllImages(this.entity.get_table_name(), this.entity.primary_key, this.entity.key_value, this.image_field)
                    .subscribe((result: any) => {
                        this.galleryImages[this.image_field] = [];
                        this.upload_complete.emit(this.entity);
                    });
            }
            this.confirmDialogRef = null;
        });
    }

    startUpload(): void {
        const event: UploadInput = {
            type: 'uploadAll',
            url: this.url,
            method: 'POST',
            data: { foo: 'bar' }
        };

        this.uploadInput.emit(event);
    }

    cancelUpload(id: string): void {
        this.uploadInput.emit({ type: 'cancel', id: id });
    }

    removeFile(id: string): void {
        this.uploadInput.emit({ type: 'remove', id: id });
    }

    removeAllFiles(): void {
        this.uploadInput.emit({ type: 'removeAll' });
    }

    onGalleryChange(imageArray: NgxGalleryImage[]): void {
        this.galleryImages[this.image_field] = imageArray;
    }
}
