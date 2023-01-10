import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ModelService} from '../../_services/model.service';
import {SnackService} from '../../_services/snack.service';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '../../../@fuse/animations';
import {FuseNavigationService} from '../../../@fuse/components/navigation/navigation.service';
import {AuthenticationService} from '../../_services';
import { FormConstructorComponent} from '../../main/grid/form/form-constructor.component';
import {FilterService} from '../../_services/filter.service';
import {Bitrix24Service} from '../../integrations/bitrix24/bitrix24.service';
import {MatDialog} from '@angular/material/dialog';
import {SitebillEntity} from '../../_models';
import {StorageService} from '../../_services/storage.service';
import {GetApiUrlService} from '../../_services/get-api-url.service';

@Component({
    selector: 'register-modal',
    // templateUrl: '../../main/grid/form/selection-form.component.html',
    templateUrl: './register-modal.component.html',
    styleUrls: ['./register-modal.component.scss'],
    animations: fuseAnimations
})
export class RegisterModalComponent extends FormConstructorComponent implements OnInit {
    registerFormErrors: any;
    registerMessage: string;

    valid_domain_through_email: UntypedFormGroup;
    loading = false;
    show_register: boolean;
    show_login: boolean;

    constructor(
        public modelService: ModelService,
        protected getApiUrlService: GetApiUrlService,
        protected _snackService: SnackService,
        private authenticationService: AuthenticationService,
        protected _formBuilder: UntypedFormBuilder,
        protected _fuseNavigationService: FuseNavigationService,
        protected filterService: FilterService,
        protected bitrix24Service: Bitrix24Service,
        public _matDialog: MatDialog,
        protected cdr: ChangeDetectorRef,
        protected storageService: StorageService
    ) {
        super(
            modelService,
            getApiUrlService,
            _formBuilder,
            _snackService,
            filterService,
            bitrix24Service,
            _matDialog,
            cdr,
            storageService
        );

        this.valid_domain_through_email = this._formBuilder.group({
            domain_checker: ['', [Validators.required, Validators.email]],
        });
        this.show_login = true;
        this.init_register_form();

    }

    init_register_form(): void {
        // Set the defaults
        this.registerFormErrors = {
            domain: {},
            username: {},
            password: {},
            password_retype: {},
            agree: {},
        };
        this.form = this._formBuilder.group({
            domain: [''],
            agree: ['', Validators.required],
            username: ['', [Validators.required]],
            password: ['', Validators.required],
            password_retype: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this._data = new SitebillEntity();
        this._data.set_app_name('user');
        this._data.set_table_name('user');
        this._data.set_key_value('user_id');


        this._data.set_readonly(false);

        // Получить модель юзера
        // if ( this.modelService.get_nobody_mode() ) {
        this.get_user_model();
        // }
    }

    get_user_model(): void {
        // console.log('get_user_model');
        this.modelService.load_only_model('user', true)
            .subscribe((result: any) => {
                if (result) {
                    const columns = this.cleanup_columns(result.data.user, result.columns);
                    // const columns = result.data.user;
                    this.records = columns;
                    this.tabs = result.tabs;
                    this.tabs_keys = Object.keys(result.tabs);
                    this.rows = Object.keys(columns);
                    // console.log(this.records);
                    // console.log(this.rows);
                    // console.log(this.tabs);
                    this.init_form();
                    // console.log(this.form);
                }
            });
    }

    cleanup_columns( columns, columns_index ): any[] {
        // console.log(columns_index);
        // console.log(columns);
        const result = [];
        for (const i in columns_index.length) {
            if ( columns[columns_index[i].name].required === 'on' && columns[columns_index[i].name].name !== 'email' && columns[columns_index[i].name].name !== 'login' ) {
                // console.log(columns[columns_index[i].name]);
                result[columns_index[i].name] = columns[columns_index[i].name];
                //  console.log(columns_index[i].name);
                //  console.log(this.additional_params_index);
            }
        }
        return result;
    }
    register(): void {
        this.loading = true;
        this.hide_register_complete();

        const additional_params = this.get_ql_items_from_form();

        this.authenticationService.register(this.form.value.username, this.form.value.password, this.form.value.password_retype, additional_params)
            .subscribe(
                (data: any) => {
                    this.loading = false;
                    // console.log(data);
                    if (data.result === '0') {
                        this._snackService.message(data.msg);
                    } else {
                        let register_complete_message = 'Регистрация успешна!';
                        this._snackService.message(register_complete_message);
                        if ( data.msg !== '' ) {
                            register_complete_message = data.msg;
                        }
                        this.show_register_complete(register_complete_message);
                    }
                },
                error => {
                    this._snackService.message('Ошибка подключения к сайту');
                    this.loading = false;
                });
    }

    show_register_complete(message: string): void {
        this.show_login = false;
        this.show_register = false;
        this.registerMessage = message;
        this.form.controls['username'].patchValue('');
        this.form.controls['password'].patchValue('');
        this.form.controls['password_retype'].patchValue('');
        this.form.controls['agree'].patchValue(false);
    }


    hide_register_complete(): void {
        this.registerMessage = null;
    }


}
