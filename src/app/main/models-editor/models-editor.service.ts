import {Injectable} from '@angular/core';
import {ModelService} from "../../_services/model.service";
import {SitebillEntity} from "../../_models";
import {Observable} from "rxjs";

@Injectable()
export class ModelsEditorService {
    private currentModel: SitebillEntity;
    /**
     * Constructor
     */
    constructor(
        private modelService: ModelService,
    ) {

    }

    setCurrentModel(entity: SitebillEntity): void {
        this.currentModel = entity;
    }

    getCurrentModel() : SitebillEntity {
        return this.currentModel;
    }

    toggle( columns_id, toggled_column_name ): Observable<any> {
        if ( toggled_column_name == 'required_boolean' ) {
            toggled_column_name = 'required';
        }
        return this.modelService.toggle(
            'table',
            'columns',
            'columns_id',
            columns_id,
            toggled_column_name
        );
    }
}
