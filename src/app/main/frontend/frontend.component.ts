import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FuseConfigService} from '@fuse/services/config.service';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';
import {fuseAnimations} from '../../../@fuse/animations';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {LoginModalComponent} from '../../login/modal/login-modal.component';

@Component({
    selector   : 'frontend',
    templateUrl: './frontend.component.html',
    styleUrls  : ['./frontend.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class FrontendComponent
{
    loading = false;

    /**
     * Constructor
     *
     */
    constructor(
        public modelService: ModelService,
        private _fuseConfigService: FuseConfigService,
        protected router: Router,
        protected dialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: false
                },
                footer: {
                    hidden: true
                }
            }
        };
    }
    ngOnInit() {
        this.modelService.sitebill_loaded_complete_emitter.subscribe((result: any) => {
            if ( this.modelService.getDomConfigValue('standalone_mode') ) {
                // console.log('standalone');
                this.router.navigate(['/standalone']);
            } else {
                // console.log('run frontend');
                // console.log('standalone_mode = ' + this.modelService.getDomConfigValue('standalone_mode'));
                if ( !this.modelService.is_logged_in() ) {
                    // console.log('frontend login model (after localstorage!)');
                    this.login_modal();
                }
            }
        });
        // this.modelService.get_session_key_safe();
        // console.log(this.modelService.getConfigValue('default_frontend_route'));
    }

    login_modal() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.panelClass = 'login-form';

        this.dialog.open(LoginModalComponent, dialogConfig);
    }
}
