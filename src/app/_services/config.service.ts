import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {GetApiUrlService} from './get-api-url.service';
import {GetSessionKeyService} from './get-session-key.service';

@Injectable()
export class ConfigService {

    constructor(
        private http: HttpClient,
        protected getApiUrlService: GetApiUrlService,
        protected getSessionKeyService: GetSessionKeyService,
    ) {}

    // is_config_loaded()
    // init_config_standalone()
    // init_config()
    // after_config_loaded()

    system_config() {
        let body = {};
        body = {action: 'config', do: 'system_config', session_key: this.getSessionKeyService.get_session_key_safe()};
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    update_system_config( qlItems: any ) {
        let body = {};
        body = {
            action: 'config',
            do: 'update',
            ql_items: qlItems,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

}
