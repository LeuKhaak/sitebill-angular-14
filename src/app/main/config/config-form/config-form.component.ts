import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input, OnChanges,
    OnInit,
    Output
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {UntypedFormBuilder} from '@angular/forms';

import {ModelService} from 'app/_services/model.service';

import {FilterService} from 'app/_services/filter.service';
import {SnackService} from 'app/_services/snack.service';
import {Bitrix24Service} from 'app/integrations/bitrix24/bitrix24.service';
import {FormStaticComponent} from '../../grid/form/form-static.component';
import {EntityStorageService} from '../../../_services/entity-storage.service';
import {takeUntil} from 'rxjs/operators';
import {MAT_TOOLTIP_DEFAULT_OPTIONS} from '@angular/material/tooltip';
import {myCustomTooltipDefaults} from '../../grid/form/form-constructor.component';
import {StorageService} from '../../../_services/storage.service';
import {GetApiUrlService} from '../../../_services/get-api-url.service';


@Component({
    selector: 'config-form-selector',
    templateUrl: '../../grid/form/form.component.html',
    styleUrls: ['../../grid/form/form.component.scss'],
    providers: [
        {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}
    ],
})
export class ConfigFormComponent extends FormStaticComponent implements OnInit, OnChanges  {
    @Input()
    config_items: any;
    @Output() formChanged = new EventEmitter<boolean>();
    private form_reloading_in_progress = false;
    private changed_items: {[index: string]: any};

    constructor(
        public modelService: ModelService,
        protected getApiUrlService: GetApiUrlService,
        protected _formBuilder: UntypedFormBuilder,
        protected _snackService: SnackService,
        public _matDialog: MatDialog,
        protected filterService: FilterService,
        protected bitrix24Service: Bitrix24Service,
        protected entityStorageService: EntityStorageService,
        protected cdr: ChangeDetectorRef,
        protected storageService: StorageService
    ) {
        super(
            modelService,
            getApiUrlService,
            _formBuilder,
            _snackService,
            _matDialog,
            filterService,
            bitrix24Service,
            entityStorageService,
            cdr,
            storageService,
    );
    }

    getModel(): void {
        const primary_key = this._data.primary_key;
        const key_value = this._data.get_key_value();
        // console.log(this.modelService.entity);
        this.modelService.entity.set_app_name(this._data.get_app_name());
        this.modelService.entity.set_table_name(this._data.get_table_name());
        this.modelService.entity.primary_key = primary_key;
        this.modelService.entity.key_value = key_value;
        if ( this.predefined_ql_items ) {
            this._data.set_hidden(primary_key);
            this.modelService.entity.set_hidden(primary_key);
        }
        this.updateForm();
    }

    get_changed_items(): {[index: string]: any} {
        return this.changed_items;
    }

    initSubscribers(): void {
        super.initSubscribers();
        this.form.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((status) => {
                if ( !this.form_reloading_in_progress ) {
                    this.changed_items = status;
                    this.formChanged.emit(true);
                }
            });
    }

    updateForm(): void {
        this.form_reloading_in_progress = true;
        this.records = null;
        this.rows = null;
        this.tabs = null;
        this.tabs_keys = null;

        this.records = this.config_items;
        this.rows = Object.keys(this.config_items);
        this.tabs = {'Основное': this.rows};
        this.tabs_keys = ['Основное'];
        this.init_form();
        this.form_reloading_in_progress = false;
    }

    ngOnChanges(changes): void {
        if ( changes.config_items ) {
            this.updateForm();
        }
    }




    close(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}

