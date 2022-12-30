import {Injectable, Inject, isDevMode, Output, EventEmitter} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {APP_CONFIG, AppConfig} from 'app/app.config.module';
import {currentUser, UserProfile} from 'app/_models/currentuser';
import {ApiCall, SitebillEntity, SitebillModelItem, User} from 'app/_models';
import {Router} from '@angular/router';
import {FuseConfigService} from '../../@fuse/services/config.service';
import {FilterService} from './filter.service';
import {StorageService} from './storage.service';
import {SnackService} from './snack.service';
import {Observable, Subject, timer} from 'rxjs';
import {SitebillSession} from '../_models/sitebillsession';
import {takeUntil} from 'rxjs/operators';
import {UiService} from './ui.service';
import {ModelRedirectService} from './model-redirect.service';
import {ConfigService} from './config.service';
import {GetApiUrlService} from './get-api-url.service';
import {GetSessionKeyService} from './get-session-key.service';


@Injectable()
export class ModelService {
    private api_url = '';
    protected currentUser: currentUser;
    public entity: SitebillEntity;
    private need_reload = false;
    private session_key_validated = false;
    private nobody_mode = false;
    private current_user_profile: UserProfile;
    private sitebill_started: boolean;
    private config_loaded: boolean;
    private sitebill_config: any;
    private current_entity: SitebillEntity;
    private navbar_hidden: boolean;
    private toolbar_hidden: boolean;

    @Output() config_loaded_emitter: EventEmitter<any> = new EventEmitter();
    @Output() sitebill_loaded_complete_emitter: EventEmitter<any> = new EventEmitter();
    @Output() need_reload_emitter: EventEmitter<any> = new EventEmitter();
    @Output() valid_user_emitter: EventEmitter<any> = new EventEmitter();
    @Output() init_permissions_complete_emitter: EventEmitter<any> = new EventEmitter();

    private dom_sitebill_config: any;
    private install_mode: boolean;
    private nobody_first_login = false;
    public init_permissions_complete = false;
    public init_config_complete = false;
    protected _unsubscribeAll: Subject<any>;



    constructor(
        private http: HttpClient,
        private router: Router,
        protected _fuseConfigService: FuseConfigService,
        public storageService: StorageService,
        private filterService: FilterService,
        protected _snackService: SnackService,
        protected uiService: UiService,
        protected modelRedirectService: ModelRedirectService,
        protected getApiUrlService: GetApiUrlService,
        protected getSessionKeyService: GetSessionKeyService,
        protected configService: ConfigService,
        @Inject(APP_CONFIG) private config: AppConfig,
    ) {
        this._unsubscribeAll = new Subject();

        this.navbar_hidden = false;
        this.toolbar_hidden = false;
        // console.log('ModelService constructor');
        this.entity = new SitebillEntity();
        this.entity.set_app_name(null);
        this.entity.set_table_name(null);
        this.entity.primary_key = null;
        this.entity.key_value = null;
        this.sitebill_config = {};
        this.dom_sitebill_config = {};
        this.install_mode = false;


        this.current_user_profile = new UserProfile();

        this.currentUser = JSON.parse(this.storageService.getItem('currentUser')) || [];
        this.getApiUrlService.set_api_url(this.storageService.getItem('api_url'));
    }

    get sitebill_session(): SitebillSession {
        return {
            sessionId: this.getSessionKeyService.get_session_key(),
            clientUrl: ( this.getApiUrlService.get_api_url() !== '' ? this.getApiUrlService.get_api_url() : window.location.protocol + '//' + window.location.hostname ),
        };
    }

    onSitebillStart() {
        if ( !this.sitebill_started ) {
            // console.log('Sitebill started');
            this.init_config();
            this.init_permissions();
            this.sitebill_started = true;
        }
    }
    get_parser_api_url() {
        return 'https://www.etown.ru';
    }

    final_state() {
        if ( this.init_config_complete && this.init_permissions_complete ) {
            console.log('final_state true');
            return true;
        }
        return false;
    }

    is_need_reload() {
        // console.log('is_need_reload');
        // console.log(this.need_reload);
        return this.need_reload;
    }

    is_logged_in() {
        if ( this.getSessionKeyService.get_user_id() === null || this.getSessionKeyService.get_user_id() === 0 || this.getSessionKeyService.get_user_id() === undefined) {
            return false;
        }
        return true;
    }

