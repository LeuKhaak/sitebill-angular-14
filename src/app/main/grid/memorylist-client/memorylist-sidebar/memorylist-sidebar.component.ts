import {Component} from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {SnackService} from "../../../../_services/snack.service";

@Component({
    selector   : 'memorylist-sidebar',
    templateUrl: './memorylist-sidebar.component.html',
    styleUrls  : ['./memorylist-sidebar.component.scss']
})
export class MemorylistSidebarComponent
{
    protected _unsubscribeAll: Subject<any>;
    memorylist_user: any[];

    /**
     * Constructor
     *
     */
    constructor(
        private modelService: ModelService,
        protected _snackService: SnackService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
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
