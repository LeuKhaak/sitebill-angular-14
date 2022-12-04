import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '../../../../@fuse/animations';
import {ModelService} from '../../../_services/model.service';
import {SnackService} from '../../../_services/snack.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {takeUntil} from 'rxjs/operators';
import {SitebillEntity} from '../../../_models';
import {FilterService} from '../../../_services/filter.service';
import {ChangeContext} from 'ng5-slider';

@Component({
    selector: 'compose-modal',
    templateUrl: './compose-modal.component.html',
    styleUrls: ['./compose-modal.component.scss'],
    animations: fuseAnimations
})
export class ComposeModalComponent  implements OnInit {
    valid_domain_through_email: FormGroup;
    loading = false;
    show_login: boolean;
    private entity: SitebillEntity;
    form_compose_columns: any[];
    private composeForm: FormGroup;
    public compose_form_complete: boolean;
    options_storage = {};
    options_storage_type = {};
    options_storage_titles = [];
    dictionary_loaded = [];
    clear_enable: boolean;



    constructor(
        protected modelService: ModelService,
        private _formBuilder: FormBuilder,
        private filterService: FilterService,
        private dialogRef: MatDialogRef<ComposeModalComponent>,
        protected cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        this.valid_domain_through_email = this._formBuilder.group({
            domain_checker: ['', [Validators.required, Validators.email]],
        });
        this.show_login = true;
        this.init_register_form();

    }

    init_register_form () {
        this.composeForm = this._formBuilder.group({});
    }

    ngOnInit() {
        /*
        console.log(this._data.column.model_name);
        console.log(this._data.entity.columns_index[this._data.column.model_name]);
        console.log(this._data.entity.model[this._data.entity.columns_index[this._data.column.model_name]]);

        console.log(this._data.entity.model[this._data.entity.columns_index[this._data.column.model_name]].parameters.columns);
         */
        this.entity = this._data.entity;
        this.init_compose_form();
    }

    get_title ( column_name ) {
        return this._data.entity.model[this._data.entity.columns_index[column_name]].title;
    }

    get_column_model ( column_name ) {
        return this._data.entity.model[this._data.entity.columns_index[column_name]];
    }

    get_column_model_parameters ( column_name ) {
        return this._data.entity.model[this._data.entity.columns_index[column_name]].parameters;
    }

    get_composed_column_name () {
        return this._data.column.model_name;
    }

    column_defined ( column_name ) {
        if ( this._data.entity.model[this._data.entity.columns_index[column_name]] != null ) {
            return true;
        }
        return false;
    }

    get_compose_columns () {
        const compose_string = this._data.entity.model[this._data.entity.columns_index[this._data.column.model_name]].parameters.columns;
        return compose_string.split(',');
    }

    init_compose_form () {
        let compose_columns = [];
        try {
            compose_columns = this.get_compose_columns();
            const filter_compose_storage = this.filterService.get_share_data(this.entity.get_app_name(), this.get_composed_column_name());
            if ( compose_columns.length > 0 ) {
                this.form_compose_columns = compose_columns;
                for (let i = 0; i < compose_columns.length; i++) {
                    if ( this.column_defined(compose_columns[i]) ) {
                        const parameters = this.get_column_model_parameters(compose_columns[i]);
                        if (parameters.slider !== undefined && parameters.slider !== null) {
                            this.options_storage_type[compose_columns[i]] = 'slider';
                            this.options_storage[compose_columns[i]] = {};
                            this.options_storage[compose_columns[i]].min = 0;
                            this.options_storage[compose_columns[i]].max = 0;
                            try {
                                if (filter_compose_storage[compose_columns[i]] != null) {
                                    this.options_storage[compose_columns[i]].min = filter_compose_storage[compose_columns[i]].min;
                                    this.options_storage[compose_columns[i]].max = filter_compose_storage[compose_columns[i]].max;
                                }
                            } catch (e) {

                            }
                            this.options_storage[compose_columns[i]].loaded = false;
                            this.options_storage[compose_columns[i]].title = this.get_title(compose_columns[i]);

                            this.modelService.get_max(this.entity.get_table_name(), compose_columns[i]).subscribe((result: any) => {
                                //console.log(result);
                                if ( result.state === 'success' ) {
                                    this.options_storage[compose_columns[i]].options = {};
                                    if (this.options_storage[compose_columns[i]].max === 0) {
                                        this.options_storage[compose_columns[i]].max = result.message;
                                    }
                                    this.options_storage[compose_columns[i]].options.floor = 0;
                                    this.options_storage[compose_columns[i]].options.ceil = result.message;
                                    this.options_storage[compose_columns[i]].loaded = true;
                                }
                            });

                        } else {
                            if ( !this.is_dictionary_loaded(compose_columns[i]) ) {
                                this.load_dictionary(compose_columns[i]);
                            }

                            const form_control_item = new FormControl(compose_columns[i]);
                            form_control_item.clearValidators();
                            this.options_storage_type[compose_columns[i]] = 'select';
                            this.options_storage[compose_columns[i]] = [];
                            this.options_storage_titles[compose_columns[i]] = this.get_title(compose_columns[i]);
                            this.composeForm.addControl(compose_columns[i], form_control_item);
                            if (filter_compose_storage != null) {
                                if ( filter_compose_storage[compose_columns[i]] != null ) {
                                    console.log(filter_compose_storage[compose_columns[i]]);

                                    this.composeForm.controls[compose_columns[i]].patchValue(filter_compose_storage[compose_columns[i]]);
                                    this.clear_enable = true;
                                }
                            }
                            // console.log(this.filterService.get_share_data(this.entity.get_app_name(), compose_columns[i]));
                        }
                    }
                }
                this.compose_form_complete = true;
            }
        } catch (e) {
            console.log(e);
        }
        this.cdr.markForCheck();
    }

