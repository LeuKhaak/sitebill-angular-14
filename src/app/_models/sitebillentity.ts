export enum FormType {
    simple="simple",
    inline="inline"
}
export class SitebillEntity {
    private app_name: string;
    private table_name: string;
    primary_key: string;
    key_value: number;
    columns: string[];
    columns_index: any[];
    default_columns_list: string[];
    default_params: string[];
    private hidden_edit_columns: string[];
    model: SitebillModelItem[];
    private enable_collections: boolean;
    private hook: string;
    private readonly: boolean;
    private enable_comment: boolean;
    private app_url: string;
    private app_session_key: string;
    private title: string;
    private form_type: string;
    private ql_items: any;
    private params: {};
    private hidden_items: {};
    private default_values: {};
    private delete_disabled = false;

    constructor() {
        this.columns = [];
        this.model = [];
        this.columns_index = [];
        this.default_columns_list = [];
        this.default_params = [];
        this.hidden_edit_columns = [];
        this.enable_collections = false;
        this.hook = null;
        this.readonly = false;
        this.enable_comment = true;
        this.app_url = null;
        this.app_session_key = null;
        this.title = null;
        this.form_type = FormType.simple;
        this.params = {};
        this.hidden_items = {};
        this.default_values = {};
    }

    get_app_name() {
        return this.app_name;
    }

    set_app_name(app_name: string) {
        this.app_name = app_name;
    }

    get_default_params() {
        return this.default_params;
    }

    set_default_params(default_params) {
        this.default_params = default_params;
    }

    set_default_columns_list(default_columns_list) {
        this.default_columns_list = default_columns_list;
    }

    get_default_columns_list() {
        return this.default_columns_list;
    }

    get_table_name() {
        return this.table_name;
    }

    set_table_name(table_name: string) {
        this.table_name = table_name;
    }

    add_column(name: string) {
        this.columns.push(name);
    }

    get_key_value() {
        return this.key_value;
    }

    get_primary_key() {
        return this.primary_key;
    }

    set_primary_key(name: string) {
        this.primary_key = name;
    }

    set_enable_comment () {
        this.enable_comment = true;
    }
    set_disable_comment () {
        this.enable_comment = false;
    }
    is_enable_comment () {
        return this.enable_comment;
    }


    set_enable_collections() {
        this.enable_collections = true;
    }

    set_disable_collections() {
        this.enable_collections = false;
    }

    is_enable_collections() {
        return this.enable_collections;
    }

    set_key_value(key_value: any) {
        this.key_value = key_value;
    }

    get_hook() {
        return this.hook;
    }

    set_hook(hook: string) {
        this.hook = hook;
    }

    get_ql_items() {
        return this.ql_items;
    }

    set_ql_items(ql_items: any) {
        this.ql_items = ql_items;
    }

    get_param(key:string) {
        return this.params[key];
    }

    set_param(key: string, value: string) {
        this.params[key] = value;
    }



    get_readonly() {
        return this.readonly;
    }

    set_readonly(readonly: boolean) {
        this.readonly = readonly;
    }

    hide_column_edit(column_name) {
        this.hidden_edit_columns.push(column_name);
    }

    get_hidden_column_edit(column_name) {
        if ( this.hidden_edit_columns.indexOf(column_name) !== -1){
            return true;
        }
        return false;
    }

    get_app_url() {
        try {
            if ( this.app_url !== undefined && this.app_url != null ) {
                return this.app_url;
            }
        } catch (e) {

        }
        return null;
    }

    set_app_url(app_url: string) {
        this.app_url = app_url;
    }

    get_app_session_key() {
        try {
            if ( this.app_session_key !== undefined && this.app_session_key != null ) {
                return this.app_session_key;
            }
        } catch (e) {

        }
        return null;
    }

    set_app_session_key(app_session_key: string) {
        this.app_session_key = app_session_key;
    }
    get_title() {
        return this.title;
    }

    set_title(title: string) {
        this.title = title;
    }

    get_form_type() {
        return this.form_type;
    }

    set_form_type(form_type: string) {
        this.form_type = FormType[form_type];
    }

