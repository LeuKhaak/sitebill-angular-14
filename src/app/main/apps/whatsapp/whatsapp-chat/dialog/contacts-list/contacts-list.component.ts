import {Component, Input, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {ModelService} from '../../../../../../_services/model.service';
import {Subject} from 'rxjs';
import {FilterService} from '../../../../../../_services/filter.service';
import {WhatsAppService} from '../../../whatsapp.service';
import {SendCallbackBundle} from '../../../types/whatsapp.types';

@Component({
    selector: 'whatsapp-contacts-list',
    templateUrl: './contacts-list.component.html',
    styleUrls: ['./contacts-list.component.scss']
})
export class ContactsListComponent implements OnInit {
    protected _unsubscribeAll: Subject<any>;

    @Input()
    sendCallbackBundle: SendCallbackBundle;

    public phone_list: string[];

    constructor(
        public modelService: ModelService,
        public filterService: FilterService,
        protected whatsAppService: WhatsAppService,
    ) {
        this._unsubscribeAll = new Subject();
        this.phone_list = [];
    }

    ngOnInit(): void {
        this.loadMailingListFromWhatsappService();
    }

    loadMailingListFromWhatsappService(): void {
        if ( this.whatsAppService.getMailingList().length > 0 ) {
            this.whatsAppService.getMailingList().forEach(item => {
                const mapped = Object.keys(item);
                mapped.forEach(function(column_item, i, arr): void {
                   if ( column_item === 'phone' ) {
                       if ( this.phone_list.indexOf(item[column_item].value) < 0 ) {
                           this.phone_list.push(item[column_item].value);
                       }
                   }
                }.bind(this));
            });
        }

    }

    loadMailingListFromGridParams(): void {
        this.modelService.load(this.sendCallbackBundle.entity.get_table_name(), ['phone'], this.getFilterParams(), null, 1, 999)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if ( result && result.rows ) {
                    result.rows.forEach(item => {
                        if ( item.phone ) {
                            this.phone_list.push(item.phone.value);
                        }
                    });
                }
            });
    }

    getFilterParams(): {[index: string]: any} {
        const filter_params_json = {};
        let concatenate_search_string = null;

        const obj = this.filterService.get_share_array(this.sendCallbackBundle.entity.get_app_name());
        const mapped = Object.keys(obj);
        // console.log(mapped);
        mapped.forEach(function(item, i, arr): void {
            if (
                this.modelService.getConfigValue('apps.realty.search_string_parser.enable') === '1' &&
                item === 'concatenate_search' &&
                this.sendCallbackBundle.entity.get_app_name() === 'data'
            ) {
                concatenate_search_string = obj[item];
            } else {
                // console.log(obj[item].length);
                // console.log(typeof obj[item]);
                if (obj[item] != null ) {
                    if (obj[item].length !== 0) {
                        filter_params_json[item] = obj[item];
                    } else if (typeof obj[item] === 'object' && obj[item].length !== 0) {
                        filter_params_json[item] = obj[item];
                    }
                }
            }
        });
        return filter_params_json;
    }

    OnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
