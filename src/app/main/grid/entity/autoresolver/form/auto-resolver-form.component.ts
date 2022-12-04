import {Component, Input} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import {SitebillEntity} from "../../../../../_models";
import {delay, takeUntil} from "rxjs/operators";
import {labelColors} from "../../../../houseschema/models/level-location.model";
import {FilterService} from "../../../../../_services/filter.service";
import {Subject} from "rxjs";
import {ModelService} from "../../../../../_services/model.service";

@Component({
    selector: 'auto-resolver-form',
    templateUrl: './auto-resolver-form.component.html',
    styleUrls: ['./auto-resolver-form.component.scss'],
    animations: fuseAnimations
})
export class AutoResolverFormComponent {
    entity: SitebillEntity;

    @Input('app_name')
    app_name: string;

    @Input('table_name')
    table_name: string;

    @Input('primary_key')
    primary_key: string;

    @Input('success_message')
    success_message: string;

    @Input('entity_uri')
    entity_uri: string;

    @Input('only_field_name')
    only_field_name: string;

    predefined_ql_items: any;




    private _unsubscribeAll: Subject<any>;
    show_form: boolean = true;


    constructor(
        public filterService: FilterService,
        public modelService: ModelService,
    ) {
        this._unsubscribeAll = new Subject();
    }


    ngOnInit() {
        if ( this.entity_uri ) {
            this.modelService.loadByUri(this.app_name, this.entity_uri).pipe(
                takeUntil(this._unsubscribeAll)
            ).subscribe( (result: any) => {
                    if ( result.state == 'success' ) {
                        this.init_slice_entity(result);
                    } else {
                        console.log(result);
                    }
                }
            );
        } else {
            this.entity = new SitebillEntity();
            this.entity.set_app_name(this.app_name);
            this.entity.set_table_name(this.table_name);
            this.entity.primary_key = this.primary_key;
            this.entity.set_hidden(this.primary_key);
            this.entity.set_default_value('object_id', this.modelService.getDomConfigValue('object_id'));
            this.entity.set_default_value('object_type', this.modelService.getDomConfigValue('object_type'));
        }



        this.filterService.share
            .pipe(
                delay(500),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((entity: SitebillEntity) => {
                if (entity.get_app_name() == this.entity.get_app_name()) {
                    // console.log(entity);
                    // console.log(entity.get_ql_items());
                    if (entity.get_hook() === 'afterSuccessCreate' && entity.get_key_value()) {
                        this.show_form = false;
                    }
                }
            });

    }

    init_slice_entity ( data:any ) {
        this.predefined_ql_items = {};
        this.predefined_ql_items[this.only_field_name] = true;
        this.entity = new SitebillEntity();
        this.entity.set_app_name(this.app_name);
        this.entity.set_table_name(data.table_name);
        this.entity.primary_key = data.primary_key;
        this.entity.set_hidden(this.primary_key);
        this.entity.set_key_value(data[data.primary_key]);

    }

    ngOnDestroy () {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
