import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    IterableDiffers,
    DefaultIterableDiffer,
    Output, EventEmitter
} from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryComponent } from 'ngx-gallery-9';
import { ConfirmComponent } from 'app/dialogs/confirm/confirm.component';
import { fuseAnimations } from '@fuse/animations';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import { ModelService } from 'app/_services/model.service';
import { ImageService } from 'app/_services/image.service';
import { SitebillEntity } from 'app/_models';
import {HouseSchemaBuilderModalComponent} from '../houseschema/builder/modal/house-schema-builder-modal.component';

@Component({
    selector: 'gallery-component',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
    animations: fuseAnimations
})
export class GalleryComponent implements OnInit {
    galleryOptions: NgxGalleryOptions[];
    private differ: DefaultIterableDiffer<any>;
    public previous_image_count: number;
    confirmDialogRef: MatDialogRef<ConfirmComponent>;
    gallery_columns = 8;

    @ViewChild('gallery_object') gallery_object: ElementRef<NgxGalleryComponent>;

    galleryImages: NgxGalleryImage[];

    @Input('galleryImages')
    galleryImagesInput: NgxGalleryImage[];

    @Input('entity')
    entity: SitebillEntity;

    @Input('image_field')
    image_field: string;

    @Input('disable_gallery_controls')
    disable_gallery_controls: boolean;

    @Output() onGalleryChange: EventEmitter<NgxGalleryImage[]> = new EventEmitter();

    constructor(
        private differs: IterableDiffers,
        public _matDialog: MatDialog,
        private modelSerivce: ModelService,
        private imageService: ImageService,
    ) {}

    recalculate_options() {
        return;
    }

    replaceFileTypeIcons(galleryImages) {
        return galleryImages;
    }

    getImages(): void {
        if ( this.galleryImagesInput && this.galleryImagesInput[this.image_field] && this.galleryImagesInput[this.image_field].length > 0 ) {
            this.galleryImages = this.galleryImagesInput[this.image_field];
        } else {
            this.galleryImages = [];
          }
    }

    ngOnInit(): void {
        this.getImages();
        if (this.galleryImages.length === 0 && this.entity && this.entity.model && this.entity.model[this.image_field] && this.entity.model[this.image_field].value.length > 0) {
            const img_folder = this.getImgFolder(this.entity.model[this.image_field].type);

            for (const prop in this.entity.model[this.image_field].value) {

                let small_url = this.modelSerivce.get_api_url() +
                    img_folder +
                    (this.entity.model[this.image_field].value[prop].preview ? this.entity.model[this.image_field].value[prop].preview
                        : this.entity.model[this.image_field].value[prop].normal) +
                    '?' + new Date().getTime();
                if ( small_url.indexOf('\.pdf') >= 0 ) {
                    small_url = 'https://www.sitebill.ru/storage/icons/pdf.png';
                }


                const gallery_image = {
                    small: small_url,
                    medium: this.modelSerivce.get_api_url() + img_folder + this.entity.model[this.image_field].value[prop].normal + '?' + new Date().getTime(),
                    big: this.modelSerivce.get_api_url() + img_folder + this.entity.model[this.image_field].value[prop].normal + '?' + new Date().getTime(),
                };
                this.galleryImages.push(gallery_image);
            }
        }
        this.galleryImages = this.replaceFileTypeIcons(this.galleryImages);
        this.differ =
            this.differs.find(this.galleryImages).create() as DefaultIterableDiffer<any>;
        let rows_number_calc = Math.ceil(this.galleryImages.length / this.gallery_columns);
        if (rows_number_calc < 1) {
            rows_number_calc = 1;
        }
        let height_calc = rows_number_calc * 150;
        height_calc = 200;

        this.previous_image_count = this.galleryImages.length;


        this.galleryOptions = [
            {
                width: '100%',
                height: height_calc + 'px',
                image: false,
                arrowPrevIcon: 'fa fa-arrow-circle-o-left',
                arrowNextIcon: 'fa fa-arrow-circle-o-right',
                closeIcon: 'fa fa-window-close',
                fullscreenIcon: 'fa fa-arrows',
                spinnerIcon: 'fa fa-refresh fa-spin fa-3x fa-fw',
                previewFullscreen: true,
                thumbnailsOrder: 2,
                thumbnailsColumns: 8,
                previewCloseOnClick: true,
                imageBullets: true,
                imageInfinityMove: true,
                imageAnimation: NgxGalleryAnimation.Slide,
                thumbnailActions: [
                    { icon: 'fa fa-chevron-left fa-sm', onClick: this.moveLeft.bind(this), titleText: 'выше' },
                    { icon: 'fa fa-times-circle fa-sm', onClick: this.deleteImage.bind(this), titleText: 'удалить' },
                    { icon: 'fa fa-chevron-right fa-sm', onClick: this.moveRight.bind(this), titleText: 'ниже' },
                    { icon: 'fa fa-star fa-sm', onClick: this.moveToStart.bind(this), titleText: 'сделать главной' },
                    { icon: 'fa fa-undo fa-sm', onClick: this.rotateRight.bind(this), titleText: 'повернуть против часовой стрелки' },
                    { icon: 'fa fa-repeat fa-sm', onClick: this.rotateLeft.bind(this), titleText: 'повернуть по часовой стрелке' },
                    { icon: 'fa fa-cog fa-sm', onClick: this.openOptions.bind(this), titleText: 'Настройки' },
                ]
            },
            {
                breakpoint: 1600,
                thumbnailsColumns: 6,
            },
            {
                breakpoint: 1200,
                thumbnailsColumns: 4,
            },
            // max-width 800
            {
                breakpoint: 800,
                width: '100%',
                // height: '600px',
                thumbnailsColumns: 2,
                previewCloseOnClick: true,
                imageBullets: true,
                imageInfinityMove: true,
                imagePercent: 80,
                thumbnailsPercent: 20,
                thumbnailsMargin: 20,
                thumbnailMargin: 20
            },
            // max-width 400
            {
                breakpoint: 400,
                thumbnailsColumns: 1,
                imageBullets: true,
                previewCloseOnClick: true,
                imageInfinityMove: true,
                preview: true
            }
        ];

        if ( this.entity.get_readonly() ) {
            try {
                this.galleryOptions[0].preview = false;
                this.galleryOptions[0].image = true;
                this.galleryOptions[0].thumbnails = false;
                this.galleryOptions[0].imageSwipe = true;
                delete (this.galleryOptions[0].thumbnailActions);
            } catch (e) {

            }
        }

        if ( this.disable_gallery_controls  ) {
            try {
                delete (this.galleryOptions[0].thumbnailActions);
            } catch (e) {

            }
        }
    }