    get_model_value(key:string) {
        if ( this.model[key] ) {
            return this.model[key].getValue();
        }
        return null;
    }

    get_model_item(key:string) {
        if ( this.model[key] ) {
            return this.model[key];
        }
        return null;
    }

    get_model_value_string(key:string) {
        if ( this.model[key] ) {
            return this.model[key].getValueString();
        }
        return null;
    }

    set_hidden(key: string) {
        this.hidden_items[key] = true;
    }

    is_hidden (key: string) {
        if ( this.hidden_items[key] ) {
            return true;
        }
        return false;
    }

    set_default_value(key: string, value: any) {
        this.default_values[key] = value;
    }

    get_default_value(key: string) {
        if ( this.default_values[key] ) {
            return this.default_values[key];
        }
        return null;
    }

    disable_delete () {
        this.delete_disabled = true;
    }

    is_delete_disabled () {
        return this.delete_disabled;
    }
}
export interface ApiCall {
    api: string,
    name: string,
    method: string,
    params?: ApiParams[],
    anonymous: boolean
}
export interface ApiParams {
    [key: string]: any;
}
export interface JsonParams {
    [key: string]: any;
}
export class SitebillModelItem {
    action: string;
    active_in_topic: string;
    name: string;
    value: any;
    value_string: string;
    select_data_indexed: any;
    assign_to: string;
    combo: string;
    dbtype: string;
    entity: string;
    group_id: string;
    group_id_array: [];
    hint: string;
    primary_key: string;
    primary_key_name: string;
    primary_key_table: string;
    primary_key_value: string;
    query: string;
    required: string;
    required_boolean: boolean;
    tab: string;
    table_name: string;
    title: string;
    title_default: string;
    type: string;
    unique: string;
    value_default: string;
    value_field: string;
    value_name: string;
    value_primary_key: string;
    value_table: string;
    columns_id: number;
    table_id: number;
    active: boolean;
    parameters: any;
    fxFlex: number;
    api: ApiCall;

    // Дополнительные поля
    hidden: boolean;
    active_in_topic_array: any;
    readonly type_native: string;
    multiple: boolean;

    constructor(item:any = null) {
        this.action = item.action;
        this.active_in_topic = item.active_in_topic;
        this.active_in_topic_array = null;
        this.name = item.name;
        this.value = item.value;
        if ( this.name == 'dbtype' ) {
            this.patchDBType();
        }

        this.value_string = item.value_string;
        this.select_data_indexed = item.select_data_indexed;
        this.assign_to = item.assign_to;
        this.combo = item.combo;

        this.entity = item.entity;
        this.group_id = item.group_id;
        this.group_id_array = item.group_id_array;
        this.hint = item.hint;
        this.primary_key = item.primary_key;
        this.primary_key_name = item.primary_key_name;
        this.primary_key_table = item.primary_key_table;
        this.primary_key_value = item.primary_key_value;
        this.query = item.query;
        this.required = item.required;
        //console.log(item.required_boolean);
        this.required_boolean = item.required_boolean === '1';
        //console.log(this.required_boolean);
        this.tab = item.tab;
        this.table_name = item.table_name;
        this.title = item.title;
        this.title_default = item.title_default;
        this.type = item.type;
        this.type_native = item.type;
        this.multiple =
            item.type === 'select_by_query_multiple' ||
            item.type === 'select_by_query_multi' ||
            item.type === 'select_box_structure_simple_multiple' ||
            item.type === 'select_box_structure_multiple_checkbox';
        this.unique = item.unique;
        this.value_default = item.value_default;
        this.value_field = item.value_field;
        this.value_name = item.value_name;
        this.value_primary_key = item.value_primary_key;
        this.value_table = item.value_table;
        this.columns_id = item.columns_id;
        this.table_id = item.table_id;
        this.active = item.active === '1';
        this.fxFlex = item.fxFlex;
        this.api = item.api;
        this.parameters = item.parameters;
    }

    patchDBType () {
        if ( this.value && (this.value === '0' || this.value === 'notable') ) {
            this.value = '0';
        } else {
            this.value = '1';
        }
    }

    getValue() {
        return this.value;
    }

    getValueString() {
        return this.value_string;
    }
}
