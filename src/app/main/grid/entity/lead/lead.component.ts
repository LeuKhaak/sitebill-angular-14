import { Component } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FilterService } from 'app/_services/filter.service';
import { MyClientComponent } from './myclient.component';
import {ModelService} from '../../../../_services/model.service';

@Component({
    selector: 'lead-component',
    templateUrl: './lead.component.html',
    styleUrls: ['./lead.component.scss'],
    animations: fuseAnimations
})
export class LeadComponent {
    public allow_load_grid = false;
    constructor(
        private filterService: FilterService,
        protected modelService: ModelService
    ) {
        //console.log('lead constructor');
    }

    ngOnInit() {
        this.modelService.get_session_key_safe();
    }

    after_validated_key () {
        return this.modelService.is_validated_session_key();
    }
    

    getMyClientCounter() {
        return this.filterService.get_counter_value('myclient', 'total_count');
    }
    getFreeClientCounter() {
        return this.filterService.get_counter_value('freeclient', 'total_count');
    }
}
