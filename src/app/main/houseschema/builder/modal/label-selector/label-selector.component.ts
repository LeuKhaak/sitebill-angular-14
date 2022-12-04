import {ChangeDetectorRef, Component, Inject, Input} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {NgxGalleryImage} from "ngx-gallery-9";
import {SitebillEntity} from "../../../../../_models";
import {FormComponent} from "../../../../grid/form/form.component";
import {ModelService} from "../../../../../_services/model.service";
import {FormBuilder} from "@angular/forms";
import {SnackService} from "../../../../../_services/snack.service";
import {FilterService} from "../../../../../_services/filter.service";
import {Bitrix24Service} from "../../../../../integrations/bitrix24/bitrix24.service";
import {APP_CONFIG, AppConfig} from "../../../../../app.config.module";
import {FormConstructorComponent} from "../../../../grid/form/form-constructor.component";
import {StorageService} from "../../../../../_services/storage.service";

@Component({
    selector   : 'label-selector',
    templateUrl: '../../../../grid/form/form.component.html',
    styleUrls  : ['../../../../grid/form/form.component.scss']
})
export class LabelSelectorComponent extends FormComponent
{
    /**
     * Constructor
     *
     */
    constructor(
        protected dialogRef: MatDialogRef<FormComponent>,
        protected modelService: ModelService,
        protected _formBuilder: FormBuilder,
        protected _snackService: SnackService,
        public _matDialog: MatDialog,
        protected filterService: FilterService,
        protected bitrix24Service: Bitrix24Service,
        @Inject(APP_CONFIG) protected config: AppConfig,
        @Inject(MAT_DIALOG_DATA) public _data: SitebillEntity,
        protected cdr: ChangeDetectorRef,
        protected storageService: StorageService
    ) {
        super(
            dialogRef,
            modelService,
            _formBuilder,
            _snackService,
            _matDialog,
            filterService,
            bitrix24Service,
            config,
            _data,
            cdr,
            storageService,
        );
    }

    close() {
        super.close();
    }

}
