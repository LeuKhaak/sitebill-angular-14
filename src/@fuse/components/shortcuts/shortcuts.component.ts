import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseMatchMediaService } from '@fuse/services/match-media.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import {ModelService} from '../../../app/_services/model.service';
import {GetSessionKeyService} from '../../../app/_services/get-session-key.service';
import {SitebillEntity} from '../../../app/_models';
import {Bitrix24Service} from '../../../app/integrations/bitrix24/bitrix24.service';

@Component({
    selector   : 'fuse-shortcuts',
    templateUrl: './shortcuts.component.html',
    styleUrls  : ['./shortcuts.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuseShortcutsComponent implements OnInit, OnDestroy
{
    shortcutItems: any[];
    navigationItems: any[];
    filteredNavigationItems: any[];
    searching: boolean;
    mobileShortcutsPanelActive: boolean;
    entity: SitebillEntity;

    @Input()
    navigation: any;

    @ViewChild('searchInput')
    searchInputField;

    @ViewChild('shortcuts')
    shortcutsEl: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;
    private prev_entity_name: string;

    /**
     * Constructor
     *
     * @param {Renderer2} _renderer
     * @param {CookieService} _cookieService
     * @param {FuseMatchMediaService} _fuseMatchMediaService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {MediaObserver} _observableMedia
     * @param bitrix24Service
     * @param modelService
     * @param getSessionKeyService
     * @param cdr
     */
    constructor(
        private _cookieService: CookieService,
        private _fuseMatchMediaService: FuseMatchMediaService,
        private _fuseNavigationService: FuseNavigationService,
        private _observableMedia: MediaObserver,
        private _renderer: Renderer2,
        private bitrix24Service: Bitrix24Service,
        public modelService: ModelService,
        public getSessionKeyService: GetSessionKeyService,
        protected cdr: ChangeDetectorRef,
    )
    {
        // Set the defaults
        this.shortcutItems = [];
        this.searching = false;
        this.mobileShortcutsPanelActive = false;

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
        // Get the navigation items and flatten them
        this.filteredNavigationItems = this.navigationItems = this._fuseNavigationService.getFlatNavigation(this.navigation);
        // console.log(this.modelService.get_current_entity());


        /*
        if ( this._cookieService.check('FUSE2.shortcuts') )
        {
            this.shortcutItems = JSON.parse(this._cookieService.get('FUSE2.shortcuts'));
        }
        else
        {
        }
         */
        this.set_default_shortcuts();

        // Subscribe to media changes
        this._fuseMatchMediaService.onMediaChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                if ( this._observableMedia.isActive('gt-sm') )
                {
                    this.hideMobileShortcutsPanel();
                }
            });
    }

    clear_shortcuts () {
        this.shortcutItems = [];
    }

    set_default_shortcuts () {
        // console.log('apps.products.contacts_market');
        // console.log(this.modelService.getConfigValue('apps.products.contacts_market'));
        if ( this.getSessionKeyService.getConfigValue('apps.products.contacts_market') === 1 ) {
            // console.log('market icons');
            // User's shortcut items
            this.shortcutItems.push({
                'title': 'База объектов',
                'type' : 'item',
                'icon' : 'list',
                'url'  : '/frontend/front'
            });

            this.shortcutItems.push({
                'title': 'Пакеты услуг и тарифы',
                'type' : 'item',
                'icon' : 'monetization_on',
                'url'  : '/frontend/prices'
            });

            this.shortcutItems.push({
                'title': 'О проекте',
                'type' : 'item',
                'icon' : 'textsms',
                'url'  : '/frontend/content/about'
            });

            this.shortcutItems.push({
                'title': 'Контакты',
                'type' : 'item',
                'icon' : 'account_box',
                'url'  : '/frontend/content/contacts'
            });
        }
    }

    reinit_shortcuts (entity: SitebillEntity) {
        // console.log('reinit ' + entity.get_app_name());
        this.clear_shortcuts();
        this.set_default_shortcuts();
        if ( entity.get_app_name() === 'data' && !this.bitrix24Service.is_bitrix24_inited() ) {
            this.shortcutItems.push({
                'title': 'Мои объекты',
                'type' : 'item',
                'icon' : 'business_center',
                'url'  : '/grid/data/my/'
            });
            this.shortcutItems.push({
                'title': 'Все объекты',
                'type' : 'item',
                'icon' : 'list',
                'url'  : '/grid/data/'
            });
        } else if ( entity.get_app_name() === 'client' ) {
        }
        setTimeout(() => {
            this.cdr.markForCheck();
        }, 100);
    }

    ngAfterViewChecked() {
        if ( this.entity === null || this.entity === undefined ) {
            this.entity = this.modelService.get_current_entity();
        }
        if ( this.entity !== null && this.entity !== undefined ) {
            if ( this.prev_entity_name !== this.modelService.get_current_entity().get_app_name() ) {
                this.entity = this.modelService.get_current_entity();
                this.prev_entity_name = this.modelService.get_current_entity().get_app_name();
                setTimeout(() => {
                    this.reinit_shortcuts(this.entity);
                    // this.cdr.markForCheck();
                }, 100);

            }

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
     * Search
     *
     * @param event
     */
    search(event): void
    {
        const value = event.target.value.toLowerCase();

        if ( value === '' )
        {
            this.searching = false;
            this.filteredNavigationItems = this.navigationItems;

            return;
        }

        this.searching = true;

        this.filteredNavigationItems = this.navigationItems.filter((navigationItem) => {
            return navigationItem.title.toLowerCase().includes(value);
        });
    }

    /**
     * Toggle shortcut
     *
     * @param event
     * @param itemToToggle
     */
    toggleShortcut(event, itemToToggle): void
    {
        event.stopPropagation();

        for ( let i = 0; i < this.shortcutItems.length; i++ )
        {
            if ( this.shortcutItems[i].url === itemToToggle.url )
            {
                this.shortcutItems.splice(i, 1);

                // Save to the cookies
                this._cookieService.set('FUSE2.shortcuts', JSON.stringify(this.shortcutItems));

                return;
            }
        }

        this.shortcutItems.push(itemToToggle);

        // Save to the cookies
        this._cookieService.set('FUSE2.shortcuts', JSON.stringify(this.shortcutItems));
    }

    /**
     * Is in shortcuts?
     *
     * @param navigationItem
     * @returns {any}
     */
    isInShortcuts(navigationItem): any
    {
        return this.shortcutItems.find(item => {
            return item.url === navigationItem.url;
        });
    }

    /**
     * On menu open
     */
    onMenuOpen(): void
    {
        setTimeout(() => {
            this.searchInputField.nativeElement.focus();
        });
    }

    /**
     * Show mobile shortcuts
     */
    showMobileShortcutsPanel(): void
    {
        this.mobileShortcutsPanelActive = true;
        if ( this.shortcutsEl !== undefined ) {
            this._renderer.addClass(this.shortcutsEl.nativeElement, 'show-mobile-panel');
        }
    }

    /**
     * Hide mobile shortcuts
     */
    hideMobileShortcutsPanel(): void
    {
        this.mobileShortcutsPanelActive = false;
        if ( this.shortcutsEl !== undefined ) {
            this._renderer.removeClass(this.shortcutsEl.nativeElement, 'show-mobile-panel');
        }
    }
}
