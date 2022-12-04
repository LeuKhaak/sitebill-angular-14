import {Component, Input, OnInit} from '@angular/core';
import {FilterService} from '../../../../_services/filter.service';
import {SitebillEntity} from 'app/_models';

@Component({
  selector: 'app-from-to',
  templateUrl: './from-to.component.html',
  styleUrls: ['./from-to.component.scss']
})
export class FromToComponent implements OnInit {
    currentYear = (new Date()).getFullYear();
    invalidMin = false;
    invalidMax = false;

    @Input() currency = '$';
    @Input() entity: SitebillEntity;
    @Input() columnObject: any;
    selectedFilterMax: any;
    selectedFilterMin: any;

    constructor(
        private filterService: FilterService,
    ) {
    }


    ngOnInit(): void {
        if (this.columnObject === 'year') {
            this.selectedFilterMax = this.currentYear;
        }
    }

    selectItem(value, determinant): void {
        const filterName = `${this.columnObject}_${determinant}`;
        console.log(this.columnObject);

        // console.log(this.entity);
        if (isNaN(+value) === false) {
            this.invalidMin = false;
            this.invalidMax = false;
            this.filterService.share_data(this.entity, filterName, value);
        } else if (determinant === 'min') {
            this.invalidMin = true;
        } else {
            this.invalidMax = true;
        }
    }
}
