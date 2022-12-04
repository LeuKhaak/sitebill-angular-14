import {Component, Inject, ViewChild} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SitebillEntity, SitebillModelItem} from "../../../_models";
import {ModelFormStaticComponent} from "./model-form-static.component";
import {ModelService} from "../../../_services/model.service";

@Component({
    selector   : 'model-form-modal',
    templateUrl: './model-form-modal.component.html',
    styleUrls  : ['./model-form-modal.component.scss']
})
export class ModelFormModalComponent
{
    entity: SitebillEntity;
    @ViewChild(ModelFormStaticComponent) form_static: ModelFormStaticComponent;

    /**
     * Constructor
     *
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public _data: {
            model_item: SitebillModelItem,
            table_id: string
        },
        protected modelService: ModelService,
        protected dialogRef: MatDialogRef<ModelFormModalComponent>,
    )
    {
        this.entity = new SitebillEntity();
        this.entity.set_app_name('columns');
        this.entity.set_table_name('columns');
        this.entity.set_primary_key('columns_id');
        this.entity.set_hidden('columns_id');

        if ( this._data.model_item ) {
            if ( this._data.model_item.columns_id ) {
                this.entity.set_key_value(this._data.model_item.columns_id);
            }
            if ( this._data.table_id ) {
                this.entity.set_default_value('table_id', this._data.table_id);
            }
        } else {
            // this.entity.set_default_value('type', 'safe_string');
        }

        // this.entity.set_title('колонки');
    }


    ngOnInit() {
    }

    close() {
        this.dialogRef.close();
    }

    update_form_fields_visibility( type: string = null ) {
        if ( !type ) {
            type = this.form_static.form.controls['type'].value;
        }
        let languages = this.modelService.getConfigValue('languages');

        let common_fields = [
            'name',
            'active',
            'table_id',
            'group_id',
            'value',
            'type',
            'required',
            'unique',
            'dbtype',
            'active_in_topic',
            'tab',
            'parameters',
            'uaction'
        ];
        common_fields = common_fields.concat(this.language_extends('title', languages));
        common_fields = common_fields.concat(this.language_extends('hint', languages));
        common_fields = common_fields.concat(this.language_extends('tab', languages));

        let result_fields = common_fields;

        let select_by_query_items = [
            'primary_key_name',
            'primary_key_table',
            'value_string',
            'query',
            'value_name',
            'value_default',
            'combo'
        ];
        select_by_query_items = select_by_query_items.concat(this.language_extends('title_default', languages));

        let type_visibility_fields = {
            'select_by_query': select_by_query_items,
            'select_by_query_multiple': select_by_query_items,
            'select_by_query_multi': select_by_query_items,
            'structure': ['entity'],
            'select_box_structure': ['value_string'].concat(this.language_extends('title_default', languages)),
            'select_box': this.language_extends('select_data', languages),
            'grade': this.language_extends('select_data', languages),

        };
        if (type_visibility_fields[type]) {
            result_fields = common_fields.concat(type_visibility_fields[type]);
        }

        for (const [key, value] of Object.entries(this.form_static.get_records())) {
            if ( !result_fields.includes(key) ) {
                this.form_static.hide_row(key);
            } else {
                this.form_static.show_row_soft(key);
            }
        }
    }

    language_extends ( key: string, languages: string[] ) {
        if ( !languages ) {
            return key;
        }
        let result = [];
        result.push(key);
        for (const [key_obj, value_obj] of Object.entries(languages)) {
            result.push(key + '_' + key_obj);
        }
        return result;
    }
}
