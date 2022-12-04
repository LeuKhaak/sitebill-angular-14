import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ModelService} from "../../../_services/model.service";
import {SitebillEntity} from "../../../_models";
import {LevelModel} from "../models/level.model";

@Injectable()
export class HouseSchemaService {
    /**
     * Constructor
     */
    constructor(
        private http: HttpClient,
        private modelService: ModelService,
    ) {

    }

    get_schema(complex_id: number) {
        const request = { action: 'complex', do: 'get_schema', complex_id: complex_id, session_key: this.modelService.get_session_key_safe() };
        return this.http.post(`${this.modelService.get_api_url()}/apps/api/rest.php`, request);
    }

    update_level(entity: SitebillEntity, field_name, current_position, level: LevelModel) {
        const request = {
            action: 'uploads',
            do: 'update_level',
            model_name: entity.get_table_name(),
            field_name: field_name,
            current_position: current_position,
            key: entity.get_primary_key(),
            key_value: entity.get_key_value(),
            level: level,
            session_key: this.modelService.get_session_key_safe()
        };
        return this.http.post(`${this.modelService.get_api_url()}/apps/api/rest.php`, request);
    }

    load_level(entity: SitebillEntity, field_name, current_position) {
        const request = {
            action: 'uploads',
            do: 'load_level',
            model_name: entity.get_table_name(),
            field_name: field_name,
            current_position: current_position,
            key: entity.get_primary_key(),
            key_value: entity.get_key_value(),
            session_key: this.modelService.get_session_key_safe()
        };
        return this.http.post(`${this.modelService.get_api_url()}/apps/api/rest.php`, request);
    }
}