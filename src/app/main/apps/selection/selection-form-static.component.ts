import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {UntypedFormBuilder} from '@angular/forms';

import {ModelService} from 'app/_services/model.service';
import {FormType, SitebillEntity} from 'app/_models';

import {FilterService} from 'app/_services/filter.service';
import {SnackService} from 'app/_services/snack.service';
import {Bitrix24Service} from 'app/integrations/bitrix24/bitrix24.service';
import {SelectionFormConstructorComponent, myCustomTooltipDefaults} from './selection-form-constructor.component';
import {SelectionFormComponent} from './selection-form.component';
import {EntityStorageService} from '../../../_services/entity-storage.service';
import {MAT_TOOLTIP_DEFAULT_OPTIONS} from '@angular/material/tooltip';
import {StorageService} from '../../../_services/storage.service';
import {GetApiUrlService} from '../../../_services/get-api-url.service';


@Component({
    selector: 'selectionform-static', // WAS form-static
    templateUrl: './selection-form.component.html',
    styleUrls: ['./selection-form.component.scss'],
    providers: [
        {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}
    ],

})
export class SelectionFormStaticComponent extends SelectionFormConstructorComponent implements OnInit {
    @Input()
    _data: {entity: SitebillEntity, selectionMode: boolean};

    @Input()
    disable_delete: boolean;

    @Input()
    disable_form_title_bar: boolean;

    @Input()
    disable_save_button: boolean;

    @Input()
    disable_cancel_button: boolean;

    @Input()
    fake_save: boolean;

    @Output() onClose = new EventEmitter(); // on ???
    @Output() save_output = new EventEmitter();
    @Output() onSave = new EventEmitter(); // on ???

    constructor(
        protected modelService: ModelService,
        protected _formBuilder: UntypedFormBuilder,
        protected _snackService: SnackService,
        public _matDialog: MatDialog,
        protected filterService: FilterService,
        protected bitrix24Service: Bitrix24Service,
        protected entityStorageService: EntityStorageService,
        protected cdr: ChangeDetectorRef,
        protected getApiUrlService: GetApiUrlService,
        protected storageService: StorageService

    ) {
        super(
            modelService,
            getApiUrlService,
            _formBuilder,
            _snackService,
            filterService,
            bitrix24Service,
            _matDialog,
            cdr,
            storageService
        );
    }
    save(): void {
        super.save();
    }
    close(): void {
        super.close();
        this.onClose.emit(true);
    }

    inline_create(record): void {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        // dialogConfig.width = '99vw';
        // dialogConfig.maxWidth = '99vw';
        // dialogConfig.height = '99vh';

        let entity = new SitebillEntity();
        if ( this.entityStorageService.get_entity(record.primary_key_table) ) {
            entity = this.entityStorageService.get_entity(record.primary_key_table);
        } else {
            entity.set_table_name(record.primary_key_table);
            entity.set_app_name(record.primary_key_table);
            entity.set_primary_key(record.primary_key_name);
            entity.set_title(record.title);
        }
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

