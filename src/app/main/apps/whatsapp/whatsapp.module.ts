import { NgModule } from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {FlexModule} from "@angular/flex-layout";
import {NgxUploaderModule} from "ngx-uploader";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {WhatsAppChatComponent} from "./whatsapp-chat/whatsapp-chat.component";
import {WhatsAppService} from "./whatsapp.service";
import { DialogComponent } from './whatsapp-chat/dialog/dialog.component';
import { WhatsappModalComponent } from './whatsapp-modal/whatsapp-modal.component';
import {AttachModalComponent} from "./whatsapp-chat/dialog/attach-modal/attach-modal.component";
import {SharedModule} from "../../../shared.module";
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import { ContactsListComponent } from './whatsapp-chat/dialog/contacts-list/contacts-list.component';
import {detect_dev_mode} from "../../../_helpers/env";
import {AttachEntityModalComponent} from "./whatsapp-chat/dialog/attach-entity-modal/attach-entity-modal.component";
import {GridModule} from "../../grid/grid.module";
import {ReportModalComponent} from "./report-modal/report-modal.component";
import { ClientCardComponent } from './report-modal/client-card/client-card.component';
import { StatCardComponent } from './report-modal/stat-card/stat-card.component';

let config: SocketIoConfig = { url: 'https://whatsapp.sitebill.site', options: {} };
if ( detect_dev_mode() ) {
    config = { url: 'http://localhost:3002', options: {} };
}

@NgModule({
    declarations: [
        WhatsAppChatComponent,
        DialogComponent,
        AttachModalComponent,
        AttachEntityModalComponent,
        WhatsappModalComponent,
        ContactsListComponent,
        ReportModalComponent,
        ClientCardComponent,
        StatCardComponent
    ],
    exports: [
        WhatsAppChatComponent,
        ClientCardComponent,
        StatCardComponent
    ],
    imports: [
        MatIconModule,
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        FlexModule,
        NgxUploaderModule,
        NgxDatatableModule,
        NgSelectModule,
        FormsModule,
        MatInputModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        SharedModule,
        ReactiveFormsModule,
        //SocketIoModule.forRoot(config),
        GridModule,
    ],
    providers: [
        WhatsAppService
    ],
    entryComponents: [
    ]
})

export class WhatsAppModule
{
}
