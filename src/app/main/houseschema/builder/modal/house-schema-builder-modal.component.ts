import {Component, Inject, Input} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgxGalleryImage} from "ngx-gallery-9";
import {SafeResourceUrl} from "@angular/platform-browser";
import {SitebillEntity} from "../../../../_models";
import {FormComponent} from "../../../grid/form/form.component";

@Component({
    selector   : 'house-schema-builder-modal',
    templateUrl: './house-schema-builder-modal.component.html',
    styleUrls  : ['./house-schema-builder-modal.component.scss']
})
export class HouseSchemaBuilderModalComponent
{
    /**
     * Constructor
     *
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public _data: {
            entity: SitebillEntity,
            image_field: string,
            image_index: number,
            galleryImages: NgxGalleryImage[],
        },
        protected dialogRef: MatDialogRef<FormComponent>,
    )
    {
    }


    ngOnInit() {
    }

    close() {
        this.dialogRef.close();
    }

}
