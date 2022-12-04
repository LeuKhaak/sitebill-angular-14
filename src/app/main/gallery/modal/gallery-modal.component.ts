import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { ModelService } from 'app/_services/model.service';
import { FilterService } from 'app/_services/filter.service';

@Component({
    selector: 'gallery-modal',
    templateUrl: './gallery-modal.component.html',
    styleUrls: ['./gallery-modal.component.css']
})
export class GalleryModalComponent implements OnInit {
    max_uploads: number = 100;

    data: any;

    constructor(
        private dialogRef: MatDialogRef<GalleryModalComponent>,
        private modelSerivce: ModelService,
        private filterService: FilterService,
        @Inject(APP_CONFIG) private config: AppConfig,
        @Inject(MAT_DIALOG_DATA) public _data: any
    ) {
        this.data = this._data;
    }

    ngOnInit() {
        if (this._data.entity.app_name == 'user' && this._data.image_field == 'imgfile') {
            this.max_uploads = 1;
        }
    }

    close() {
        if ( !this._data.disable_gallery_controls ) {
            this.filterService.empty_share(this._data.entity);
        }
        this.dialogRef.close();
    }
}