    getImgFolder(type: string) {
        if ( type === 'docuploads' ) {
            return '/img/mediadocs/';
        }
        return '/img/data/';
    }

    deleteImage(event, index) {
        this.confirmDialogRef = this._matDialog.open(ConfirmComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Вы уверены, что хотите удалить фото?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.imageService.deleteImage(this.entity.get_table_name(), this.entity.primary_key, this.entity.key_value, index, this.image_field)
                    .subscribe((result: any) => {
                        this.galleryImages.splice(index, 1);
                        this.recalculate_options();
                    });
                this.reorder();
            }
            this.confirmDialogRef = null;
        });
    }

    openOptions(event, index) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '99vw';
        dialogConfig.maxWidth = '99vw';
        dialogConfig.data = {
            entity: this.entity,
            image_field: this.image_field,
            image_index: index,
            galleryImages: this.galleryImages,
        };
        dialogConfig.panelClass = 'form-ngrx-compose-dialog';

        this._matDialog.open(HouseSchemaBuilderModalComponent, dialogConfig);
    }

    moveRight(event, index) {
        this.imageService.reorderImage(this.entity.get_table_name(), this.entity.primary_key, this.entity.key_value, index, 'down', this.image_field)
            .subscribe((result: any) => {
                const tmp_images = this.array_move(this.galleryImages, index, index + 1);
                this.galleryImages = [];
                this.reorder(tmp_images);
            });
    }

    moveLeft(event, index) {
        this.imageService.reorderImage(this.entity.get_table_name(), this.entity.primary_key, this.entity.key_value, index, 'up', this.image_field)
            .subscribe((result: any) => {
                const tmp_images = this.array_move(this.galleryImages, index, index - 1);
                this.galleryImages = [];
                this.reorder(tmp_images);
            });
    }
    moveToStart(event, index) {
        this.imageService.reorderImage(this.entity.get_table_name(), this.entity.primary_key, this.entity.key_value, index, 'make_main', this.image_field)
            .subscribe((result: any) => {
                const tmp_images = this.array_move(this.galleryImages, index, 0);
                this.galleryImages = [];
                this.reorder(tmp_images);
            });
    }

    rotateLeft(event, index) {
        this.imageService.rotateImage(this.entity.get_table_name(), this.entity.primary_key, this.entity.key_value, index, 'acw', this.image_field)
            .subscribe((result: any) => {
                const tmp_images = this.add_timestamp_prefix(this.galleryImagesInput[this.image_field]);
                this.reorder(tmp_images);
            });
    }

    rotateRight(event, index) {
        this.imageService.rotateImage(this.entity.get_table_name(), this.entity.primary_key, this.entity.key_value, index, 'ccw', this.image_field)
            .subscribe((result: any) => {
                const tmp_images = this.add_timestamp_prefix(this.galleryImagesInput[this.image_field]);
                this.reorder(tmp_images);
            });
    }

    add_timestamp_prefix(images) {
        if (images) {
            // console.log ('add_time', images);
            return images.map(function(image: any) {

                return {
                    small: image.small + '?' + new Date().getTime(),
                    medium: image.medium + '?' + new Date().getTime(),
                    big: image.big + '?' + new Date().getTime()
                };
            });
        }
        return [];
    }

    reorder(tmp_images = []) {
        setTimeout(() => {
            if (tmp_images.length) {
                this.galleryImages = tmp_images;
            }
            this.onGalleryChange.emit(this.galleryImages);
        }, 10);
    }

    array_move(arr, old_index, new_index) {
        if (new_index < 0) {
            return arr;
        }
        if (arr.length <= new_index) {
            return arr;
        }
        while (old_index < 0) {
            old_index += arr.length;
        }
        while (new_index < 0) {
            new_index += arr.length;
        }
        if (new_index >= arr.length) {
            let k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);

        return arr; // for testing purposes
    }

    ngDoCheck() {
        if (this.galleryImages ) {
            const changes = this.differ.diff(this.galleryImages);
            if (changes != null && this.previous_image_count < changes.length) {
                this.recalculate_options();
                setTimeout(() => this.moveToEnd(), 10);
                this.previous_image_count = changes.length;
            }
        }
    }

    moveToEnd() {
        if (this.gallery_object instanceof NgxGalleryComponent) {
            while (this.gallery_object.canMoveThumbnailsRight()) {
                this.gallery_object.moveThumbnailsRight();
            }
        }
    }
}
