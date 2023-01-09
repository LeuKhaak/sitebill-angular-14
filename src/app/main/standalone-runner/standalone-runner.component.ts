import {Component, OnInit} from '@angular/core';
import {FuseConfigService} from '@fuse/services/config.service';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';
import {fuseAnimations} from '../../../@fuse/animations';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SitebillAuthService} from '../../_services/sitebill-auth.service';
import {LoginModalComponent} from '../../login/modal/login-modal.component';
import {ConfigModalComponent} from '../config/modal/config-modal.component';
import {ConfigService} from '../../_services/config.service';
import {GetSessionKeyService} from '../../_services/get-session-key.service';

@Component({
    selector   : 'standalone-runner',
    templateUrl: './standalone-runner.component.html',
    styleUrls  : ['./standalone-runner.component.scss'],
    animations: fuseAnimations
})
export class StandaloneRunnerComponent implements OnInit
{
    loading = false;
    config_loaded = false;
    access_denied_state = false;
    redirected_components = ['apps-data'];

    /**
     * Constructor
     *
     */
    constructor(
        public modelService: ModelService,
        public configService: ConfigService,
        protected getSessionKeyService: GetSessionKeyService,
        public sitebillAuthService: SitebillAuthService,
        private _fuseConfigService: FuseConfigService,
        protected router: Router,
        protected dialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
    }

    run(): void {
        console.log('ready for standalone components');
        console.log(' - - - - - ');
        // Сначала проверим, нужно ли нам перекидывать на загружаемый модуль
        if ( this.redirected_components.includes(this.configService.getDomConfigValue('component')) ) {
            this.router.navigate([this.configService.getDomConfigValue('component')]);
        } else {
            // Или просто запускаем готовую упаковку (без lazyload)
            this.config_loaded = true;
        }
        this.run_component_modal();
    }

    access_denied(): void {
        console.log('access denied');
        this.access_denied_state = true;
    }

    ngOnInit(): void {
        console.log('run standalone ...');
        
        this.sitebillAuthService.complete_emitter.subscribe(
            (result: any) => {
                if ( result ) {
                    console.log('sitebillAuthService.complete() result = true');
                    console.log('user_id = ' + this.getSessionKeyService.get_user_id());
                    this.run();
                } else {
                    console.log('sitebillAuthService.complete() result = false');
                    this.access_denied();
                }
            },
            error => {
                console.log('error');
                console.log(error);
                this.access_denied();
            },
            complete => {
                console.log('sitebillAuthService.complete() complete');
                this.access_denied();
            }
        );

        console.log('run sitebillAuthService.init()');
        this.sitebillAuthService.init();
        console.log('after sitebillAuthService.init()');
        if ( this.sitebillAuthService.get_state() === 'ready' ) {
            console.log('sitebillAuthService has ready state');
            this.run();
        }
    }

    run_component_modal(): void {
        if ( this.configService.getDomConfigValue('component') === 'light_config' ) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.disableClose = true;
            dialogConfig.width = '100vw';
            dialogConfig.maxWidth = '100vw';
            dialogConfig.height = '100vh';

            // dialogConfig.panelClass = 'login-form';

            this.dialog.open(ConfigModalComponent, dialogConfig);
        }
    }

    login_modal(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.panelClass = 'login-form';

        this.dialog.open(LoginModalComponent, dialogConfig);
    }

    logout(): void {
        this.getSessionKeyService.logout();
    }
}