    reinit_currentUser_standalone(storage) {
        this.storageService.setItem('currentUser', JSON.stringify(storage));
        this.currentUser = JSON.parse(this.storageService.getItem('currentUser')) || [];
    }

    load(model_name, grid_item, filter_params_json, owner, page, per_page) {
        const body = {
            action: 'model',
            do: 'get_data',
            model_name: model_name,
            owner: owner,
            page: page,
            per_page: per_page,
            params: filter_params_json,
            session_key: this.getSessionKeyService.get_session_key_safe(),
            grid_item: grid_item
        };
        // console.log(body);
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    // Возвращаем только записи, которые используются в связанной таблице
    load_dictionary(columnName) {
        const request = {action: 'model', do: 'load_dictionary', columnName: columnName, anonymous: true, session_key: this.getSessionKeyService.get_session_key_safe()};
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request);
    }

    // Возвращаем только записи, которые используются в связанной таблице
    load_dictionary_model(model_name, columnName, term = '') {
        const request = {
            action: 'model',
            do: 'load_dictionary',
            columnName: columnName,
            model_name: model_name,
            term: term,
            anonymous: true,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request);
    }

    load_dictionary_model_with_params(model_name, columnName, params, switch_off_ai_mode = false) {
        const request = {
            action: 'model',
            do: 'load_dictionary_with_params',
            columnName: columnName,
            model_name: model_name,
            params: params,
            switch_off_ai_mode: switch_off_ai_mode,
            anonymous: true,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request);
    }

    api_call(api_call: ApiCall, standard_params = {}) {
        let request = {
            action: api_call.name,
            do: api_call.method,
            params: api_call.params,
            anonymous: api_call.anonymous,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        request = {...request, ...standard_params};
        console.log(request);
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request);
    }
    async api_call_async(api_call: ApiCall, standard_params = {}) {
        return new Promise((resolve, reject) => {
            this.api_call(api_call, standard_params)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(
                    (result) => {
                        resolve(result);
                    },
                    error => {
                        console.log(error);
                        reject(new Error(error));
                    }
                );
        });
    }


