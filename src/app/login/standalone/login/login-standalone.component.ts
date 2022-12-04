import {Component, Inject, OnInit} from '@angular/core';
import {FormComponent} from '../../../main/grid/form/form.component';
import {ModelService} from '../../../_services/model.service';
import {SnackService} from '../../../_services/snack.service';
import {APP_CONFIG, AppConfig} from '../../../app.config.module';
import {SitebillEntity} from '../../../_models';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '../../../../@fuse/animations';
import {DOCUMENT} from '@angular/common';
import {toASCII} from "punycode";
import {navigation} from '../../../navigation/navigation';
import {FuseNavigationService} from '../../../../@fuse/components/navigation/navigation.service';
import {AlertService, AuthenticationService} from '../../../_services';
import {FilterService} from '../../../_services/filter.service';
import {FuseConfigService} from '../../../../@fuse/services/config.service';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'login-standalone',
    templateUrl: './login-standalone.component.html',
    styleUrls: ['./login-standalone.component.scss'],
    animations: fuseAnimations
})
export class LoginStandaloneComponent  implements OnInit {
    loginForm: FormGroup;
    loginFormErrors: any;

    registerForm: FormGroup;
    registerFormErrors: any;
    registerMessage: string;

    valid_domain_through_email: FormGroup;
    hide_domain: boolean = true;
    loading = false;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    allow_register: true;
    show_register: boolean;
    show_login: boolean;
    show_remind: boolean;
    public show_register_domain: boolean;
    auth_title: any;



    constructor(
        public modelService: ModelService,
        protected _snackService: SnackService,
        public _matDialog: MatDialog,
        private authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _fuseConfigService: FuseConfigService,
        private alertService: AlertService,
        public snackBar: MatSnackBar,
        private filterService: FilterService,
        protected _fuseNavigationService: FuseNavigationService,
        @Inject(APP_CONFIG) protected config: AppConfig,
        @Inject(DOCUMENT) private document: any,
    ) {
        // Set the defaults
        this.loginFormErrors = {
            domain: {},
            username: {},
            password: {}
        };
        this.loginForm = this._formBuilder.group({
            domain: [''],
            username: ['', [Validators.required]],
            password: ['', Validators.required]
        });
        this.valid_domain_through_email = this._formBuilder.group({
            domain_checker: ['', [Validators.required, Validators.email]],
        });
        this.auth_title = 'Авторизация';
        this.show_login = true;
        this.init_register_form();

    }

    init_register_form () {
        // Set the defaults
        this.registerFormErrors = {
            domain: {},
            username: {},
            password: {},
            password_retype: {},
            agree: {},
        };
        this.registerForm = this._formBuilder.group({
            domain: [''],
            agree: ['', Validators.required],
            username: ['', [Validators.required]],
            password: ['', Validators.required],
            password_retype: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.init_input_parameters();

    }

    convert_to_https_domain(data:string) {
        let hostname;
        if ( data.match(/http/i) ) {
            let a = this.document.createElement('a');
            a.href = data;
            hostname =  'https://' + a.hostname;
        } else {
            hostname =  'https://' + data;
        }

        return hostname;
    }


    login() {
        this.loading = true;


        if (this.loginForm.value.domain != '' && this.loginForm.value.domain != null) {
            let domain = toASCII(this.loginForm.value.domain);
            let https_replace = 'https://';
            let http_replace = 'http://';
            domain = domain.replace(https_replace, '');
            domain = domain.replace(http_replace, '');

            if (!/\./.test(domain)) {
                this._snackService.message('Сайт указан неверно');
                this.loading = false;
                return false;
            }
            this.valid_domain_through_email.controls['domain_checker'].patchValue('test@'+domain);
            this.valid_domain_through_email.controls['domain_checker'].updateValueAndValidity();
            if (!this.valid_domain_through_email.controls['domain_checker'].valid) {
                this._snackService.message('Сайт указан неверно');
                this.loading = false;
                return false;
            }

            this.modelService.set_api_url(this.convert_to_https_domain(domain));
        } else {
            this.modelService.set_api_url('');
        }

        //console.log(this.loginForm.value.domain);
        //return;


        this.authenticationService.login(this.loginForm.value.domain, this.loginForm.value.username, this.loginForm.value.password)
            .subscribe(
                (data: any) => {
                    if (data.state == 'error') {
                        //this.alertService.error(data.error);
                        this.loading = false;
                        this._snackService.message('Логин или пароль указаны неверно');
                    } else {
                        if (data.admin_panel_login == 1) {

                            this._fuseNavigationService.unregister('main');
                            this._fuseNavigationService.register('main', navigation);
                            this._fuseNavigationService.setCurrentNavigation('main');
                            this.after_success_login();
                        } else if (data.success == 1) {
                            this.after_success_login();
                        } else {
                            let error = 'Доступ запрещен!';
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
    }

    after_success_login () {
        this._snackService.message('Авторизация успешна!');
        this.modelService.disable_nobody_mode();
        this.modelService.load_current_user_profile();
        this.modelService.init_config();
        this._fuseConfigService.broadcast_refresh();
        window.parent.location.reload();
    }

    close_register_domain () {
    }


    init_input_parameters() {
        let app_root_element;
        if (this.document.getElementById('angular_search')) {
            app_root_element = this.document.getElementById('angular_search');
        } else if (this.document.getElementById('angular_search_ankonsul')) {
            app_root_element = this.document.getElementById('angular_search_ankonsul');
        } else if (this.document.getElementById('app_root')) {
            app_root_element = this.document.getElementById('app_root');
        }
        if (app_root_element.getAttribute('enable_domain_auth')) {
            if (app_root_element.getAttribute('enable_domain_auth') === 'true' ) {
                this.loginForm.controls['domain'].setValidators([Validators.required]);
                this.hide_domain = false;
            }
        }

    }

    show_login_form() {
        this.auth_title = 'Авторизация';
        this.show_login = true;
        this.show_register = false;
        this.show_remind = false;
        this.show_register_domain = false;
        this.hide_register_complete();
    }

    show_register_form() {
        this.auth_title = 'Регистрация';
        this.show_login = false;
        this.show_register = true;
        this.show_remind = false;
        this.show_register_domain = false;
        this.hide_register_complete();
    }

    hide_register_complete () {
        this.registerMessage = null;
    }

    show_remind_form() {
        this.auth_title = 'Напомнить пароль';
        this.show_login = false;
        this.show_register = false;
        this.show_register_domain = false;
        this.show_remind = true;
    }

    show_register_domain_form() {
        this.auth_title = 'Создать новый сайт';
        this.show_login = false;
        this.show_register = false;
        this.show_register_domain = true;
        this.show_remind = false;
        this.hide_register_complete();
    }

    close() {
    }
}
