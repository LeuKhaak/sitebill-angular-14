import {Component, ElementRef, Inject, Input, ViewEncapsulation} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FuseConfigService} from '@fuse/services/config.service';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';
import {ActivatedRoute, Router} from '@angular/router';
import {fuseAnimations} from '../../../@fuse/animations';
import {BillingService} from '../../_services/billing.service';

@Component({
    selector   : 'gateways',
    templateUrl: './gateways.component.html',
    styleUrls  : ['./gateways.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class GatewaysComponent
{
    @Input('invoice_id')
    invoice_id: number;

    public gateways:  { id: string; value: any; interkassa: any };
    private loaded: boolean;
    public waiting_payment: boolean;

    /**
     * Constructor
     *
     */
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private billingService: BillingService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
    }
    ngOnInit() {
        this.load_gateways();
    }

    load_gateways () {
        this.billingService.load_gateways(this.invoice_id).subscribe(
            (gateways: any) => {
                console.log(gateways);
                this.loaded = true;
                // const mapped = Object.keys(gateways).map(key => ({id: key, value: gateways[key]}));
                this.gateways = gateways.gateways;
            }
        );
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

        //window.open(this.gateways.interkassa.submit.url + '?' + params_array.join('&'), "_blank");
    }
}
