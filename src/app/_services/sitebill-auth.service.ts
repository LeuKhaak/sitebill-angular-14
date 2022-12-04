import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ModelService} from './model.service';
import {timer} from "rxjs";

@Injectable()
export class SitebillAuthService {
    @Output() complete_emitter: EventEmitter<any> = new EventEmitter();
    @Output() init_user_from_cms_emitter: EventEmitter<any> = new EventEmitter();
    @Output() init_nobody_user_emitter: EventEmitter<any> = new EventEmitter();


    private state: string = 'zero';

    /**
     * Constructor
     */
    constructor(
        private http: HttpClient,
        private modelService: ModelService,
    )
    {
        // console.log('SitebillAuthService constructor');
    }

    init () {
        if ( this.state == 'ready' || this.state == 'auth_failed' ) {
            console.log('SitebillAuthService.init, already inited');
            return false;
        }
        // console.log('SitebillAuthService.init, domain: ' + this.modelService.get_api_url());
        this.modelService.init_config_standalone();
        this.modelService.config_loaded_emitter.subscribe(
            (result: any) => {
                if ( result ) {
                    this.init_user();
                }
            },
            error => {
                // console.log('error this.modelService.config_loaded_emitter.subscribe');
                // console.log(error);
                this.auth_failed();
            },
            complete => {
                // console.log('this.modelService.config_loaded_emitter.subscribe complete')
                this.auth_failed();
            }
        );
    }
    auth_failed () {
        this.complete_emitter.emit(false);
        this.state = 'auth_failed';
    }

    init_user () {
        // console.log('session_key = ' + this.modelService.get_session_key());

        if (
            this.modelService.get_session_key() === 'nobody' &&
            this.modelService.getConfigValue('apps.realty.enable_guest_mode') === '1'
        ) {
            this.init_user_from_cms();
        } else if (
            this.modelService.get_session_key()
        ) {
            this.init_valid_user();
        } else {
            this.init_user_from_cms();
        }
    }

    init_user_from_cms () {
        // console.log('try init user from CMS session');
        this.init_user_from_cms_emitter.subscribe(
            (result: any) => {
                if ( result ) {
                    // console.log('this.init_user_from_cms_emitter.subscribe result = true');
                    this.init_permissions();
                } else {
                    // console.log('this.init_user_from_cms_emitter.subscribe result = false');
                    this.init_nobody_user();
                }
            },
            error => {
                // console.log('error this.init_user_from_cms_emitter.subscribe');
                // console.log(error);
                this.auth_failed();
            },
            complete => {
                // console.log('this.init_user_from_cms_emitter.subscribe complete');
                this.auth_failed();
            }
        );


        this.modelService.get_cms_session().subscribe((result: any) => {
            // console.log(result);
            try {
                const storage = JSON.parse(result) || [];
                if (storage.user_id > 0) {
                    // console.log('success cms user_id = ' + storage.user_id);
                    this.modelService.reinit_currentUser_standalone(storage);
                    this.init_user_from_cms_emitter.emit(true);
                    //return true;
                } else {
                    this.init_user_from_cms_emitter.emit(false);
                }
            } catch (e) {
                this.init_user_from_cms_emitter.emit(false);
            }
        });
    }

    init_nobody_user () {
        // console.log('try init nobody user');
        // console.log('apps.realty.enable_guest_mode ' + this.modelService.getConfigValue('apps.realty.enable_guest_mode'));

        this.init_nobody_user_emitter.subscribe(
            (result: any) => {
                if ( result ) {
                    // console.log('this.init_nobody_user.subscribe result = true');
                    this.init_complete();
                } else {
                    // console.log('this.init_nobody_user.subscribe result = false');
                    this.auth_failed();
                }
            },
            error => {
                // console.log('error this.init_nobody_user.subscribe');
                // console.log(error);
                this.auth_failed();
            },
            complete => {
                // console.log('this.init_nobody_user.subscribe complete');
                this.auth_failed();
            }
        );


        if ( this.modelService.getConfigValue('apps.realty.enable_guest_mode') === '1' ) {
            this.modelService.reset_local_user_storage();

            this.modelService.init_nobody_session().subscribe((result: any) => {
                if ( result.error === 'check_session_key_failed' ) {
                    this.modelService.reset_local_user_storage();
                    this.init_nobody_user_emitter.emit(false);
                } else {
                    this.modelService.reinit_currentUser_standalone(result);
                    this.modelService.enable_nobody_mode();
                    this.init_nobody_user_emitter.emit(true);
                }
            });
        } else {
            // console.log('apps.realty.enable_guest_mode not enabled');
            this.modelService.reset_local_user_storage();
            this.init_nobody_user_emitter.emit(false);
        }
    }

    init_valid_user () {
        // console.log('try init valid user');
        this.check_session_key_safe();
        this.modelService.valid_user_emitter.subscribe(
            (result: any) => {
                if ( result ) {
                    // console.log('sitebillAuthServices.init_user result = true');
                    this.init_permissions();
                } else {
                    // console.log('sitebillAuthServices.init_user result = false');
                    this.init_user_from_cms();
                }
            },
            error => {
                // console.log('error sitebillAuthServices.init_user');
                // console.log(error);
                this.auth_failed();
            },
            complete => {
                // console.log('sitebillAuthServices.init_user complete');
                this.auth_failed();

            }
        );
    }

    init_permissions () {
        this.modelService.init_permissions_complete_emitter.subscribe(
            (result: any) => {
                if ( result ) {
                    // console.log('sitebillAuthServices.init_permissions result = true');
                    this.init_complete();
                }
            },
            error => {
                // console.log('error sitebillAuthServices.init_permissions');
                // console.log(error);
                this.auth_failed();
            },
            complete => {
                // console.log('sitebillAuthServices.init_permissions complete');
                this.auth_failed();
            }
        );

        this.modelService.init_permissions();

    }

    check_session_key_safe() {
        const session_key = this.modelService.get_session_key();
        if (!this.modelService.is_validated_session_key()) {
            this.modelService.validateKey(session_key).subscribe((result: any) => {
                if (result.error === 'check_session_key_failed') {
                    // console.log('check_session_key_failed need reload');
                    this.init_user_from_cms();
                } else {
                    this.modelService.session_key_validate();
                }
            });
        }
    }


    init_complete () {
        this.complete_emitter.emit(true);
        this.state = 'ready';
    }

    complete () {
        return this.complete_emitter;
    }

    get_state () {
        return this.state;
    }
}
