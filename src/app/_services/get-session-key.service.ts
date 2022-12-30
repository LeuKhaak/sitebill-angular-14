import {EventEmitter, Injectable, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {takeUntil} from 'rxjs/operators';
import {currentUser, UserProfile} from 'app/_models/currentuser';
import {Subject, timer} from 'rxjs';
import {Router} from '@angular/router';
import {StorageService} from './storage.service';
import {FuseConfigService} from '../../@fuse/services/config.service';
import {ConfigService} from './config.service';
import {SnackService} from './snack.service';
import {GetApiUrlService} from './get-api-url.service';
import {UiService} from './ui.service';
import {ModelRedirectService} from './model-redirect.service';

@Injectable()
export class GetSessionKeyService {
    protected currentUser: currentUser;
    private sessionKeyValidated = false;
    protected _unsubscribeAll: Subject<any>;
    private modelRedirect = true;
    private needReload = false;
    private nobodyMode = false;
    private currentUserProfile: UserProfile;
    private nobodyFirstLogin = false;
    private sitebillConfig: any;

    @Output() needReloadEmitter: EventEmitter<any> = new EventEmitter();
    @Output() validUserEmitter: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: HttpClient,
        private router: Router,
        public storageService: StorageService,
        protected _snackService: SnackService,
        protected getApiUrlService: GetApiUrlService,
        protected uiService: UiService,
        protected configService: ConfigService,
        protected _fuseConfigService: FuseConfigService,
        protected modelRedirectService: ModelRedirectService,
    ) {
        this._unsubscribeAll = new Subject();
        this.currentUser = JSON.parse(this.storageService.getItem('currentUser')) || [];
        this.sitebillConfig = {};
        this.currentUserProfile = new UserProfile();
    }

    get_session_key_safe(): string {
        const sessionKey = this.get_session_key();
        if (!this.is_validated_session_key()) {
            this.validateKey(sessionKey)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if (result.error === 'check_session_key_failed') {
                        console.log('check_session_key_failed need reload');
                        if ( this.modelRedirectService.is_model_redirect_enabled() ) {
                            console.log('reset storage');
                            this.reset_local_user_storage();
                            const refreshUrl = this.router.url;
                            this.enable_need_reload('get_session_key_safe');
                            this.router.navigate([refreshUrl]);
                        }
                        if ( this.configService.getDomConfigValue('standalone_mode' ) ) {
                            this.reset_local_user_storage();
                            this.needReloadEmitter.emit(true);
                        }
                    } else {
                        this.session_key_validate();
                    }
                });
        }
        if (sessionKey == null) {
            if ( this.modelRedirectService.is_model_redirect_enabled() ) {
                this.logout();
            }
        }
        return sessionKey;
    }

    get_session_key(): string {
        try {
            if (this.getApiUrlService.get_current_entity().get_app_session_key() != null) {
                return this.getApiUrlService.get_current_entity().get_app_session_key();
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
        console.log(this.currentUser.session_key);
        return this.currentUser.session_key;
    }

    is_validated_session_key(): boolean {
        // console.log('is_validated_session_key');
        return this.sessionKeyValidated;
    }

    validateKey(sessionKey): any { // any ???
        const modelName = 'data';
        const primaryKey = 'id';
        const keyValue = 1;
        const loadDataRequest = {action: 'model', do: 'load_data', model_name: modelName, primary_key: primaryKey, key_value: keyValue, session_key: sessionKey};
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, loadDataRequest);
    }

    reset_local_user_storage(): void {
        // console.log('reset_local_user_storage');
        localStorage.removeItem('currentUser');
        if (this.currentUser != null) {
            this.currentUser.session_key = null;
            this.currentUser = null;
        }
    }

    enable_need_reload( from = ''): void {
        if ( from !== '' ) {
            // console.log('enable_need_reload from ' + from);
        }
        // console.log('enable_need_reload');
        this.needReload = true;
    }

    session_key_validate(): void {
        if ( !this.sessionKeyValidated ) {
            // console.log('session_key_validate');
            this.load_current_user_profile();
        }
        this.sessionKeyValidated = true;
    }

    get_oauth_user_profile(): any { // any ???
        const loadDataRequest = {
            action: 'oauth',
            do: 'load_my_profile',
            session_key: this.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, loadDataRequest);
    }

    load_current_user_profile(): void {
        this.get_oauth_user_profile()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result.state === 'success') {
                    if (result.data && result.data.group_id !== null) {
                        this.currentUserProfile.group_id.value = result.data.group_id.value;
                        this.currentUserProfile.group_id.value_string = result.data.group_id.value_string;
                    }
                    if ( result.data.user_id != null ) {
                        this.currentUserProfile.user_id.value = result.data.user_id.value;
                        this.currentUserProfile.user_id.value_string = result.data.user_id.value_string;
                    }
                    if ( result.data.fio != null ) {
                        this.currentUserProfile.fio.value = result.data.fio.value;
                    }
                    if (result.data.email != null) {
                        this.currentUserProfile.email.value = result.data.email.value;
                    }
                    if ( result.data.imgfile != null ) {
                        this.currentUserProfile.imgfile.value = result.data.imgfile.value;
                    }
                    this.validUserEmitter.emit(true);
                } else {
                    console.log('get_oauth_user_profile failed');
                    this.validUserEmitter.emit(false);
                }
            });
    }

    get_nobody_mode(): boolean {
        return this.nobodyMode;
    }

    enable_nobody_mode(): void {
        this.sessionKeyValidated = true;
        this.nobodyMode = true;
    }
    disable_nobody_mode(): void {
        this.nobodyMode = false;
    }

    get_user_id(): number {
        if (this.currentUser == null) {
            return null;
        }
        return this.currentUser.user_id;
    }

    all_checks_passes(): boolean {
        if ( this.get_nobody_mode() || this.get_user_id() > 0 ) {
            console.log('all_checks_passes success');
            return true;
        }
        return false;
    }

    disable_session_key_validity(): void {
        this.sessionKeyValidated = false;
    }

    model_logout(): any { // any ???
        this.currentUser = JSON.parse(this.storageService.getItem('currentUser')) || [];

        const body = {action: 'oauth', do: 'logout', session_key: this.currentUser.session_key};
        const url = `${this.getApiUrlService.get_api_url()}/apps/api/rest.php`;

        this.uiService.disable_menu();
        this.reset_local_user_storage();
        this.disable_session_key_validity();
        this.currentUserProfile = new UserProfile();

        return this.http.post<any>(url, body);
    }

    logout(): void {
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

    get_cms_session(): any { // any ???
        let body = {};
        body = {layer: 'native_ajax', get_cms_session: '1'};
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    disable_need_reload(): void {
        // console.log('disable_need_reload');
        this.needReload = false;
        this.session_key_validate();
    }

    reinit_currentUser(): void {
        this.currentUser = JSON.parse(this.storageService.getItem('currentUser')) || [];
        this.disable_need_reload();
        // console.log('reinit current user');
        // console.log(this.storageService.getItem('currentUser'));
        // console.log(this.currentUser);
        // console.log('reinit complete');
    }

    enable_guest_mode(): void {
        console.log('apps.realty.enable_guest_mode ' + this.configService.getConfigValue('apps.realty.enable_guest_mode'));
        if ( this.configService.getConfigValue('apps.realty.enable_guest_mode') === '1') {
            if ( this.get_user_id() === null || this.get_user_id() === 0 || this.get_user_id() === undefined ) {
                this.get_cms_session()
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((result: any) => {
                        console.log(result);
                        let finalyNeedGuest = false;
                        try {
                            const storage = JSON.parse(result) || [];
                            if (storage.user_id > 0) {
                                console.log('cms user_id = ' + storage.user_id);
                                this.storageService.setItem('currentUser', JSON.stringify(storage));
                                this.reinit_currentUser();
                                this.configService.after_config_loaded();
                                return true;
                            } else {
                                finalyNeedGuest = true;
                            }
                        } catch (e) {
                            finalyNeedGuest = true;
                        }
                        if (finalyNeedGuest) {
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
            if ( !this.nobodyFirstLogin ) {
                this._snackService.message('Для работы с разделом вы должны авторизоваться.');
                const timerPeriod = 1000;
                const numbers = timer(timerPeriod);
                numbers
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(x => this.router.navigate(['/login/']));
                this.nobodyFirstLogin = true;
            }
        }
    }

    init_nobody_session(): any { // any ???
        let body = {};
        body = { action: 'init_nobody_session', session_key: 'nobody'};
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    init_nobody_user_storage(): void {
        this.reset_local_user_storage();

        this.init_nobody_session()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if ( result.error === 'check_session_key_failed' ) {
                    this.reset_local_user_storage();
                    const refreshUrl = this.router.url;
                    this.enable_need_reload('init_nobody_user_storage');
                    this.router.navigate([refreshUrl]);
                } else {
                    this.currentUser = result;
                    this.storageService.setItem('currentUser', JSON.stringify(this.currentUser));
                    this.enable_nobody_mode();
                }
            });
    }

    OnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
