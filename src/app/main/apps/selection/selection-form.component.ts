import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';

import {APP_CONFIG, AppConfig} from 'app/app.config.module';
import {ModelService} from 'app/_services/model.service';
import {FormType, SitebillEntity} from 'app/_models';

import {FilterService} from 'app/_services/filter.service';
import {SnackService} from 'app/_services/snack.service';
import {Bitrix24Service} from 'app/integrations/bitrix24/bitrix24.service';
import {SelectionFormConstructorComponent, myCustomTooltipDefaults} from './selection-form-constructor.component';
import {MAT_TOOLTIP_DEFAULT_OPTIONS} from '@angular/material/tooltip';
import {StorageService} from '../../../_services/storage.service';
import * as moment from 'moment';
import {LocaleConfig} from 'ngx-daterangepicker-material';



@Component({
    selector: 'form-selector',
    templateUrl: './selection-form.component.html',
    styleUrls: ['./selection-form.component.scss'],
    providers: [
        {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}
    ],
})
export class SelectionFormComponent extends SelectionFormConstructorComponent implements OnInit {

    constructor(
        protected dialogRef: MatDialogRef<SelectionFormComponent>,
        protected modelService: ModelService,
        protected _formBuilder: FormBuilder,
        protected _snackService: SnackService,
        public _matDialog: MatDialog,
        protected filterService: FilterService,
        protected bitrix24Service: Bitrix24Service,
        @Inject(APP_CONFIG) protected config: AppConfig,
        @Inject(MAT_DIALOG_DATA) public _data: {entity: SitebillEntity, selectionMode: boolean},
        protected cdr: ChangeDetectorRef,
        protected storageService: StorageService
    ) {
        super(
            modelService,
            _formBuilder,
            _snackService,
            filterService,
            bitrix24Service,
            _matDialog,
            cdr,
            storageService,
        );
    }

    close() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.dialogRef.close();
    }
    inline_create(record) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        // dialogConfig.width = '99vw';
        // dialogConfig.maxWidth = '99vw';
        // dialogConfig.height = '99vh';
        const entity = new SitebillEntity();
        entity.set_table_name(record.primary_key_table);
        entity.set_app_name(record.primary_key_table);
        entity.set_primary_key(record.primary_key_name);
        entity.set_title(record.title);
        entity.set_form_type(FormType.inline);
        dialogConfig.data = {
            entity: entity,
            selectionMode: true
        };
        dialogConfig.panelClass = 'regular-modal';
        // console.log(model_name);

        if (this.modelService.get_access(entity.get_table_name(), 'access')) {
            const modalRef = this._matDialog.open(SelectionFormComponent, dialogConfig);
            modalRef.componentInstance.afterSave.subscribe((result: SitebillEntity) => {
                this.init_select_by_query_options(record.name);
                this.form.controls[record.name].patchValue(result.get_key_value());
            });
        } else {
            this._snackService.message('Нет доступа к добавлению/редактированию ' + entity.get_title(), 5000);
        }
    }
}

