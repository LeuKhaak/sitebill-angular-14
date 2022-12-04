import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { CartComponent } from './cart.component';
import {BillingService} from '../../_services/billing.service';
import {SharedModule} from '../../shared.module';
import {MatIconModule} from "@angular/material/icon";
import {MatGridListModule} from "@angular/material/grid-list";

const routes = [
    {
        path     : '**',
        component: CartComponent
    }
];

@NgModule({
    declarations: [
        CartComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        MatIconModule,
        MatGridListModule,
        SharedModule,
    ],
    providers: [
        BillingService
    ]
})

export class CartModule
{
}
