import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FuseConfigService} from '@fuse/services/config.service';
import {DOCUMENT} from '@angular/common';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import {ActivatedRoute, Router} from '@angular/router';
import {BillingService} from '../../_services/billing.service';
import {SitebillEntity} from '../../_models';
import {GetSessionKeyService} from '../../_services/get-session-key.service';

@Component({
    selector   : 'profile',
    templateUrl: './profile.component.html',
    styleUrls  : ['./profile.component.scss']
})
export class ProfileComponent implements OnInit
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
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private billingSerivce: BillingService,
        protected getSessionKeyService: GetSessionKeyService,
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
        this.entity.set_key_value(this.getSessionKeyService.get_user_id());

    }

    ngOnInit(): void {
        this.edit_mode = false;
    }

    edit(): void {
        this.edit_mode = true;
    }
    close_edit(): void {
        this.getSessionKeyService.load_current_user_profile();
        this.edit_mode = false;
    }
}