    api_request(request: any) {
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request);
    }


    // Возвращает все записи
    load_dictionary_model_all(model_name, columnName) {
        const request = {
            action: 'model',
            do: 'load_dictionary',
            columnName: columnName,
            model_name: model_name,
            switch_off_ai_mode: true,
            anonymous: true,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request);
    }

    get_max(model_name, columnName) {
        const request = {action: 'model', do: 'get_max', model_name: model_name, columnName: columnName, anonymous: true,
            session_key: this.getSessionKeyService.get_session_key_safe()};
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request);
    }

    load_only_model(model_name, anonymous = false) {
        const load_data_request = {
            action: 'model',
            do: 'load_only_model',
            model_name: model_name,
            anonymous: (anonymous ? 1 : ''),
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, load_data_request);
    }

    loadByUri(model_name, entity_uri ) {
        const load_data_request = {
            action: 'model',
            do: 'load_data',
            model_name: model_name,
            entity_uri: entity_uri,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, load_data_request);
    }

    loadById(model_name, primary_key, key_value, ql_items = null ) {
        const load_data_request = {
            action: 'model',
            do: 'load_data',
            model_name: model_name,
            primary_key: primary_key,
            key_value: key_value,
            ql_items: ql_items,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, load_data_request);
    }

    map_model(row_model: any) {
        const good_model = [];
        Object.entries(row_model).forEach(
            (key, value) => {
                good_model[key[0]] = new SitebillModelItem(key[1]);
            }
        );
        return good_model;
    }

    native_insert(model_name, ql_items, only_ql = null) {
        const body = {
            action: 'model',
            do: 'native_insert',
            model_name: model_name,
            ql_items: ql_items,
            only_ql: only_ql,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    native_update(model_name, key_value, ql_items, only_ql = null) {
        const body = {
            action: 'model',
            do: 'native_update',
            model_name: model_name,
            key_value: key_value,
            ql_items: ql_items,
            only_ql: only_ql,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    update(model_name, key_value, ql_items) {
        const body = {action: 'model', do: 'graphql_update', model_name: model_name, key_value: key_value, ql_items: ql_items,
            session_key: this.getSessionKeyService.get_session_key_safe()};
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    update_only_ql(model_name, key_value, ql_items) {
        const body = {
            action: 'model',
            do: 'graphql_update',
            model_name: model_name,
            only_ql: true,
            key_value: key_value,
            ql_items: ql_items,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    update_column_meta(model_name, column_name, key, params) {
        console.log(model_name);
        console.log(column_name);
        console.log(key);
        console.log(params);
        const body = {
            action: 'model',
            do: 'update_column_meta',
            model_name: model_name,
            column_name: column_name,
            key: key,
            params: params,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    delete(model_name, primary_key, key_value) {
        const body = {action: 'model', do: 'delete', model_name: model_name, key_value: key_value, primary_key: primary_key,
            session_key: this.getSessionKeyService.get_session_key_safe()};
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    report(model_name, primary_key, key_value, complaint_id) {
        const body = {action: 'model', do: 'report', model_name: model_name, key_value: key_value, primary_key: primary_key,
            complaint_id: complaint_id, session_key: this.getSessionKeyService.get_session_key_safe()};
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    save_search(params, search_title) {
        const body = {action: 'mysearch', do: 'save', params: params, search_title: search_title, session_key: this.getSessionKeyService.get_session_key_safe()};
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    new_empty_record(model_name) {
        const body = {action: 'model', do: 'new_empty_record', model_name: model_name, session_key: this.getSessionKeyService.get_session_key_safe()};
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    load_grid_columns(entity: SitebillEntity) {
        let body = {};
        body = {action: 'model', do: 'load_grid_columns', model_name: entity.get_table_name(), session_key: this.getSessionKeyService.get_session_key_safe()};
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    format_grid(entity: SitebillEntity, grid_items: string[], per_page) {
        let body = {};
        body = {action: 'model', do: 'format_grid', model_name: entity.get_table_name(), grid_items: grid_items, per_page: per_page,
            session_key: this.getSessionKeyService.get_session_key_safe()};
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    uppend_uploads(model_name, key_name, key_value, field_name) {
        let body = {};
        body = {
            action: 'model',
            do: 'uppend_uploads',
            model_name: model_name,
            primary_key: key_name,
            key_value: key_value,
            image_field: field_name,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    toggle_collections(domain, deal_id, title, data_id, memorylist_id = 0) {
        let body = {};
        body = {
            action: 'memorylist',
            do: 'toggle',
            domain: domain,
            deal_id: deal_id,
            memorylist_id: memorylist_id,
            title: title,
            data_id: data_id,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    getConfigValue( key: string ) { // config
        if ( this.is_config_loaded() ) {
            return this.sitebill_config[key];
        }
        return null;
    }

    getDomConfigValue( key: string ) { // config
        return this.dom_sitebill_config[key];
    }

    setDomConfigValue( key: string, value: any ) { // config
        return this.dom_sitebill_config[key] = value;
    }


    setConfigValue(key, value) { // config
        this.sitebill_config[key] = value;
    }

// ===============================================================

    get_access(model_name, function_name) {
        const storage = JSON.parse(this.storageService.getItem('currentUser')) || [];
        if (storage['structure'] == null) {
            return false;
        }
        if (storage['structure']['group_name'] === 'admin') {
            return true;
        }
        if (storage['structure'][model_name] === null || storage['structure'][model_name] === undefined ) {
            return false;
        }
        if (storage['structure'][model_name][function_name]  === 1 ) {
            return true;
        }
        return false;
    }

    load_config() {  // config ?
        // console.log(this.getApiUrlService.get_api_url());
        let body = {};
        body = {action: 'model', do: 'load_config', anonymous: true, session_key: this.getSessionKeyService.get_session_key_safe()};
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    load_config_anonymous() { // config ?
        // console.log(this.get_api_url());
        let body = {};
        body = {action: 'model', do: 'load_config', anonymous: true, session_key: ''};
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    get_models_list() {
        let body = {};
        body = {action: 'table', do: 'get_models_list', session_key: this.getSessionKeyService.get_session_key_safe()};
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    is_config_loaded() { // config
        return this.config_loaded;
    }

    init_config_standalone() { // config
        // console.log('start init config standalone');
        this.load_config_anonymous()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                    // console.log('config standalone data loaded');
                    if (result.state === 'success') {
                        this.sitebill_config = result.data;
                        this.config_loaded = true;
                        this.config_loaded_emitter.emit(true);
                    } else {
                        console.log('load config failed');
                    }
                },
                error => {
                    console.log('load config failed, bad request standalone');
                });

    }


    init_config() { // config
        // console.log('start init config');
        this.load_config()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                // console.log('config data loaded');
                    if (result.state === 'success') {
                        this.sitebill_config = result.data;
                        this.config_loaded = true;
                        this.after_config_loaded();
                    } else {
                        console.log('load config failed');
                        if (this.modelRedirectService.is_model_redirect_enabled()) {
                            this.router.navigate(['grid/data']);
                        }
                    }
                },
                error => {
                    console.log('load config failed, bad request');
                    this.config_loaded_emitter.emit(true);
                    if ( this.modelRedirectService.is_model_redirect_enabled() ) {
                        this.router.navigate(['grid/data']);
                    }
                });

    }

    after_config_loaded() { // config
        // console.log('after_config_loaded');
        this.config_loaded_emitter.emit(true);
        this.init_config_complete = true;
        // console.log('apps.realty.default_frontend_route = ' + this.getConfigValue('apps.realty.default_frontend_route'));
        if (this.getConfigValue('apps.realty.enable_navbar') === '1') {
            this.uiService.show_navbar();
        }
        if (this.getConfigValue('apps.realty.enable_toolbar') === '1') {
            this.uiService.show_toolbar();
        }

        if ( this.getConfigValue('apps.realty.default_frontend_route') === null || this.getConfigValue('apps.realty.default_frontend_route') === undefined) {
            // console.log('default route');
            if ( this.modelRedirectService.is_model_redirect_enabled() ) {
                this.router.navigate(['grid/data']);
            }
        } else {
            // console.log('config route');
            // console.log(this.getConfigValue('apps.realty.default_frontend_route'));
            if ( this.modelRedirectService.is_model_redirect_enabled() ) {
                this.router.navigate([this.getConfigValue('apps.realty.default_frontend_route')]);
            }
        }

    }

    get_user_profile( user_id ) {
        const load_data_request = {
            action: 'model',
            do: 'load_any_profile',
            user_id: user_id,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, load_data_request);
    }

    load_page( slug ) {
        const load_data_request = {
            action: 'model',
            do: 'load_page',
            slug: slug,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, load_data_request);
    }


    get_current_user_profile() {
        return this.current_user_profile;
    }
    get_profile_img_url() {
        if ( this.current_user_profile.imgfile.value != null && this.current_user_profile.imgfile.value !== '') {
            return this.getApiUrlService.get_api_url(true) + '/img/data/user/' + this.current_user_profile.imgfile.value;
        }
        return false;
    }

    export_collections_pdf(domain, deal_id, report_type: string = 'client', memorylist_id = null) {
        const request = {
            action: 'pdfreport',
            do: 'export_collections_pdf',
            deal_id: deal_id,
            memorylist_id: memorylist_id,
            domain: domain,
            report_type: report_type,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request, {responseType: 'blob'});
    }

    excel_export(entity: SitebillEntity, input_params) {
        const request = {
            action: 'excelfree',
            do: 'export',
            model_name: entity.get_table_name(),
            input_params: input_params,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request, {responseType: 'blob'});
    }


    set_current_entity( entity: SitebillEntity ) {
        this.current_entity = entity;
    }

    public init_permissions() {
        // console.log('init_permissions');

        const request = {
            action: 'oauth',
            do: 'check_session_key',
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if ( result.success === 1 ) {
                    this.storageService.setItem('currentUser', JSON.stringify(result));
                }
                this.sitebill_loaded_complete_emitter.emit(true);
                this.init_permissions_complete_emitter.emit(true);
                this.init_permissions_complete = true;
            });
    }

    get_contact(contact_id: number) {
        const load_data_request = {
            action: 'model',
            model_name: 'contact',
            primary_key: 'id',
            do: 'get_contact',
            key_value: contact_id,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, load_data_request);
    }

    get_parser_today_count() {
        const load_data_request = {
            action: 'model',
            model_name: 'data',
            primary_key: 'id',
            do: 'get_today_count',
            session_key: 'nobody'
        };
        return this.http.post(`${this.get_parser_api_url()}/apps/api/rest.php`, load_data_request);
    }


    set_install_mode( mode: boolean ) {
        this.install_mode = mode;
    }

    get_install_mode() {
        return this.install_mode;
    }

    toggle( component, model_name, primary_key, primary_key_value, toggled_column_name ): Observable<any> {
        const request = {
            action: component,
            do: 'toggle',
            model_name: model_name,
            primary_key: primary_key,
            primary_key_value: primary_key_value,
            toggled_column_name: toggled_column_name,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request);
    }

    OnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
