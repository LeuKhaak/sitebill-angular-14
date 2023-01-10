import {Component, OnInit, Output, OnDestroy, EventEmitter } from '@angular/core';
import {Subject} from 'rxjs';
import {FuseConfigService} from '@fuse/services/config.service';

import { ModelService } from 'app/_services/model.service';
import { fuseAnimations } from '@fuse/animations';
import { Bitrix24Service } from 'app/integrations/bitrix24/bitrix24.service';
import {SitebillEntity} from '../../_models';
import {FilterService} from '../../_services/filter.service';
import {ConfigService} from '../../_services/config.service';


@Component({
    selector: 'collections',
    templateUrl: './collections.component.html',
    styleUrls: ['./collections.component.css'],
    animations: fuseAnimations
})
export class CollectionsComponent implements OnInit, OnDestroy {
    @Output() submitEvent = new EventEmitter<string>();
    protected _unsubscribeAll: Subject<any>;
    public collections_total_counter: number;
    private data_total_counter: number;

    response: any;




    constructor(
        private _fuseConfigService: FuseConfigService,
        public modelSerivce: ModelService,
        public configService: ConfigService,
        protected bitrix24Service: Bitrix24Service,
        private filterService: FilterService
        ) {
        this._unsubscribeAll = new Subject();

    }

    disable_menu(): void {
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: false
                },
                toolbar: {
                    hidden: false
                },
                footer: {
                    hidden: true
                }
            }
        };
    }

    set_total_counter_collections(event): void {
        this.collections_total_counter = event;
        this.bitrix24Service.set_collections_count(event);
    }

    set_total_counter_data(event): void {
        this.data_total_counter = event;
    }

    configure_menu(): void {
        if ( this.modelSerivce.is_config_loaded() ) {
            // console.log(this.modelSerivce.getConfigValue('apps.realty.enable_toolbar'));
            if (this.configService.getConfigValue('apps.realty.enable_toolbar') === '1') {
                this._fuseConfigService.config = {
                    layout: {
                        toolbar: {
                            hidden: false
                        },
                    }
                };
            }
            if (this.configService.getConfigValue('apps.realty.enable_navbar') === '1') {
                this._fuseConfigService.config = {
                    layout: {
                        navbar: {
                            hidden: false
                        },
                    }
                };
            }

        }

    }

    ngOnInit(): void {
        // this.test_bitrix24();
        this.disable_menu();
        this.configure_menu();
        this.bitrix24Service.init_input_parameters();
        this.bitrix24Service.set_collections_count(this.collections_total_counter);

        /*
        this.bitrix24Service.get_client()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                //console.log(result);
            },
                err => {
                    console.log(err);
                    return false;
                }
            );
         */
        this.filterService.share.subscribe((entity: SitebillEntity) => {
            this.set_total_counter_collections(this.bitrix24Service.get_collections_count());
            // console.log('subscribe collections');
            // console.log(this.collections_total_counter);
        });


    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
