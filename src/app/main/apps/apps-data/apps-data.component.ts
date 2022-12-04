import { Component } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {FilterService} from "../../../_services/filter.service";
import {ApiParams, SitebillEntity} from "../../../_models";
import {ModelService} from "../../../_services/model.service";
import {AppsDataService} from "./apps-data.service";
import {SitebillAuthService} from "../../../_services/sitebill-auth.service";

@Component({
    selector: 'apps-data-client',
    templateUrl: './apps-data.component.html',
    styleUrls: ['./apps-data.component.scss'],
    animations: fuseAnimations
})
export class AppsDataComponent {
    public memorylist_id: any;
    public default_params: ApiParams;
    public switch_trigger: boolean;

    public enable_collections = false;
    public only_collections = false;

    private entity: SitebillEntity;

    constructor(
        private route: ActivatedRoute,
        public modelService: ModelService,
        public filterService: FilterService,
        public sitebillAuthService: SitebillAuthService,
        public appsDataService: AppsDataService,
        ) {
        this.switch_trigger = false;
    }

    ngOnInit() {
        this.entity = new SitebillEntity();
        this.entity.set_app_name('data');
        this.entity.set_table_name('data');
        this.entity.primary_key = 'id';
        this.sitebillAuthService.init();


        this.route.paramMap.subscribe((params: ParamMap) => {
            if ( params.get('memorylist_id') ) {
                this.enable_collections = true;
                this.only_collections = true;
                this.memorylist_id = params.get('memorylist_id');
            } else {
                this.enable_collections = false;
                this.only_collections = false;
            }

            if ( params.get('tag') ) {
                this.default_params = this.appsDataService.getMenuItemByTag(params.get('tag')).params;
            }
            this.switch_trigger = !this.switch_trigger;
            this.filterService.empty_share(this.entity);
        });
    }
}
