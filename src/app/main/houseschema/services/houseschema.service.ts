import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SitebillEntity} from '../../../_models';
import {LevelModel} from '../models/level.model';
import {GetApiUrlService} from '../../../_services/get-api-url.service';
import {GetSessionKeyService} from '../../../_services/get-session-key.service';

@Injectable()
export class HouseSchemaService {
    /**
     * Constructor
     */
    constructor(
        private http: HttpClient,
        protected getApiUrlService: GetApiUrlService,
        protected getSessionKeyService: GetSessionKeyService,
    ) {

    }

    get_schema(complex_id: number): any { // any ???
        const request = { action: 'complex', do: 'get_schema', complex_id: complex_id, session_key: this.getSessionKeyService.get_session_key_safe() };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request);
    }

    update_level(entity: SitebillEntity, field_name, current_position, level: LevelModel): any { // any ???
        const request = {
            action: 'uploads',
            do: 'update_level',
            model_name: entity.get_table_name(),
            field_name: field_name,
            current_position: current_position,
            key: entity.get_primary_key(),
            key_value: entity.get_key_value(),
            level: level,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request);
    }

    load_level(entity: SitebillEntity, field_name, current_position): any { // any ???
        const request = {
            action: 'uploads',
            do: 'load_level',
            model_name: entity.get_table_name(),
            field_name: field_name,
            current_position: current_position,
            key: entity.get_primary_key(),
            key_value: entity.get_key_value(),
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request);
    }
}
