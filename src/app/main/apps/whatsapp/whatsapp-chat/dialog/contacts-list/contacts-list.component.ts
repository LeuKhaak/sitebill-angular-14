import {Component, Input, OnInit} from '@angular/core';
import {takeUntil} from "rxjs/operators";
import {ModelService} from "../../../../../../_services/model.service";
import {Subject} from "rxjs";
import {FilterService} from "../../../../../../_services/filter.service";
import {WhatsAppService} from "../../../whatsapp.service";
import {SendCallbackBundle} from "../../../types/whatsapp.types";

@Component({
    selector: 'whatsapp-contacts-list',
    templateUrl: './contacts-list.component.html',
    styleUrls: ['./contacts-list.component.scss']
})
export class ContactsListComponent implements OnInit {
    protected _unsubscribeAll: Subject<any>;

    @Input("sendCallbackBundle")
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

    loadMailingListFromWhatsappService () {
        if ( this.whatsAppService.getMailingList().length > 0 ) {
            this.whatsAppService.getMailingList().forEach(item => {
                let mapped = Object.keys(item);
                mapped.forEach(function (column_item, i, arr) {
                   if ( column_item == 'phone' ) {
                       if ( this.phone_list.indexOf(item[column_item].value) < 0 ) {
                           this.phone_list.push(item[column_item].value);
                       }
                   }
                }.bind(this));
            });
        }

    }

    loadMailingListFromGridParams () {
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

    getFilterParams() {
        let filter_params_json = {};
        let concatenate_search_string = null;

        var obj = this.filterService.get_share_array(this.sendCallbackBundle.entity.get_app_name());
        var mapped = Object.keys(obj);
        //console.log(mapped);
        var self = this;

        mapped.forEach(function (item, i, arr) {
            if (
                self.modelService.getConfigValue('apps.realty.search_string_parser.enable') === '1' &&
                item === 'concatenate_search' &&
                self.sendCallbackBundle.entity.get_app_name() === 'data'
            ) {
                concatenate_search_string = obj[item];
            } else {
                //console.log(obj[item].length);
                //console.log(typeof obj[item]);
                if (obj[item] != null ) {
                    if (obj[item].length != 0) {
                        filter_params_json[item] = obj[item];
                    } else if (typeof obj[item] === 'object' && obj[item].length != 0) {
                        filter_params_json[item] = obj[item];
                    }
                }
            }
        });
        return filter_params_json;
    }

    OnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
