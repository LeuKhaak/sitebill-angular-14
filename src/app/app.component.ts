import { Component, Inject, OnDestroy, OnInit, Input, ElementRef} from '@angular/core';
import {Router} from "@angular/router";

import {PlatformLocation } from '@angular/common';

import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import {Subject, Subscription, timer} from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { navigation } from 'app/navigation/navigation';
import { locale as navigationEnglish } from 'app/navigation/i18n/en';
import { locale as navigationTurkish } from 'app/navigation/i18n/tr';
import { Bitrix24Router } from './integrations/bitrix24/bitrix24router';
import {ModelService} from './_services/model.service';
import {DemoBannerComponent} from "./dialogs/demo-banner/demo-banner.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SitebillAuthService} from "./_services/sitebill-auth.service";

@Component({
    selector   : 'app',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy
{
    fuseConfig: any;
    navigation: any;
    @Input() hero: any;

    // Private
    private _unsubscribeAll: Subject<any>;
    private demoTimerSubscribe: Subscription;
    demoDialogRef: MatDialogRef<DemoBannerComponent>;
    private firstRun: Boolean;

    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {Platform} _platform
     * @param {TranslateService} _translateService
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        platformLocation: PlatformLocation,
        private elRef: ElementRef,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private router: Router,
        private bitrix24Router: Bitrix24Router,
        public modelService: ModelService,
        public sitebillAuthService: SitebillAuthService,
        protected dialog: MatDialog,
        private _platform: Platform
    )
    {
        this.firstRun = true;
        /*
        const conf = {
            layout: {
                sidepanel: {
                    hidden: true,
                }
            }
        }
         */
        //this._fuseConfigService.setConfig(conf);
        if (this.elRef.nativeElement.getAttribute('navbar_hidden') === 'true') {
            this.modelService.hide_navbar();
            this.modelService.setDomConfigValue('navbar_hidden', true);
        }

        if (this.elRef.nativeElement.getAttribute('toolbar_hidden') === 'true') {
            this.modelService.hide_toolbar();
            this.modelService.setDomConfigValue('toolbar_hidden', true);
        }


        if (this.elRef.nativeElement.getAttribute('run') === 'calculator') {
            this.router.navigate(['/calculator']);
        }
        if (this.elRef.nativeElement.getAttribute('run') === 'carousel') {
            this.router.navigate(['/carousel']);
        }
        if (this.elRef.nativeElement.getAttribute('run') === 'search') {
            this.router.navigate(['/search']);
        }
        if (this.elRef.nativeElement.getAttribute('run') === 'leads') {
            this.router.navigate(['/client/my']);
        }
        if (this.elRef.nativeElement.getAttribute('run') === 'frontend') {
            if (this.elRef.nativeElement.getAttribute('skip') !== 'true') {
                this.router.navigate(['/frontend/front']);
            }
        }

        // Get default navigation
        this.navigation = navigation.slice(0);

        // Register the navigation to the service
        this._fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');

        // Add languages
        this._translateService.addLangs(['en', 'tr']);

        // Set the default language
        this._translateService.setDefaultLang('en');

        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(navigationEnglish, navigationTurkish);

        // Use a language
        this._translateService.use('en');

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix Start
         * ----------------------------------------------------------------------------------------------------
         */

        /**
         * If you are using a language other than the default one, i.e. Turkish in this case,
         * you may encounter an issue where some of the components are not actually being
         * translated when your app first initialized.
         *
         * This is related to ngxTranslate module and below there is a temporary fix while we
         * are moving the multi language implementation over to the Angular's core language
         * service.
         **/

        // Set the default language to 'en' and then back to 'tr'.
        // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
        // been selected and there is no way to force it, so we overcome the issue by switching
        // the default language back and forth.
        /**
         setTimeout(() => {
            this._translateService.setDefaultLang('en');
            this._translateService.setDefaultLang('tr');
         });
         */

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix End
         * ----------------------------------------------------------------------------------------------------
         */

        // Add is-mobile class to the body if the platform is mobile
        if ( this._platform.ANDROID || this._platform.IOS )
        {
            //this.document.getElementById('fuse-app').classList.add('is-mobile');
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {

                this.fuseConfig = config;

                // Boxed
                if ( this.fuseConfig.layout.width === 'boxed' )
                {
                    //this.document.getElementById('fuse-app').classList.add('boxed');
                    //this.document.body.classList.add('boxed');
                }
                else
                {
                    //this.document.getElementById('fuse-app').classList.remove('boxed');
                    this.document.body.classList.remove('boxed');
                }

                // Color theme - Use normal for loop for IE11 compatibility
                for ( let i = 0; i < this.document.body.classList.length; i++ )
                {
                    const className = this.document.body.classList[i];

                    if ( className.startsWith('theme-') )
                    {
                        this.document.body.classList.remove(className);
                    }
                }
                this.init_input_parameters();
            });
        this.init_parser_today_count();
    }

    init_parser_today_count() {
        this.modelService.get_parser_today_count().subscribe((result: any) => {
            if ( result.state === 'success' ) {
                const properties = this._fuseNavigationService.getNavigationItem('parser');
                if ( properties ) {
                    properties.badge.title = result.message;
                    this._fuseNavigationService.updateNavigationItem('parser', properties);
                }
            }
        });

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
        if (app_root_element.getAttribute('theme')) {
            let theme = app_root_element.getAttribute('theme');
            //this.document.getElementById('fuse-app').classList.add(this.fuseConfig.colorTheme);
            //this.fuseConfig.colorTheme = 'theme-red-light';
            this.fuseConfig.colorTheme = theme;
            //this.fuseConfig.colorTheme = 'theme-default';
            //this.fuseConfig.colorTheme = 'theme-purple-green';
            if (theme == 'theme-red-light') {
                require("style-loader!app/custom-theme/ng_select_red.css");
            }
        } else {
            this.fuseConfig.colorTheme = 'theme-default';
        }

        if (app_root_element.getAttribute('bitrix24_placement')) {
            this.bitrix24Router.route(app_root_element.getAttribute('bitrix24_placement'));
        }
        if (app_root_element.getAttribute('disable_default_frontend_route')) {
            // console.log('set disable_default_frontend_route');
            this.modelService.setDomConfigValue('disable_default_frontend_route', true);
        }
        if (app_root_element.getAttribute('parser_disable') === 'true') {
            // console.log('set disable_default_frontend_route');
            this.modelService.setDomConfigValue('parser_disable', true);
        }
        if (app_root_element.getAttribute('standalone_mode') === 'true') {
            this.initAllAttributes(app_root_element);
            this.modelService.disable_model_redirect();
            this.modelService.setDomConfigValue('standalone_mode', true);
            this.fuseConfig.layout.style = 'standalone';
        }


        this.document.body.classList.add(this.fuseConfig.colorTheme);
        /*
        this.modelService.need_reload_emitter.subscribe(
            (result: any) => {
                if ( result === true ) {
                    console.log('start reload window');
                    if ( localStorage.getItem('sitebill_reloaded')  !== 'true') {
                        localStorage.setItem('sitebill_reloaded', 'true');
                        //this.document.location.reload();
                    }
                }
            },
            error => {
                console.log('error');
                console.log(error);
            },
            complete => {
                console.log('need_reload_emitter complete')
            }
        );
         */
        if ( this.modelService.getDomConfigValue('standalone_mode') ) {
        } else {
            this.modelService.onSitebillStart();
            this.modelService.config_loaded_emitter.subscribe((result: any) => {
                if ( this.modelService.getConfigValue('apps.complex.api.enable') !== '1' ) {
                    this._fuseNavigationService.removeNavigationItem('complex');
                }


                if (!this.demoTimerSubscribe) {
                    this.switchTimer();
                }
            });
        }


    }

    initAllAttributes (node) {
        if (node.getAttributeNames()) {
            node.getAttributeNames().forEach((item) => {
                try {
                    this.modelService.setDomConfigValue(item, node.getAttribute(item));
                } catch (e){

                }
            });
        }
    }


    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    switchTimer() {
        if (
            this.modelService.getConfigValue('apps.realty.show_unreg_notify') === '1'
        ) {
            if ( this.demoTimerSubscribe ) {
                this.demoTimerSubscribe.unsubscribe();
            }
            let timerPeriod = 30000;
            if (!this.firstRun) {
                timerPeriod = 300000;
            }
            const numbers = timer(timerPeriod);
            this.demoTimerSubscribe = numbers.subscribe(x => this.showDemoMessage());

            if ( this.firstRun ) {
                this.firstRun = false;
            }

        }
    }

    showDemoMessage() {
        if ( this.modelService.get_current_user_profile().group_id.value === '1' ||  this.modelService.get_current_user_profile().group_id.value === '3' ) {
            return false;
        }
        this.demoDialogRef = this.dialog.open(DemoBannerComponent, {
            disableClose: false,
            data: null
        });

        this.demoDialogRef.afterClosed().subscribe(() => {
            this.switchTimer();
        });

    }
}
