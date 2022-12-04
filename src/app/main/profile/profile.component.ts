import {Component, ElementRef, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FuseConfigService} from '@fuse/services/config.service';
import {DOCUMENT} from '@angular/common';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FilterService} from '../../_services/filter.service';
import {BillingService} from '../../_services/billing.service';
import {SitebillEntity} from '../../_models';

@Component({
    selector   : 'profile',
    templateUrl: './profile.component.html',
    styleUrls  : ['./profile.component.scss']
})
export class ProfileComponent
{
    entity: SitebillEntity;
    edit_mode: boolean;

    /**
     * Constructor
     *
     */
    constructor(
        private _httpClient: HttpClient,
        private elRef: ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private modelSerivce: ModelService,
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private billingSerivce: BillingService,
        @Inject(APP_CONFIG) private config: AppConfig,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: false
                },
                toolbar: {
                    hidden: false
                },
                footer: {
                    hidden: true
                }
            }
        };
        this.entity = new SitebillEntity();
        this.entity.set_app_name('profile');
        this.entity.set_table_name('user');
        this.entity.primary_key = 'user_id';
        this.entity.set_key_value(this.modelSerivce.get_user_id());

    }

    ngOnInit() {
        this.edit_mode = false;
    }

    edit() {
        this.edit_mode = true;
    }
    close_edit() {
        this.modelSerivce.load_current_user_profile();
        this.edit_mode = false;
    }
}
