import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { navigation } from 'app/navigation/navigation';
import {AlertService, AuthenticationService} from '../../../_services/index';
import {ModelService} from '../../../_services/model.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {LoginModalComponent} from '../../../login/modal/login-modal.component';
import {Bitrix24Service} from '../../../integrations/bitrix24/bitrix24.service';


@Component({
    selector   : 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls  : ['./toolbar.component.scss']
})

export class ToolbarComponent implements OnInit, OnDestroy
{
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    showLoadingBar: boolean;
    userStatusOptions: any[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {Router} _router
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private route: ActivatedRoute,
        private _router: Router,
        public modelService: ModelService,
        protected bitrix24Service: Bitrix24Service,
        protected dialog: MatDialog,
        private _translateService: TranslateService,
        private authenticationService: AuthenticationService
    )
    {
        // Set the defaults
        this.userStatusOptions = [
            {
                'title': 'Online',
                'icon' : 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon' : 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon' : 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];

        this.languages = [
            {
                id   : 'en',
                title: 'English',
                flag : 'us'
            },
            {
                id   : 'tr',
                title: 'Turkish',
                flag : 'tr'
            }
        ];

        this.navigation = navigation;

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
        // Subscribe to the router events to show/hide the loading bar
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationStart),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((event) => {
                this.showLoadingBar = true;
            });

        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd)
            )
            .subscribe((event) => {
                this.showLoadingBar = false;
            });

        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, {'id': this._translateService.currentLang});
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

    logout() {
        this.modelService.logout();
    }

    login_modal () {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.panelClass = 'login-form';

        this.dialog.open(LoginModalComponent, dialogConfig);
    }

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void
    {
        // Do your search here...
        console.log(value);
    }

    /**
     * Set the language
     *
     * @param langId
     */
    setLanguage(langId): void
    {
        // Set the selected language for toolbar
        this.selectedLanguage = _.find(this.languages, {'id': langId});

        // Use the selected language for translations
        this._translateService.use(langId);
    }

    profile() {
        this._router.navigate(['profile']);
    }

    my_data() {
        this._router.navigate(['grid/data/my']);
    }

    dashboard() {
        this._router.navigate(['dashboard']);
    }

    has_contacts_access() {
        if ( this.modelService.get_current_user_profile().group_id.value === '1' ||  this.modelService.get_current_user_profile().group_id.value === '3' ) {
            return true;
        }
        return false;
    }

    show_price() {
        if ( this.modelService.is_logged_in() ) {
            this._router.navigate(['dashboard']);
        } else {
            this._router.navigate(['/frontend/prices']);
        }
    }

    all_data() {
        this._router.navigate(['grid/data/']);
    }

    my_collections() {
        if ( this.bitrix24Service.get_domain() !== 'localhost' ) {
            this._router.navigate(['grid/collections/']);
        } else {
            this._router.navigate(['grid/favorites/']);
        }
    }

    goto(route: string) {

        let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        if ( pattern.test(route) ) {
            window.location.href = route;
        } else {
            this._router.navigate([route]);
        }
    }
    goto_link(link: string) {
        window.open(link, "_blank");
    }

}
