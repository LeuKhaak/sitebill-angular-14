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
    private model_redirect = true;

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
        @Inject(APP_CONFIG) private config: AppConfig,
    ) {
        this._unsubscribeAll = new Subject();

        this.navbar_hidden = false;
        this.toolbar_hidden = false;
        // console.log('ModelService constructor');
        this.entity = new SitebillEntity;
        this.entity.set_app_name(null);
        this.entity.set_table_name(null);
        this.entity.primary_key = null;
        this.entity.key_value = null;
        this.sitebill_config = {};
        this.dom_sitebill_config = {};
        this.install_mode = false;


        this.current_user_profile = new UserProfile();

        this.currentUser = JSON.parse(this.storageService.getItem('currentUser')) || [];
        this.set_api_url(this.storageService.getItem('api_url'));
    }

    get sitebill_session(): SitebillSession {
        return {
            sessionId: this.get_session_key(),
            clientUrl: ( this.get_api_url() !== '' ? this.get_api_url() : window.location.protocol + '//' + window.location.hostname ),
        };
    }


    set_api_url(api_url: string) { // get-api
        this.api_url = api_url;
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


    get_api_url(ignore_entity_url = false) {  // get-api
        if ( !ignore_entity_url ) {
            try {
                if (this.get_current_entity().get_app_url() != null) {
                    return this.get_current_entity().get_app_url();
                    // console.log(this.get_current_entity().get_app_name() + Math.random());
                }
            } catch (e) {

            }
        }
        if (isDevMode() && (this.api_url == '' || this.api_url === null)) {
            return this.config.apiEndpoint;
        } else if (this.api_url == null) {
            return '';
        } else {
            // console.log('prod url');
            // console.log(this.api_url);
            return this.api_url;
        }
    }

    all_checks_passes() {
        if ( this.get_nobody_mode() || this.get_user_id() > 0 ) {
            console.log('all_checks_passes success');
            return true;
        }
        return false;
    }

    final_state() {
        if ( this.init_config_complete && this.init_permissions_complete ) {
            console.log('final_state true');
            return true;
        }
        return false;
    }

    get_nobody_mode() {
        return this.nobody_mode;
    }
    enable_nobody_mode() {
        this.session_key_validated = true;
        this.nobody_mode = true;
    }
    disable_nobody_mode() {
        this.nobody_mode = false;
    }

    enable_guest_mode() {
        console.log('apps.realty.enable_guest_mode ' + this.getConfigValue('apps.realty.enable_guest_mode'));
        if ( this.getConfigValue('apps.realty.enable_guest_mode') === '1') {
            if ( this.get_user_id() === null || this.get_user_id() === 0 || this.get_user_id() === undefined ) {
                this.get_cms_session()
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((result: any) => {
                    console.log(result);
                    let finaly_need_guest = false;
                    try {
                        const storage = JSON.parse(result) || [];
                        if (storage.user_id > 0) {
                            console.log('cms user_id = ' + storage.user_id);
                            this.storageService.setItem('currentUser', JSON.stringify(storage));
                            this.reinit_currentUser();
                            this.after_config_loaded();
                            return true;
                        } else {
                            finaly_need_guest = true;
                        }
                    } catch (e) {
                        finaly_need_guest = true;
                    }

                    if (finaly_need_guest) {
                        console.log('need guest mode');
                        if ( this.get_session_key() === null ) {
                            this.init_nobody_user_storage();
                        } else if ( this.get_session_key() === 'nobody' ) {
                            this.enable_nobody_mode();
                        } else if ( this.get_session_key() === undefined ) {
                            this.init_nobody_user_storage();
                        } else {
                            this.enable_nobody_mode();
                        }
                    }

                });
            }
        } else {
            console.log('guest mode not enabled');
            if ( !this.nobody_first_login ) {
                this._snackService.message('Для работы с разделом вы должны авторизоваться.');
                const timerPeriod = 1000;
                const numbers = timer(timerPeriod);
                numbers
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(x => this.router.navigate(['/login/']));
                this.nobody_first_login = true;
            }
        }
    }

    enable_need_reload( from = '') {
        if ( from !== '' ) {
            // console.log('enable_need_reload from ' + from);
        }
        // console.log('enable_need_reload');
        this.need_reload = true;

    }

    disable_need_reload() {
        // console.log('disable_need_reload');
        this.need_reload = false;
        this.session_key_validate();
    }

    is_need_reload() {
        // console.log('is_need_reload');
        // console.log(this.need_reload);
        return this.need_reload;
    }

    session_key_validate() {
        if ( !this.session_key_validated ) {
            // console.log('session_key_validate');
            this.load_current_user_profile();
        }
        this.session_key_validated = true;
    }

    is_validated_session_key() {
        // console.log('is_validated_session_key');
        return this.session_key_validated;
    }

    disable_session_key_validity() {
        this.session_key_validated = false;
    }

    get_session_key() { // get-session
        try {
            if (this.get_current_entity().get_app_session_key() != null) {
                return this.get_current_entity().get_app_session_key();
                // console.log(this.get_current_entity().get_app_name() + Math.random());
            }
        } catch (e) {

        }

        // console.log('|get_session_key');
        // console.log(this.currentUser);
        // console.log('get_session_key|');
        if (this.currentUser === null) {
            return null;
        }
        // console.log(this.currentUser.session_key);
        return this.currentUser.session_key;
    }

    get_session_key_safe() {  // get-session
        const session_key = this.get_session_key();
        if (!this.is_validated_session_key()) {
            this.validateKey(session_key)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                if (result.error === 'check_session_key_failed') {
                    console.log('check_session_key_failed need reload');
                    if ( this.is_model_redirect_enabled() ) {
                        console.log('reset storage');
                        this.reset_local_user_storage();
                        const refresh_url = this.router.url;
                        this.enable_need_reload('get_session_key_safe');
                        this.router.navigate([refresh_url]);
                    }
                    if ( this.getDomConfigValue('standalone_mode' ) ) {
                        this.reset_local_user_storage();
                        this.need_reload_emitter.emit(true);
                    }
                } else {
                    this.session_key_validate();
                }
            });
        }
        if (session_key == null) {
            if ( this.is_model_redirect_enabled() ) {
                this.logout();
            }

        }
        return session_key;
    }

    get_user_id() {
        if (this.currentUser == null) {
            return null;
        }
        return this.currentUser.user_id;
    }

    is_logged_in() {
        if ( this.get_user_id() === null || this.get_user_id() === 0 || this.get_user_id() === undefined) {
            return false;
        }
        return true;
    }

    init_nobody_user_storage() {
        this.reset_local_user_storage();

        this.init_nobody_session()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
            if ( result.error === 'check_session_key_failed' ) {
                this.reset_local_user_storage();
                const refresh_url = this.router.url;
                this.enable_need_reload('init_nobody_user_storage');
                this.router.navigate([refresh_url]);
            } else {
                this.currentUser = result;
                this.storageService.setItem('currentUser', JSON.stringify(this.currentUser));
                this.enable_nobody_mode();
            }
        });
    }

    reset_local_user_storage() {
        // console.log('reset_local_user_storage');
        localStorage.removeItem('currentUser');
        if (this.currentUser != null) {
            this.currentUser.session_key = null;
            this.currentUser = null;
        }
    }

    logout() {
        if ( this.all_checks_passes() ) {
            console.log('run logout');
            this.model_logout()
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(
                data => {
                    this.enable_guest_mode();

                    this.router.navigate(['/logout']);
                },
                error => {
                    console.log(error);
                });
        }
    }

    model_logout() {
        this.currentUser = JSON.parse(this.storageService.getItem('currentUser')) || [];

        const body = {action: 'oauth', do: 'logout', session_key: this.currentUser.session_key};
        const url = `${this.api_url}/apps/api/rest.php`;

        this.disable_menu();
        this.reset_local_user_storage();
        this.disable_session_key_validity();
        this.current_user_profile = new UserProfile();

        return this.http.post<any>(url, body);
    }


    disable_menu() { // ui
        // console.log('disable menu');
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                }
            }
        };
    }

    reinit_currentUser_standalone(storage) {
        this.storageService.setItem('currentUser', JSON.stringify(storage));
        this.currentUser = JSON.parse(this.storageService.getItem('currentUser')) || [];
    }

    reinit_currentUser() {
        this.currentUser = JSON.parse(this.storageService.getItem('currentUser')) || [];
        this.disable_need_reload();
        // console.log('reinit current user');
        // console.log(this.storageService.getItem('currentUser'));
        // console.log(this.currentUser);
        // console.log('reinit complete');
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
            session_key: this.get_session_key_safe(),
            grid_item: grid_item
        };
        // console.log(body);
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    // Возвращаем только записи, которые используются в связанной таблице
    load_dictionary(columnName) {
        const request = {action: 'model', do: 'load_dictionary', columnName: columnName, anonymous: true, session_key: this.get_session_key_safe()};
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, request);
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
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, request);
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
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, request);
    }

    api_call(api_call: ApiCall, standard_params = {}) {
        let request = {
            action: api_call.name,
            do: api_call.method,
            params: api_call.params,
            anonymous: api_call.anonymous,
            session_key: this.get_session_key_safe()
        };
        request = {...request, ...standard_params};
        console.log(request);
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, request);
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
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, request);
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
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, request);
    }

    get_max(model_name, columnName) {
        const request = {action: 'model', do: 'get_max', model_name: model_name, columnName: columnName, anonymous: true, session_key: this.get_session_key_safe()};
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, request);
    }

    load_only_model(model_name, anonymous = false) {
        const load_data_request = {
            action: 'model',
            do: 'load_only_model',
            model_name: model_name,
            anonymous: (anonymous ? 1 : ''),
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, load_data_request);
    }

    loadByUri(model_name, entity_uri ) {
        const load_data_request = {
            action: 'model',
            do: 'load_data',
            model_name: model_name,
            entity_uri: entity_uri,
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, load_data_request);
    }

    loadById(model_name, primary_key, key_value, ql_items = null ) {
        const load_data_request = {
            action: 'model',
            do: 'load_data',
            model_name: model_name,
            primary_key: primary_key,
            key_value: key_value,
            ql_items: ql_items,
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, load_data_request);
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

    validateKey(session_key) {
        const model_name = 'data';
        const primary_key = 'id';
        const key_value = 1;
        const load_data_request = {action: 'model', do: 'load_data', model_name: model_name, primary_key: primary_key, key_value: key_value, session_key: session_key};
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, load_data_request);
    }

    native_insert(model_name, ql_items, only_ql = null) {
        const body = {
            action: 'model',
            do: 'native_insert',
            model_name: model_name,
            ql_items: ql_items,
            only_ql: only_ql,
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    native_update(model_name, key_value, ql_items, only_ql = null) {
        const body = {
            action: 'model',
            do: 'native_update',
            model_name: model_name,
            key_value: key_value,
            ql_items: ql_items,
            only_ql: only_ql,
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    update(model_name, key_value, ql_items) {
        const body = {action: 'model', do: 'graphql_update', model_name: model_name, key_value: key_value, ql_items: ql_items, session_key: this.get_session_key_safe()};
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    update_only_ql(model_name, key_value, ql_items) {
        const body = {
            action: 'model',
            do: 'graphql_update',
            model_name: model_name,
            only_ql: true,
            key_value: key_value,
            ql_items: ql_items,
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
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
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    delete(model_name, primary_key, key_value) {
        const body = {action: 'model', do: 'delete', model_name: model_name, key_value: key_value, primary_key: primary_key, session_key: this.get_session_key_safe()};
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    report(model_name, primary_key, key_value, complaint_id) {
        const body = {action: 'model', do: 'report', model_name: model_name, key_value: key_value, primary_key: primary_key, complaint_id: complaint_id, session_key: this.get_session_key_safe()};
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    save_search(params, search_title) {
        const body = {action: 'mysearch', do: 'save', params: params, search_title: search_title, session_key: this.get_session_key_safe()};
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    new_empty_record(model_name) {
        const body = {action: 'model', do: 'new_empty_record', model_name: model_name, session_key: this.get_session_key_safe()};
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    load_grid_columns(entity: SitebillEntity) {
        let body = {};
        body = {action: 'model', do: 'load_grid_columns', model_name: entity.get_table_name(), session_key: this.get_session_key_safe()};
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    format_grid(entity: SitebillEntity, grid_items: string[], per_page) {
        let body = {};
        body = {action: 'model', do: 'format_grid', model_name: entity.get_table_name(), grid_items: grid_items, per_page: per_page, session_key: this.get_session_key_safe()};
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
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
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
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
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    get_cms_session() {
        let body = {};
        body = {layer: 'native_ajax', get_cms_session: '1'};
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    init_nobody_session() {
        let body = {};
        body = { action: 'init_nobody_session', session_key: 'nobody'};
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

// ==================================================================== config-auxiliary

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
        // console.log(this.get_api_url());
        let body = {};
        body = {action: 'model', do: 'load_config', anonymous: true, session_key: this.get_session_key_safe()};
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    load_config_anonymous() { // config ?
        // console.log(this.get_api_url());
        let body = {};
        body = {action: 'model', do: 'load_config', anonymous: true, session_key: ''};
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    system_config() { // config
        let body = {};
        body = {action: 'config', do: 'system_config', session_key: this.get_session_key_safe()};
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    get_models_list() {
        let body = {};
        body = {action: 'table', do: 'get_models_list', session_key: this.get_session_key_safe()};
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    update_system_config( ql_items: any ) { // config
        let body = {};
        body = {
            action: 'config',
            do: 'update',
            ql_items: ql_items,
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
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
                        if (this.is_model_redirect_enabled()) {
                            this.router.navigate(['grid/data']);
                        }
                    }
                },
                error => {
                    console.log('load config failed, bad request');
                    this.config_loaded_emitter.emit(true);
                    if ( this.is_model_redirect_enabled() ) {
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
            this.show_navbar();
        }
        if (this.getConfigValue('apps.realty.enable_toolbar') === '1') {
            this.show_toolbar();
        }

        if ( this.getConfigValue('apps.realty.default_frontend_route') === null || this.getConfigValue('apps.realty.default_frontend_route') === undefined) {
            // console.log('default route');
            if ( this.is_model_redirect_enabled() ) {
                this.router.navigate(['grid/data']);
            }
        } else {
            // console.log('config route');
            // console.log(this.getConfigValue('apps.realty.default_frontend_route'));
            if ( this.is_model_redirect_enabled() ) {
                this.router.navigate([this.getConfigValue('apps.realty.default_frontend_route')]);
            }
        }

    }

    load_current_user_profile() {
        this.get_oauth_user_profile()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
            if (result.state === 'success') {
                if ( result.data.group_id != null ) {
                    this.current_user_profile.group_id.value = result.data.group_id.value;
                    this.current_user_profile.group_id.value_string = result.data.group_id.value_string;
                }

                if ( result.data.user_id != null ) {
                    this.current_user_profile.user_id.value = result.data.user_id.value;
                    this.current_user_profile.user_id.value_string = result.data.user_id.value_string;
                }

                if ( result.data.fio != null ) {
                    this.current_user_profile.fio.value = result.data.fio.value;
                }
                if (result.data.email != null) {
                    this.current_user_profile.email.value = result.data.email.value;
                }
                if ( result.data.imgfile != null ) {
                    this.current_user_profile.imgfile.value = result.data.imgfile.value;
                }
                this.valid_user_emitter.emit(true);
            } else {
                console.log('get_oauth_user_profile failed');
                this.valid_user_emitter.emit(false);
            }
        });
    }

    get_oauth_user_profile() {
        const load_data_request = {
            action: 'oauth',
            do: 'load_my_profile',
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, load_data_request);
    }

    get_user_profile( user_id ) {
        const load_data_request = {
            action: 'model',
            do: 'load_any_profile',
            user_id: user_id,
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, load_data_request);
    }

    load_page( slug ) {
        const load_data_request = {
            action: 'model',
            do: 'load_page',
            slug: slug,
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, load_data_request);
    }


    get_current_user_profile() {
        return this.current_user_profile;
    }
    get_profile_img_url() {
        if ( this.current_user_profile.imgfile.value != null && this.current_user_profile.imgfile.value !== '') {
            return this.get_api_url(true) + '/img/data/user/' + this.current_user_profile.imgfile.value;
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
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, request, {responseType: 'blob'});
    }

    excel_export(entity: SitebillEntity, input_params) {
        const request = {
            action: 'excelfree',
            do: 'export',
            model_name: entity.get_table_name(),
            input_params: input_params,
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, request, {responseType: 'blob'});
    }


    set_current_entity( entity: SitebillEntity ) {
        this.current_entity = entity;
    }

    get_current_entity() {
        return this.current_entity;
    }

    public init_permissions() {
        // console.log('init_permissions');

        const request = {
            action: 'oauth',
            do: 'check_session_key',
            session_key: this.get_session_key_safe()
        };
        this.http.post(`${this.get_api_url()}/apps/api/rest.php`, request)
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

    show_navbar() { // ui
        this.navbar_hidden = false;
    }

    hide_navbar() { // ui
        this.navbar_hidden = true;
    }

    is_navbar_hidden() { // ui
        return this.navbar_hidden;
    }

    show_toolbar() { // ui
        this.toolbar_hidden = false;
    }

    hide_toolbar() { // ui
        this.toolbar_hidden = true;
    }

    is_toolbar_hidden() { // ui
        return this.toolbar_hidden;
    }

    get_contact(contact_id: number) {
        const load_data_request = {
            action: 'model',
            model_name: 'contact',
            primary_key: 'id',
            do: 'get_contact',
            key_value: contact_id,
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, load_data_request);
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

    disable_model_redirect() {
        this.model_redirect = false;
    }
    enable_model_redirect() {
        this.model_redirect = true;
    }
    is_model_redirect_enabled() {
        return this.model_redirect;
    }

    toggle( component, model_name, primary_key, primary_key_value, toggled_column_name ): Observable<any> {
        const request = {
            action: component,
            do: 'toggle',
            model_name: model_name,
            primary_key: primary_key,
            primary_key_value: primary_key_value,
            toggled_column_name: toggled_column_name,
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, request);
    }

    OnDestroy() {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
