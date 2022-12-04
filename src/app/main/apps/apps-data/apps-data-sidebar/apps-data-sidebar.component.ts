import {Component} from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {SnackService} from "../../../../_services/snack.service";
import {AppsDataService} from "../apps-data.service";

@Component({
    selector   : 'apps-data-sidebar',
    templateUrl: './apps-data-sidebar.component.html',
    styleUrls  : ['./apps-data-sidebar.component.scss']
})
export class AppsDataSidebarComponent
{
    protected _unsubscribeAll: Subject<any>;
    public memorylist_user: any[];
    public app_root = '/apps-data';


    /**
     * Constructor
     *
     */
    constructor(
        private modelService: ModelService,
        protected _snackService: SnackService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        public appsDataService: AppsDataService,
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
        this._unsubscribeAll = new Subject();

    }


    ngOnInit() {
        this.load_memorylist_for_user();
    }


    load_memorylist_for_user () {
        let params = {};
        this.modelService.load_dictionary_model_with_params(
            'memorylist_user',
            'memorylist_id',
            params,
            true
        )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result) {
                    this.memorylist_user = result.data;
                }
            });

    }

    OnDestroy () {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
