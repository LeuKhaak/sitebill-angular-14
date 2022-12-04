import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';

import { takeUntil } from 'rxjs/operators';
import {SitebillEntity, SitebillModelItem} from "../../../_models";
import {ModelService} from "../../../_services/model.service";
import {SnackService} from "../../../_services/snack.service";
import {SitebillResponse} from "../../../_models/sitebill-response";
import {ModelsEditorService} from "../models-editor.service";
import {instances} from "chart.js";

@Component({
    selector     : 'model-list',
    templateUrl  : './model-list.component.html',
    styleUrls    : ['./model-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ModelListComponent implements OnInit, OnDestroy
{
    models: SitebillEntity[];
    currentModel: SitebillEntity;
    public sitebillResponse:SitebillResponse;


    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     */
    constructor(
        protected modelService: ModelService,
        protected _snackService: SnackService,
        protected _modelsEditorService: ModelsEditorService,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.sitebillResponse = new SitebillResponse();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.modelService.get_models_list()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                Object.assign(this.sitebillResponse, result);
                if ( this.sitebillResponse.success() ) {
                    this.models = [];
                    for (const [key, value] of Object.entries(this.sitebillResponse.data)) {
                        let entity = new SitebillEntity();
                        if ( value ) {
                            for (const [key_obj, value_obj] of Object.entries(value)) {
                                let model_item = new SitebillModelItem(value_obj);
                                entity.model.push(model_item);
                            }
                        }
                        entity.set_app_name(key);
                        entity.set_table_name(key);
                        this.models.push(entity);
                    }
                    this._modelsEditorService.setCurrentModel(this.models[0]);
                } else {
                    this._snackService.error(this.sitebillResponse.message);
                }
            });
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
     * Read model
     *
     * @param model
     */
    selectModel(model: SitebillEntity): void
    {
        this._modelsEditorService.setCurrentModel(model);
    }

    isSelected ( model: SitebillEntity ) {
        if ( model === this._modelsEditorService.getCurrentModel() ) {
            return true;
        }
        return false;
    }

    /**
     * On drop
     *
     * @param ev
     */
    onDrop(ev): void
    {

    }
}
