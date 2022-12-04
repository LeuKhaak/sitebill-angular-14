import {Component, isDevMode, ElementRef, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FuseConfigService} from '@fuse/services/config.service';
import {currentUser} from 'app/_models/currentuser';
import {DOCUMENT} from '@angular/common';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';
import {SitebillEntity} from '../../../_models';
import {FilterService} from "../../../_services/filter.service";
import {FormControl} from "@angular/forms";
import {debounceTime, distinctUntilChanged, takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {Router} from "@angular/router";

@Component({
    selector   : 'front-search',
    templateUrl: './front-search.component.html',
    styleUrls  : ['./front-search.component.scss']
})
export class FrontSearchComponent
{
    public entity: SitebillEntity;
    searchInput: FormControl;
    protected _unsubscribeAll: Subject<any>;


    /**
     * Constructor
     *
     */
    constructor(
        private _httpClient: HttpClient,
        private elRef: ElementRef,
        private modelService: ModelService,
        private router: Router,
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        @Inject(APP_CONFIG) private config: AppConfig,
        public filterService: FilterService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._unsubscribeAll = new Subject();

        this.entity = new SitebillEntity();
        this.searchInput = new FormControl();
        this.setup_apps();

        this._fuseTranslationLoaderService.loadTranslations(english, russian);
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: false
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                }
            }
        };
    }
    ngOnInit() {
        if (this.filterService.get_share_array(this.entity.get_app_name()) != null) {
            if (this.filterService.get_share_array(this.entity.get_app_name())['concatenate_search'] != null) {
                this.searchInput = new FormControl(this.filterService.get_share_array(this.entity.get_app_name())['concatenate_search']);
            }
        }

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                //console.log(searchText);
                //console.log('search string share');
                this.filterService.share_data(this.entity, 'concatenate_search', searchText);
            });
    }

    setup_apps() {
        this.entity.set_app_name('data');
        this.entity.set_table_name('data');
        this.entity.primary_key = 'id';
    }

    clear_search_text() {
        this.searchInput.patchValue('');
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    search() {
        this.router.navigate(['/grid/data/']);
    }
}
