import {Inject, Injectable, isDevMode } from '@angular/core';
import {SitebillEntity} from 'app/_models';
import {APP_CONFIG, AppConfig} from 'app/app.config.module';
import {StorageService} from './storage.service';

@Injectable()
export class GetApiUrlService {
    private apiUrl = '';
    private currentEntity: SitebillEntity;

    constructor(
        public storageService: StorageService,
        @Inject(APP_CONFIG) private config: AppConfig,
    ) {
        this.set_api_url(this.storageService.getItem('api_url'));
    }

    set_api_url(apiUrl: string): void {
        this.apiUrl = apiUrl;
    }

    get_current_entity(): SitebillEntity {
        return this.currentEntity;
    }

    get_api_url(ignoreEntityUrl = false): string {
            if ( !ignoreEntityUrl ) {
                try {
                    if (this.get_current_entity().get_app_url() != null) {
                        return this.get_current_entity().get_app_url();
                        // console.log(this.get_current_entity().get_app_name() + Math.random());
                    }
                } catch (e) {

                }
            }
            if (isDevMode() && (this.apiUrl === '' || this.apiUrl === null)) {
                return this.config.apiEndpoint;
            } else if (this.apiUrl === null) {
                return '';
            } else {
                // console.log('prod url');
                return this.apiUrl;
            }
    }
}
