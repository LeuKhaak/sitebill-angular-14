import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { ProfileComponent } from './profile.component';
import {BillingService} from '../../_services/billing.service';
import {SharedModule} from '../../shared.module';
import {MatIconModule} from "@angular/material/icon";
import {MatGridListModule} from "@angular/material/grid-list";

const routes = [
    {
        path     : 'profile',
        component: ProfileComponent
    }
];

@NgModule({
    declarations: [
        ProfileComponent,
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        MatIconModule,
        MatGridListModule,
        SharedModule,
    ],
    exports: [
        ProfileComponent
    ],
    providers: [
        BillingService
    ]
})

export class ProfileModule
{
}
