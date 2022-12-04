import {Component, Input, OnInit} from '@angular/core';
import {SitebillEntity} from '../../../../../_models';

@Component({
    selector: 'client-card',
    templateUrl: './client-card.component.html',
    styleUrls: ['./client-card.component.scss']
})
export class ClientCardComponent implements OnInit {
    @Input('entity')
    entity: SitebillEntity;

    constructor() {
    }

    ngOnInit(): void {
        console.log(this.entity);
    }

}
