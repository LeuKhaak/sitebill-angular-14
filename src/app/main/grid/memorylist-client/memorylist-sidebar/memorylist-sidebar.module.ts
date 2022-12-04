import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import {MemorylistSidebarComponent} from "./memorylist-sidebar.component";
import {SharedModule} from "../../../../shared.module";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";

@NgModule({
    declarations: [
        MemorylistSidebarComponent
    ],
    exports: [
        MemorylistSidebarComponent
    ],
    imports: [
        TranslateModule,
        FuseSharedModule,
        SharedModule,
        MatIconModule,
        RouterModule
    ]
})

export class MemorylistSidebarModule
{
}
