import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import { fuseAnimations } from '@fuse/animations';


import {Observable, Subject} from 'rxjs';
import { ModelService } from 'app/_services/model.service';
import {FilterService} from "../../../_services/filter.service";
import {FormControl} from "@angular/forms";
import {SitebillEntity} from "../../../_models";
import {StringParserService} from "../../../_services/string-parser.service";


@Component({
    selector   : 'search-string-parser',
    templateUrl: './search-string-parser.component.html',
    styleUrls  : ['./search-string-parser.component.scss'],
    animations : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class SearchStringParserComponent implements OnInit, OnDestroy
{
    // Private
    private _unsubscribeAll: Subject<any>;

    @Input('search_string')
    search_string: string;

    @Input('entity')
    entity: SitebillEntity;


    parsed_string: string;
    public result_message: string;


    /**
     * Constructor
     *
     */
    constructor(
        public modelService: ModelService,
        public filterService: FilterService,
        protected stringParserService: StringParserService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.filterService.share.subscribe((entity: SitebillEntity) => {
            if (entity.get_app_name() == this.entity.get_app_name()) {
                this.parse();
            }
        });
    }

    parse(testString = null) {

        let search = this.search_string;
        if (testString !== null) {
            search = testString;
        }
        let s = [];
        let parse_result = this.stringParserService.parse(search);
        s = parse_result.s;

        //let parse_array = this.search_string.split(' ');
        //this.result_message = '1 комн, 50 м';
        this.result_message = s.join(' ');
        return this.result_message;
        //console.log(parse_array);
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

}
