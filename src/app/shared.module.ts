import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RegisterModalComponent} from './login/register-modal/register-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FuseSharedModule} from '../@fuse/shared.module';
import {LoginModalComponent} from './login/modal/login-modal.component';
import {RouterModule} from '@angular/router';
import {FormComponent} from './main/grid/form/form.component';
import {GalleryModalComponent} from './main/gallery/modal/gallery-modal.component';
import {NgxDaterangepickerMd} from 'ngx-daterangepicker-material';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {NgxGalleryModule} from 'ngx-gallery-9';
import {NgxUploaderModule} from 'ngx-uploader';
import {UploaderComponent} from './main/uploader/uploader.component';
import {GalleryComponent} from './main/gallery/gallery.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {QuillModule} from 'ngx-quill';
import {AgmCoreModule} from '@agm/core';
import {SbCalendarModule} from './main/sb-calendar/sb-calendar.module';
import {FuseWidgetModule} from '../@fuse/components';
import {ViewModalComponent} from './main/grid/view-modal/view-modal.component';
import {ProfileTimelineComponent} from './main/grid/timeline/timeline.component';
import {ChatComponent} from './main/apps/chat/chat.component';
import {ChatViewComponent} from './main/apps/chat/chat-view/chat-view.component';
import {ChatStartComponent} from './main/apps/chat/chat-start/chat-start.component';
import {ChatChatsSidenavComponent} from './main/apps/chat/sidenavs/left/chats/chats.component';
import {ChatUserSidenavComponent} from './main/apps/chat/sidenavs/left/user/user.component';
import {ChatLeftSidenavComponent} from './main/apps/chat/sidenavs/left/left.component';
import {ChatRightSidenavComponent} from './main/apps/chat/sidenavs/right/right.component';
import {ChatContactSidenavComponent} from './main/apps/chat/sidenavs/right/contact/contact.component';
import {ChatService} from './main/apps/chat/chat.service';
import {TranslateModule} from '@ngx-translate/core';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {Ng5SliderModule} from 'ng5-slider';
import {ConfirmDialogModule} from './dialogs/confirm/confirm.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CourseDialogComponent} from './course-dialog/course-dialog.component';
import {FormConstructorComponent} from './main/grid/form/form-constructor.component';
import {FormStaticComponent} from './main/grid/form/form-static.component';
import {Bitrix24Service} from './integrations/bitrix24/bitrix24.service';
import {ViewStaticComponent} from './main/grid/view-modal/view-static.component';
import {BillingService} from './_services/billing.service';
import {ProfileCardComponent} from './main/profile/card/profile-card.component';
import {GatewaysComponent} from './main/gateways/gateways.component';
import {GatewaysModalComponent} from './main/gateways/modal/gateways-modal.component';
import {RemindModalComponent} from './login/remind-modal/remind-modal.component';
import {UserProfileComponent} from './main/grid/entity/user-profile/user-profile.component';
import {ContactInjectorComponent} from './main/grid/entity/contact-injector/contact-injector.component';
import {RegisterDomainModalComponent} from './login/register-domain-modal/register-domain-modal.component';
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatRadioModule} from "@angular/material/radio";
import {MAT_DATE_LOCALE, MatOptionModule} from "@angular/material/core";
import {MatCardModule} from "@angular/material/card";
import {MatSliderModule} from "@angular/material/slider";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDividerModule} from "@angular/material/divider";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatBadgeModule} from "@angular/material/badge";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTabsModule} from "@angular/material/tabs";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {StorageService} from "./_services/storage.service";
import {DemoBannerComponent} from "./dialogs/demo-banner/demo-banner.component";
import {SearchStringParserComponent} from "./main/grid/search-string-parser/search-string-parser.component";
import {HouseSchemaModule} from "./main/houseschema/house-schema.module";
import {StringParserService} from "./_services/string-parser.service";
import {EntityStorageService} from "./_services/entity-storage.service";
import {LoginStandaloneComponent} from "./login/standalone/login/login-standalone.component";
import {ConfigComponent} from "./main/config/config.component";
import {MatListModule} from "@angular/material/list";
import {ConfigFormComponent} from "./main/config/config-form/config-form.component";
import {JsonEditorComponent} from "./main/apps/json-editor/json-editor.component";
import {ExcelModule} from "./main/apps/excel/excel.module";
import {MessagesService} from "./_services/messages.service";
import {CommentsComponent} from "./main/grid/comments/comments.component";
import {ConfigModalComponent} from "./main/config/modal/config-modal.component";
import {SelectionFormComponent} from './main/apps/selection/selection-form.component';
import {SelectionFormConstructorComponent} from './main/apps/selection/selection-form-constructor.component';
import {SelectionFormStaticComponent} from './main/apps/selection/selection-form-static.component';
import {IntervalComponent} from './main/apps/interval/interval.component';
import {FromToComponent} from './main/apps/selection/from-to/from-to.component';
import {SelectionFilterComponent} from "./main/apps/selection/selection-filter/selection-filter.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatIconModule,
        ReactiveFormsModule,
        MatSidenavModule,
        MatTooltipModule,
        MatToolbarModule,
        MatRadioModule,
        MatOptionModule,
        MatCardModule,
        MatSliderModule,
        MatAutocompleteModule,
        MatSnackBarModule,
        MatMenuModule,
        TranslateModule,
        // Material moment date module
        MatMomentDateModule,
        NgxDatatableModule,
        FuseWidgetModule,

        // Material
        MatButtonModule,
        MatCheckboxModule,
        MatGridListModule,
        MatDividerModule,
        MatFormFieldModule,
        MatSelectModule,
        MatTableModule,
        MatDialogModule,
        MatButtonToggleModule,
        MatBadgeModule,
        MatProgressBarModule,
        Ng5SliderModule,

        ConfirmDialogModule,
        DragDropModule,


        MatProgressSpinnerModule,
        FuseSharedModule,
        RouterModule,
        MatToolbarModule,
        MatTabsModule,
        MatExpansionModule,
        MatDatepickerModule,
        NgxDaterangepickerMd.forRoot(),
        NgxMaterialTimepickerModule,
        NgxGalleryModule,
        NgxUploaderModule,
        NgSelectModule,
        QuillModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDRh-zcFa78SH-njTu5V6-zrvfIsgqTJPQ'
        }),
        SbCalendarModule,
        FuseWidgetModule,
        HouseSchemaModule,
        MatListModule,
        ExcelModule
    ],
    declarations: [
        RegisterDomainModalComponent,
        RegisterModalComponent,
        RemindModalComponent,
        LoginModalComponent,
        FormComponent,
        FormConstructorComponent,
        FormStaticComponent,
        SelectionFormComponent,
        SelectionFormConstructorComponent,
        SelectionFormStaticComponent,
        IntervalComponent,
        FromToComponent,
        ViewStaticComponent,
        UploaderComponent,
        GalleryComponent,
        GalleryModalComponent,
        ViewModalComponent,
        ProfileTimelineComponent,
        ChatComponent,
        ChatViewComponent,
        ChatStartComponent,
        ChatChatsSidenavComponent,
        ChatUserSidenavComponent,
        ChatLeftSidenavComponent,
        ChatRightSidenavComponent,
        ChatContactSidenavComponent,
        CourseDialogComponent,
        ProfileCardComponent,
        GatewaysComponent,
        GatewaysModalComponent,
        UserProfileComponent,
        ContactInjectorComponent,
        DemoBannerComponent,
        SearchStringParserComponent,
        LoginStandaloneComponent,
        ConfigComponent,
        ConfigModalComponent,
        ConfigFormComponent,
        CommentsComponent,
        JsonEditorComponent,
        SelectionFilterComponent
    ],
    providers: [
        ChatService,
        Bitrix24Service,
        BillingService,
        StorageService,
        StringParserService,
        EntityStorageService,
        MessagesService,
        { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    ],
    exports: [
        RegisterDomainModalComponent,
        RegisterModalComponent,
        RemindModalComponent,
        NgxUploaderModule,
        FormComponent,
        FormStaticComponent,
        SelectionFormComponent,
        SelectionFormStaticComponent,
        IntervalComponent,
        FromToComponent,
        ViewStaticComponent,
        ProfileTimelineComponent,
        ProfileCardComponent,
        GatewaysComponent,
        SearchStringParserComponent,
        LoginModalComponent,
        LoginStandaloneComponent,
        ConfigComponent,
        ConfigModalComponent,
        ConfigFormComponent,
        JsonEditorComponent,
        UploaderComponent,
        CommentsComponent,
        GalleryComponent,
        ViewModalComponent
    ],
    entryComponents: [
        LoginModalComponent,
        FormComponent,
        GalleryModalComponent,
        ViewModalComponent,
        CourseDialogComponent,
        ConfigModalComponent,
        FormStaticComponent,
        ViewStaticComponent,
        ProfileCardComponent,
        GatewaysComponent,
        GatewaysModalComponent,
        DemoBannerComponent,
        SearchStringParserComponent,
        ConfigFormComponent,
        CommentsComponent,
        JsonEditorComponent
    ]

})
export class SharedModule {

}
