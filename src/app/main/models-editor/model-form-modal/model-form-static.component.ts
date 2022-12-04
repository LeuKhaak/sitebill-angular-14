import {ChangeDetectorRef, Component, EventEmitter, OnChanges, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';

import {ModelService} from 'app/_services/model.service';

import {FilterService} from 'app/_services/filter.service';
import {SnackService} from 'app/_services/snack.service';
import {Bitrix24Service} from 'app/integrations/bitrix24/bitrix24.service';
import {FormStaticComponent} from "../../grid/form/form-static.component";
import {EntityStorageService} from "../../../_services/entity-storage.service";
import {takeUntil} from "rxjs/operators";
import {MAT_TOOLTIP_DEFAULT_OPTIONS} from "@angular/material/tooltip";
import {myCustomTooltipDefaults} from "../../grid/form/form-constructor.component";
import {ApiParams} from "../../../_models";
import {StorageService} from "../../../_services/storage.service";


@Component({
    selector: 'model-form-static',
    templateUrl: '../../grid/form/form.component.html',
    styleUrls: ['../../grid/form/form.component.scss'],
    providers: [
        {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}
    ],
})
export class ModelFormStaticComponent extends FormStaticComponent implements OnInit,OnChanges  {
    @Output() onChangeType: EventEmitter<string>  = new EventEmitter();
    private previous_type: string;
    private previous_primary_key_table: string;

    constructor(
        protected modelService: ModelService,
        protected _formBuilder: FormBuilder,
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

    initSubscribers() {
        super.initSubscribers();
        this.form.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((status) => {
                if ( this.form_inited ) {
                    if (status.type && this.previous_type !== status.type ) {
                        this.previous_type = status.type;
                        this.onChangeType.emit(status.type);
                    }

                    if (status.primary_key_table && this.previous_primary_key_table !== status.primary_key_table ) {

                        let need_set_null = false;
                        if ( this.previous_primary_key_table !== undefined ) {
                            need_set_null = true;
                        }
                        this.previous_primary_key_table = status.primary_key_table;
                        if ( need_set_null ) {
                            this.form.controls['primary_key_name'].patchValue(null);
                            this.form.controls['value_name'].patchValue(null);
                        }
                        this.form.controls['query'].patchValue('SELECT * FROM re_' + status.primary_key_table);
                        this.refreshChild('primary_key_name', status.primary_key_table);
                        this.refreshChild('value_name', status.primary_key_table);
                    }

                }

            });
        this.afterFormInited
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((status) => {
                if ( this.form.controls['primary_key_table'].value !== null ) {
                    this.previous_primary_key_table = this.form.controls['primary_key_table'].value;
                    this.refreshChild('primary_key_name', this.form.controls['primary_key_table'].value);
                    this.refreshChild('value_name', this.form.controls['primary_key_table'].value);
                }
            });
    }

    refreshChild(child_key: string, parent_value: string) {
        this.records[child_key].api.params = {table_name: parent_value};
        this.init_select_box_options(child_key);
    }

    ngOnChanges (changes) {
    }
}