    onFocus(columnName) {
        this.load_dictionary(columnName);
    }

    is_dictionary_loaded (columnName) {
        if ( this.dictionary_loaded[columnName] === true ) {
            return true;
        }
        return false;
    }

    load_dictionary(columnName) {
        if ( !this.is_dictionary_loaded(columnName) ) {
            this.modelService.load_dictionary_model_with_params(this.entity.get_table_name(), columnName, this.entity.get_default_params())
                .subscribe((result: any) => {
                    this.options_storage[columnName] = result.data;
                });
            this.dictionary_loaded[columnName] = true;
            this.cdr.markForCheck();
        }
    }

    apply() {
        try {
            const compose_columns = this.get_compose_columns();
            const compose_result = {};
            this.clear_enable = false;
            if (compose_columns.length > 0) {
                //console.log('apply');
                //console.log(compose_columns);

                for (let i = 0; i < compose_columns.length; i++) {
                    //console.log(compose_columns[i]);

                    if ( this.column_defined(compose_columns[i]) ) {
                        if ( this.composeForm.controls[compose_columns[i]] != null ) {
                            if ( this.composeForm.controls[compose_columns[i]].value !==  compose_columns[i]) {
                                compose_result[compose_columns[i]] = this.composeForm.controls[compose_columns[i]].value;
                                this.clear_enable = true;
                            }
                        }
                        if (this.options_storage[compose_columns[i]] != null) {
                            if ( this.options_storage_type[compose_columns[i]] != null ) {
                                if ( this.options_storage_type[compose_columns[i]] === 'slider' ) {
                                    compose_result[compose_columns[i]] = this.options_storage[compose_columns[i]];
                                    this.clear_enable = true;
                                }
                            }
                        }
                    }
                    //console.log(this.options_storage[compose_columns[i]]);

                    // console.log(compose_columns[i]);
                }

                // console.log(this.entity);
                // console.log(this._data.column.model_name);
                if ( this.clear_enable ) {
                    this.filterService.share_data(this.entity, this._data.column.model_name, compose_result);
                }
                this.dialogRef.close();
            }
        } catch (e) {

        }

    }

    clear() {
        let compose_columns = [];
        try {
            compose_columns = this.get_compose_columns();
            const filter_compose_storage = this.filterService.get_share_data(this.entity.get_app_name(), this.get_composed_column_name());
            if ( compose_columns.length > 0 ) {
                this.form_compose_columns = compose_columns;
                for (let i = 0; i < compose_columns.length; i++) {
                    if ( this.column_defined(compose_columns[i]) ) {
                        this.composeForm.controls[compose_columns[i]].patchValue('');
                    }
                }
                this.filterService.unshare_data(this.entity, this._data.column.model_name);
                this.cdr.markForCheck();
            }
        } catch (e) {
            console.log(e);
        }
    }

    enable_clear_button() {
        this.clear_enable = true;
    }

    onPriceSliderChange($event: ChangeContext) {

    }
}
