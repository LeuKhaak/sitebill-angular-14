import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, ViewEncapsulation} from '@angular/core';
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
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {LoginModalComponent} from '../../login/modal/login-modal.component';
import {GatewaysModalComponent} from '../gateways/modal/gateways-modal.component';

@Component({
    selector   : 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls  : ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations   : fuseAnimations
})
export class DashboardComponent
{
    username: string;
    public invoices:  { id: string; value: any }[];
    public user_products: { id: string; value: any }[];
    public user_products_loaded: boolean;
    public invoices_loaded: boolean;
    public total_active_products: number;
    public exclusive_limit: any;
    /**
     * Constructor
     *
     */
    constructor(
        private _httpClient: HttpClient,
        private elRef: ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        public modelService: ModelService,
        protected dialog: MatDialog,
        private billingService: BillingService,
        private _fuseConfigService: FuseConfigService,
        @Inject(APP_CONFIG) private config: AppConfig,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        protected cdr: ChangeDetectorRef
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
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
    ngOnInit() {
        this.username = 'test';
        this.load_invoices();
        this.load_user_products();
        this.load_user_limits();
    }

    load_invoices () {
        this.billingService.get_invoices().subscribe(
            (invoices: any) => {
                this.invoices_loaded = true;
                const mapped = Object.keys(invoices).map(key => ({id: key, value: invoices[key]}));
                this.invoices = mapped;
                this.cdr.markForCheck();

                if ( invoices.length > 0 ) {
                }
            }
        );
    }

    load_user_limits () {
        if ( this.modelService.getConfigValue('apps.products.limit_add_data') === '1') {
            this.billingService.get_user_limit('exclusive').subscribe(
                (limit: any) => {
                    this.exclusive_limit =  limit.data;
                    console.log(limit);
                    this.cdr.markForCheck();
                }
            );
        }
    }

    load_user_products () {
        this.billingService.get_user_products().subscribe(
            (user_products: any) => {
                this.user_products_loaded = true;
                if (  user_products.records != null ) {
                    // console.log(user_products);
                    this.total_active_products = user_products.total_active_products;
                    const mapped = Object.keys(user_products.records).map(key => ({id: key, value: user_products.records[key]}));
                    this.user_products = mapped;
                    this.cdr.markForCheck();
                }
            }
        );
    }

    pay_invoice(invoice: any) {
        console.log(invoice);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {invoice: invoice};

        this.dialog.open(GatewaysModalComponent, dialogConfig);

    }
}
