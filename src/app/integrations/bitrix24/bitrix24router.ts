import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FuseConfigService } from "@fuse/services/config.service";
import { ModelService } from "app/_services/model.service";

@Component({
    selector: 'bitrix24router',
    template: ''
})
export class Bitrix24Router {
    private first_run: boolean;
    constructor(
        private router: Router,
        private modelSerivce: ModelService,
    ) {
        this.first_run = true;
    }

    route(placement: string) {
        if (this.modelSerivce.get_user_id() == null) {
            return false;
        }
        if ( !this.modelSerivce.is_config_loaded() ) {
            //return false;
        }

        if ( !this.first_run ) {
            //return false;
        }

        if (placement == 'CRM_CONTACT_DETAIL_TAB' || placement == 'CRM_CONTACT_LIST_MENU' || placement == 'CRM_DEAL_LIST_MENU' || placement == 'CRM_DEAL_DETAIL_TAB' || placement == 'CRM_LEAD_LIST_MENU' || placement == 'CRM_LEAD_DETAIL_TAB') {
            //console.log('bitrix route ' + this.first_run);
            this.first_run = false;
            this.router.navigate(['/grid/collections/']);
        }
    }
}
