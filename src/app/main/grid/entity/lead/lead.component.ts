import {Component, OnInit} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FilterService } from 'app/_services/filter.service';
import { MyClientComponent } from './myclient.component';
import {ModelService} from '../../../../_services/model.service';
import {GetSessionKeyService} from '../../../../_services/get-session-key.service';

@Component({
    selector: 'lead-component',
    templateUrl: './lead.component.html',
    styleUrls: ['./lead.component.scss'],
    animations: fuseAnimations
})
export class LeadComponent implements OnInit{
    public allow_load_grid = false;
    constructor(
        private filterService: FilterService,
        protected getSessionKeyService: GetSessionKeyService,
        protected modelService: ModelService
    ) {
        // console.log('lead constructor');
    }

    ngOnInit(): void {
        this.getSessionKeyService.get_session_key_safe();
    }

    after_validated_key(): boolean {
        return this.getSessionKeyService.is_validated_session_key();
    }
    

    getMyClientCounter(): number {
        return this.filterService.get_counter_value('myclient', 'total_count');
    }
    getFreeClientCounter(): number {
        return this.filterService.get_counter_value('freeclient', 'total_count');
    }
}
