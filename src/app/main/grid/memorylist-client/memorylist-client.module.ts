import { NgModule } from '@angular/core';
import {RouterModule} from "@angular/router";
import {MemorylistSidebarModule} from "./memorylist-sidebar/memorylist-sidebar.module";
import {MemorylistClientComponent} from "./memorylist-client.component";
import {GridModule} from "../grid.module";
import {SharedModule} from "../../../shared.module";

const routes = [
    {
        path     : ':memorylist_id',
        component: MemorylistClientComponent,
    },
    {
        path     : '**',
        component: MemorylistClientComponent,
    },
];

@NgModule({
    declarations: [
        MemorylistClientComponent
    ],
    exports: [
    ],
    imports: [
        RouterModule.forChild(routes),
        MemorylistSidebarModule,
        GridModule,
        SharedModule
    ],
    providers: [
    ],
    entryComponents: [
    ]
})

export class MemorylistClientModule
{
}
