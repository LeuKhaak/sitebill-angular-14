import {Component, ElementRef, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FuseConfigService} from '@fuse/services/config.service';
import {DOCUMENT} from '@angular/common';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FilterService} from '../../_services/filter.service';
import {BillingService} from '../../_services/billing.service';
import {StorageService} from "../../_services/storage.service";

@Component({
    selector   : 'cart',
    templateUrl: './cart.component.html',
    styleUrls  : ['./cart.component.scss']
})
export class CartComponent
{
    items_list_step: boolean = false;
    public step: string;
    public item_id: string;
    public product;
    public currency_id: number = 1;
    public gateways: any;
    private order: any;
    public waiting_payment: boolean = false;
    public invoice_id: number;

    /**
     * Constructor
     *
     */
    constructor(
        private _httpClient: HttpClient,
        private elRef: ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private modelSerivce: ModelService,
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private billingSerivce: BillingService,
        protected storageService: StorageService,
        @Inject(APP_CONFIG) private config: AppConfig,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: false
                },
                footer: {
                    hidden: true
                }
            }
        };

        this.step = this.route.snapshot.paramMap.get('step');
        this.item_id = this.route.snapshot.paramMap.get('item_id');
        console.log(this.step);
        console.log(this.item_id);

    }
    ngOnInit() {
        console.log('cart_items');
        this.product = JSON.parse(this.storageService.getItem('cart_items'));
        console.log(this.product);
        if ( this.step === 'success' ) {
            this.success();
        }
    }

    init_input_parameters () {
        let app_root_element;
        if (this.document.getElementById('calculator_mini_root')) {
            app_root_element = this.document.getElementById('calculator_mini_root');
        } else if (this.document.getElementById('app_root').getAttribute('realty_price') > 0) {
            app_root_element = this.document.getElementById('app_root');
        }
    }


    add_order() {
        this.billingSerivce.add_order(this.product).subscribe(
            (order: any) => {
                /*
                order.gateways.forEach((row, index) => {
                    this.gateways.push(row);
                });

                 */

                this.gateways = order.gateways;
                this.order = order.order;
                this.invoice_id = this.order.invoice_id.value;
            }
        );
        this.step = 'pay';
    }

    success() {
        localStorage.removeItem('cart_items');
        console.log('success step');
    }

    pay_interkassa() {
        let params_array = [];
        for (let [key, value] of Object.entries(this.gateways.interkassa.params)) {
            params_array.push(`${key}=${value}`);
        }
        this.waiting_payment = true;
        // @todo: Анализировать оплату и редиректить в базу после оплаты
        console.log(this.waiting_payment);
        window.location.href = this.gateways.interkassa.submit.url + '?' + params_array.join('&');
    }

    got_it() {
        this.router.navigate(['/frontend/front']);
    }
}
