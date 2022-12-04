import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {fuseAnimations} from '../../../@fuse/animations';
import {FuseConfigService} from '../../../@fuse/services/config.service';
import {FuseTranslationLoaderService} from '../../../@fuse/services/translation-loader.service';
import {locale as english} from './i18n/en';
import {locale as russian} from './i18n/ru';
import {BillingService} from '../../_services/billing.service';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {LoginModalComponent} from '../../login/modal/login-modal.component';
import {ModelService} from '../../_services/model.service';
import {StorageService} from "../../_services/storage.service";
import {SnackService} from "../../_services/snack.service";

@Component({
    selector   : 'price',
    templateUrl: './price.component.html',
    styleUrls  : ['./price.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class PriceComponent
{
    public products: any;
    public currency_id: number = 1;
    private products_loaded: boolean;
    private loading_in_progress: boolean;
    public user_products_loaded: boolean;
    public user_products: { id: string; value: any }[];
    public total_active_products: number;
    public has_active_tariff: boolean;


    /**
     * Constructor
     *
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private billingSerivce: BillingService,
        protected router: Router,
        protected storageService: StorageService,
        protected dialog: MatDialog,
        public modelService: ModelService,
        protected _snackService: SnackService,
        protected cdr: ChangeDetectorRef
    )
    {
        this.loading_in_progress = false;
        this.has_active_tariff = false;
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

    }
    ngOnInit() {
        this.modelService.config_loaded_emitter.subscribe((result: any) => {
            console.log('price enable guest mode');
            this.modelService.enable_guest_mode();
        });
    }

    ngAfterViewChecked () {
        if ( this.modelService.all_checks_passes() && !this.products_loaded) {
            if ( !this.loading_in_progress ) {
                this.billingSerivce.get_products().subscribe(
                    (products: any) => {
                        this.products = Object.keys(products.records).map(key => ({type: key, value: products.records[key]}));
                        this.products_loaded = true;
                        this.check_user_tariff();
                        this.cdr.markForCheck();
                    }
                );
                this.loading_in_progress = true;
            }
        }
    }

    check_user_tariff () {
        this.billingSerivce.get_user_products().subscribe(
            (user_products: any) => {
                this.user_products_loaded = true;
                if (  user_products.records != null ) {
                    //console.log(user_products);
                    this.total_active_products = user_products.total_active_products;
                    const mapped = Object.keys(user_products.records).map(key => ({id: key, value: user_products.records[key]}));
                    //console.log(mapped);
                    //const active = mapped.filter(item => item);
                    mapped.forEach(item => {
                        if ( item.value.status.value === 'active' && item.value.billingcycle.value != 'once' ) {
                            this.has_active_tariff = true;
                        }
                    });
                    this.user_products = mapped;
                    //console.log(this.user_products);
                    this.cdr.markForCheck();
                }
            }
        );
    }


    login_modal () {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.panelClass = 'login-form';

        this.dialog.open(LoginModalComponent, dialogConfig);
    }


    add_to_cart(product) {
        if ( this.modelService.get_nobody_mode() ) {
            console.log('price login model');
            this.login_modal();
            return;
        }
        if ( this.has_active_tariff ) {
            this._snackService.message('У вас уже есть активный тариф');
        } else {
            this.storageService.setItem('cart_items', JSON.stringify(product));
            this.router.navigate(['/cart/buy/']);
        }

    }
}
