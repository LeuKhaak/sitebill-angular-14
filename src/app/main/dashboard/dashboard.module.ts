import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { DashboardComponent } from './dashboard.component';
import {SharedModule} from '../../shared.module';
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import {MatGridListModule} from "@angular/material/grid-list";

const routes = [
    {
        path     : '**',
        component: DashboardComponent
    }
];

@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        MatIconModule,
        MatOptionModule,
        MatSelectModule,
        MatGridListModule,
        SharedModule
    ],
})

export class DashboardModule
{
}
