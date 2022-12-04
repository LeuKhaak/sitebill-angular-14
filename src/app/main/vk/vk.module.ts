import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { VkComponent } from './vk.component';

const routes = [
    {
        path     : '**',
        component: VkComponent
    }
];

@NgModule({
    declarations: [
        VkComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule
    ]
})

export class VkModule
{
}
