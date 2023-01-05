import {Component, ElementRef, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {ModelService} from '../../_services/model.service';
import {GetApiUrlService} from '../../_services/get-api-url.service';
import {GetSessionKeyService} from '../../_services/get-session-key.service';
import {ConfigSystemService} from '../../_services/config-system.service';
import {SnackService} from '../../_services/snack.service';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '../../../@fuse/animations';
import {FuseNavigationService} from '../../../@fuse/components/navigation/navigation.service';
import {AlertService, AuthenticationService} from '../../_services';
import {HttpClient} from '@angular/common/http';
import {DOCUMENT} from '@angular/common';
import {FuseConfigService} from '../../../@fuse/services/config.service';
import {APP_CONFIG, AppConfig} from '../../app.config.module';
import {FuseTranslationLoaderService} from '../../../@fuse/services/translation-loader.service';
import {locale as english} from './i18n/en';
import {locale as russian} from './i18n/ru';
import {navigation} from '../../navigation/navigation';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';

export interface Progress {
    progress: string;
    message: string;
}

@Component({
    selector: 'register-domain-modal',
    // templateUrl: '../../main/grid/form/selection-form.component.html',
    templateUrl: './register-domain-modal.component.html',
    styleUrls: ['./register-domain-modal.component.scss'],
    animations: fuseAnimations
})
export class RegisterDomainModalComponent implements OnInit
{
    loginForm: UntypedFormGroup;
    loginFormErrors: any;
    valid_domain_through_email: UntypedFormGroup;
    loading = false;
    register_success = false;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    public source: any;
    progress: any;
    private domain: any;
    wait_message: any;
    progress_mode: any;

    @Output() close = new EventEmitter(); // !!! should not be named or renamed as a native event (no-output-native)

    /**
     * Constructor
     *
     */
    constructor(
        private http: HttpClient,
        private elRef: ElementRef,
        private modelService: ModelService,
        protected getApiUrlService: GetApiUrlService,
        protected getSessionKeyService: GetSessionKeyService,
        protected configSystemService: ConfigSystemService,
        private _formBuilder: UntypedFormBuilder,
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        @Inject(APP_CONFIG) private config: AppConfig,
        public snackBar: MatSnackBar,
        private authenticationService: AuthenticationService,
        protected _fuseNavigationService: FuseNavigationService,
        protected _snackService: SnackService,
        private alertService: AlertService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
        this.progress = 0;
        this.progress_mode = 'determinate';

        // Set the defaults
        this.loginFormErrors = {
            name: {},
            email: {},
            password: {}
        };

    }
    ngOnInit(): void {
        this.init_input_parameters();
        this.loginForm = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
        this.valid_domain_through_email = this._formBuilder.group({
            domain_checker: ['', [Validators.required, Validators.email]],
        });
    }

    whmcs_create(fullname, lastname, email, password): any { // any ???
        const request = { action: 'addclient', fullname: fullname, lastname: '', email: email, password: password, source: this.source };
        // console.log(request);
        // return this.http.post(`https://www.sitebill.ru/whmcs_cpanel1_dump.php`, request);
        return this.http.post(`https://www.sitebill.ru/whmcs_cpanel1.php`, request);
    }

    get_progress(domain_name): any { // any ???
        return this.http.get('https://api.sitebill.ru/progress/' + domain_name + '.php');
    }



    register(): void {
        this.loading = true;
        this.modelService.set_install_mode(true);
        this.whmcs_create(this.loginForm.value.name, '', this.loginForm.value.email, this.loginForm.value.password)
            .subscribe(
                (data: any) => {
                    this.loading = false;
                    // console.log(data);
                    if ( data.RESULT === 'error' ) {
                        this.modelService.set_install_mode(false);
                        this.snackBar.open(data.MESSAGE, 'ok', {
                            duration: 2000,
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                        });
                    } else {
                        this.register_success = true;
                        this.modelService.set_install_mode(true);
                        this.progress_mode = 'determinate';
                        this.wait_message = 'Пожалуйста, подождите ... ';
                        this.show_progress(data.domain);
                    }
                }
            );
    }

    show_progress( domain = null ): void {
        // console.log('progress');
        // domain = 'api.sitebill.ru';
        if ( domain !== null ) {
            this.domain = domain;
        }

        const refreshIntervalId = setInterval(() => {
            this.get_progress(this.domain).subscribe( (data: Progress) => {
                // console.log(data);
                if ( data.progress !== null ) {
                    this.progress_mode = 'determinate';
                    this.progress = data.progress;
                }
                if ( parseInt(data.progress, 10) >= 100 ) {
                    clearInterval(refreshIntervalId);
                    this.run_autologin(domain, this.loginForm.value.email, this.loginForm.value.password);
                }
            });

        }, 1000);

    }


    init_input_parameters(): void {
        let app_root_element;
        if (this.document.getElementById('angular_search')) {
            app_root_element = this.document.getElementById('angular_search');
        } else if (this.document.getElementById('angular_search_ankonsul')) {
            app_root_element = this.document.getElementById('angular_search_ankonsul');
        } else if (this.document.getElementById('app_root')) {
            app_root_element = this.document.getElementById('app_root');
        }

        if (app_root_element.getAttribute('source') !== undefined ) {
            this.source = app_root_element.getAttribute('source');
        } else {
            this.source = 'native';
        }
    }

    show_login_form(): void {
    }

    private run_autologin(domain, login, password): void {
        this.wait_message = 'Готово';
        console.log('run autologin');

        this.getApiUrlService.set_api_url('https://' + domain);
        this.progress_mode = 'indeterminate';


        const refreshIntervalId = setInterval(() => {
            this.authenticationService.login(domain, login, password)
                .subscribe(
                    (data: any) => {
                        clearInterval(refreshIntervalId);

                        if (data.state === 'error') {
                            this.loading = false;
                            this._snackService.message('Логин или пароль указаны неверно');
                        } else {
                            if (data.admin_panel_login === 1) {

                                this._fuseNavigationService.unregister('main');
                                this._fuseNavigationService.register('main', navigation);
                                this._fuseNavigationService.setCurrentNavigation('main');
                                this.after_success_login();
                            } else if (data.success === 1) {
                                this.after_success_login();
                            } else {
                                const error = 'Доступ запрещен';
                                this.alertService.error(error);
                                this.loading = false;
                                this.snackBar.open(error, 'ok', {
                                    duration: 2000,
                                    horizontalPosition: this.horizontalPosition,
                                    verticalPosition: this.verticalPosition,
                                });
                            }
                        }
                    },
                    error => {
                        this._snackService.message('Ошибка подключения к сайту');
                        this.loading = false;
                    });
        }, 5000);
    }

    after_success_login(): void {
        this._snackService.message('Авторизация успешна!');
        this.getSessionKeyService.disable_nobody_mode();
        this.getSessionKeyService.load_current_user_profile();
        this.configSystemService.init_config();
        this.modelService.set_install_mode(false);
        this.close.emit();
        // this.dialogRef.close();
    }

}
