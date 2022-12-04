import {Component, ElementRef, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FuseConfigService} from '@fuse/services/config.service';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { ModelService } from 'app/_services/model.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SitebillEntity} from '../../../_models';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector   : 'profile-card',
    templateUrl: './profile-card.component.html',
    styleUrls  : ['./profile-card.component.scss']
})
export class ProfileCardComponent
{
    entity: SitebillEntity;
    user_info: any;

    /**
     * Constructor
     *
     */
    constructor(
        private _httpClient: HttpClient,
        private elRef: ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        public modelService: ModelService,
        private _fuseConfigService: FuseConfigService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {

    }

    ngOnInit() {
        this.entity = new SitebillEntity();
        this.entity.set_app_name('profile');
        this.entity.set_table_name('user');
        this.entity.primary_key = 'user_id';
        this.entity.set_key_value(this.modelService.get_user_id());
        if ( this.entity.get_key_value() ) {
            this.user_info = this.modelService.get_current_user_profile();
        }

    }

}
