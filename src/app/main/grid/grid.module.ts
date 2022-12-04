import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { ConfirmDialogModule } from 'app/dialogs/confirm/confirm.module';
import { ChatService } from 'app/main/apps/chat/chat.service';
import { SnackService } from 'app/_services/snack.service';

import { GridComponent } from './grid.component';
import { DataComponent } from './data/data.component';
import { NewsComponent } from './news/news.component';
import { CountryComponent } from './entity/country/country.component';
import { MyClientComponent } from './entity/lead/myclient.component';
import { FreeClientComponent } from './entity/lead/freeclient.component';
import { LeadComponent } from './entity/lead/lead.component';
import { RegionComponent } from './entity/region/region.component';
import { FilterService } from 'app/_services/filter.service';
import { FilterComponent } from 'app/main/grid/filter.component';
import { DeclineClientComponent } from 'app/dialogs//decline-client/decline-client.component';
import { GridSettingsSidenavComponent } from 'app/main/grid/sidenavs/settings/settings.component';
import { CommonTemplateComponent } from 'app/main/grid/common-template/common-template.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';

import { NgxUploaderModule } from 'ngx-uploader';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { Ng5SliderModule } from 'ng5-slider';
import { ReplacePipe } from 'app/pipes/replace.pipe';
import { UserComponent } from './user/user.component';
import { AgmCoreModule } from '@agm/core';
import { CityComponent } from './entity/city/city.component';
import { DistrictComponent } from './entity/district/district.component';
import { MetroComponent } from './entity/metro/metro.component';
import { StreetComponent } from './entity/street/street.component';
import { GroupComponent } from './entity/group/group.component';
import { ComponentComponent } from './entity/component/component.component';
import { FunctionComponent } from './entity/function/function.component';
import { PageComponent } from './entity/page/page.component';
import { MenuComponent } from './entity/menu/menu.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { CollectionsComponent } from '../collections/collections.component';
import {MemoryListComponent} from '../collections/memorylist.component';
import {FrontComponent} from './entity/front/front.component';
import {SaleComponent} from './entity/front/sale.component';

import {SbCalendarModule} from '../sb-calendar/sb-calendar.module';
import {ReactiveFormsModule} from '@angular/forms';
import {ComposeModalComponent} from './compose-modal/compose-modal.component';
import {ParserComponent} from './entity/parser/parser.component';
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatRadioModule} from "@angular/material/radio";
import {MatSliderModule} from "@angular/material/slider";
import {MatCardModule} from "@angular/material/card";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatMenuModule} from "@angular/material/menu";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatDividerModule} from "@angular/material/divider";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatTabsModule} from "@angular/material/tabs";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatBadgeModule} from "@angular/material/badge";
import {MAT_DATE_LOCALE} from "@angular/material/core";
import {ReportComponent} from "../../dialogs/report/report.component";
import {SaveSearchComponent} from "../../dialogs/save-search/save-search.component";
import {MysearchComponent} from "./entity/mysearch/mysearch.component";
import {EmailsComponent} from "./entity/emails/emails.component";
import {MyGridClientComponent} from "./entity/mygridclient/mygridclient.component";
import {SharedModule} from "../../shared.module";
import {RealtyItemComponent} from "../houseschema/realty-item/realty-item.component";
import {SearchStringParserTestComponent} from "./search-string-parser/test/search-string-parser-test.component";
import {ComplexComponent} from "./entity/complex/complex.component";
import {HouseSchemaModule} from "../houseschema/house-schema.module";
import {HouseSchemaComponent} from "../houseschema/house-schema.component";
import {HouseSchemaBuilderComponent} from "../houseschema/builder/house-schema-builder.component";
import {ShareModalComponent} from "./share-modal/share-modal.component";
import {GroupTemplateComponent} from "./group-template/group-template.component";
import {CollectionModalComponent} from "./collection-modal/collection-modal.component";
import {FavoritesComponent} from "./entity/favorites/favorites";
import {CoworkerModalComponent} from "./coworker-modal/coworker-modal.component";
import {CoworkComponent} from "./entity/cowork/cowork.component";
import {BuildingBlocksComponent} from "./entity/building-blocks/building-blocks.component";
import {BuildingBlocksModalComponent} from "./building-blocks-modal/building-blocks-modal.component";
import {ClientComponent} from "./entity/client/client.component";
import {AutoResolverComponent} from "./entity/autoresolver/auto-resolver.component";
import {CloudTestimonialsComponent} from "./entity/cloud/testimonials/cloud-testimonials.component";
import {TestimonialsModalComponent} from "./testimonials-modal/testimonials-modal.component";
import {AutoResolverFormComponent} from "./entity/autoresolver/form/auto-resolver-form.component";
import {MessagesComponent} from "./entity/messages/messages.component";
import {MessagesReportComponent} from "./entity/messages-report/messages-report.component";
import { SummaryReportComponent } from './entity/messages-report/summary-report/summary-report.component';

const routes = [
    {
        path     : 'data',
        component: DataComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path     : 'parser',
        component: ParserComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path        : 'favorites',
        loadChildren: () => import('app/main/grid/memorylist-client/memorylist-client.module').then(m => m.MemorylistClientModule),
    },
    {
        path     : 'data/:params_filter',
        component: DataComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'news',
        component: NewsComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'page',
        component: PageComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'menu',
        component: MenuComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'country',
        component: CountryComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'region',
        component: RegionComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'city',
        component: CityComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'district',
        component: DistrictComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'metro',
        component: MetroComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'messages',
        component: MessagesComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'street',
        component: StreetComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'user',
        component: UserComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'group',
        component: GroupComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'component',
        component: ComponentComponent,
        resolve: {
            chat: ChatService
        }

    },
    {
        path: 'function',
        component: FunctionComponent,
        resolve: {
            chat: ChatService
        }

    },

    {
        path: 'client',
        component: GridComponent,
        resolve: {
            chat: ChatService
        },
    },
    {
        path: 'collections',
        component: CollectionsComponent,
        resolve: {
            chat: ChatService
        },
    },
    {
        path: 'lead',
        component: LeadComponent,
        resolve: {
            chat: ChatService
        },
    },
    {
        path: 'leadr',
        component: LeadComponent,
        resolve: {
            chat: ChatService
        },
    },
    {
        path: 'front',
        component: FrontComponent,
        resolve: {
            chat: ChatService
        },
    },
    {
        path: 'emails',
        component: EmailsComponent,
        resolve: {
            chat: ChatService
        },
    },
    {
        path: 'mysearch',
        component: MysearchComponent,
        resolve: {
            chat: ChatService
        },
    },
    {
        path: 'myclient',
        component: MyGridClientComponent,
        resolve: {
            chat: ChatService
        },
    },
    {
        path: 'complex',
        component: ComplexComponent,
        resolve: {
            chat: ChatService
        },
    },
    {
        path: 'houseschema',
        component: HouseSchemaComponent,
        resolve: {
            chat: ChatService
        },
    },
    {
        path: 'houseschemabuilder',
        component: HouseSchemaBuilderComponent,
        resolve: {
            chat: ChatService
        },
    },
    {
        path: 'testparser',
        component: SearchStringParserTestComponent,
        resolve: {
            chat: ChatService
        },
    },
    {
        path: 'grouptemplate',
        component: GroupTemplateComponent,
        resolve: {
            chat: ChatService
        },
    },
];

@NgModule({
    declarations: [
        GridComponent,
        DataComponent,
        NewsComponent,
        MyClientComponent,
        FreeClientComponent,
        LeadComponent,
        MenuComponent,
        PageComponent,
        CountryComponent,
        RegionComponent,
        CityComponent,
        DistrictComponent,
        MetroComponent,
        MessagesComponent,
        MessagesReportComponent,
        StreetComponent,
        GroupComponent,
        ComponentComponent,
        FunctionComponent,
        UserComponent,
        CoworkComponent,
        BuildingBlocksComponent,
        ClientComponent,
        AutoResolverComponent,
        AutoResolverFormComponent,
        CloudTestimonialsComponent,

        FilterComponent,
        DeclineClientComponent,
        ReportComponent,
        SaveSearchComponent,
        GridSettingsSidenavComponent,
        ReplacePipe,
        CommonTemplateComponent,
        CollectionsComponent,
        MemoryListComponent,
        FrontComponent,
        SaleComponent,
        ComposeModalComponent,
        ParserComponent,
        MysearchComponent,
        EmailsComponent,
        MyGridClientComponent,
        RealtyItemComponent,
        SearchStringParserTestComponent,
        ComplexComponent,
        ShareModalComponent,
        CollectionModalComponent,
        CoworkerModalComponent,
        TestimonialsModalComponent,
        BuildingBlocksModalComponent,
        GroupTemplateComponent,
        FavoritesComponent,
        SummaryReportComponent,
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,
        // Material moment date module
        MatMomentDateModule,
        NgxDatatableModule,
        FuseWidgetModule,

        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatTooltipModule,
        MatToolbarModule,
        MatRadioModule,
        MatCardModule,
        MatSliderModule,
        MatAutocompleteModule,
        MatSnackBarModule,
        MatMenuModule,


        // Material
        MatButtonModule,
        MatCheckboxModule,
        MatGridListModule,
        MatDividerModule,
        MatFormFieldModule,
        MatSelectModule,
        MatTableModule,
        MatTabsModule,
        MatDialogModule,
        MatDatepickerModule,
        MatProgressSpinnerModule,
        MatButtonToggleModule,
        MatBadgeModule,
        NgxMaterialTimepickerModule,
        NgxDaterangepickerMd.forRoot(),
        NgSelectModule,
        Ng5SliderModule,

        FuseSharedModule,
        QuillModule.forRoot(),
        NgxUploaderModule,
        NgxGalleryModule,
        ConfirmDialogModule,
        DragDropModule,
        SharedModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDRh-zcFa78SH-njTu5V6-zrvfIsgqTJPQ'
        }),

        SbCalendarModule,
        HouseSchemaModule,
    ],
    exports: [
        NgxUploaderModule,
        FavoritesComponent,
        CoworkComponent,
        BuildingBlocksComponent,
        DataComponent,
        CityComponent,
        ClientComponent,
        AutoResolverComponent,
        CloudTestimonialsComponent,
        FrontComponent,
        UserComponent,
        AutoResolverFormComponent,
        MessagesComponent,
        MessagesReportComponent,
        SummaryReportComponent,
    ],
    providers: [
        FilterService,
        CommonTemplateComponent,
        SnackService,
        { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    ],
    entryComponents: [
        DeclineClientComponent,
        CommonTemplateComponent,
        ComposeModalComponent,
        ReportComponent,
        SaveSearchComponent,
        RealtyItemComponent,
        MessagesComponent,
        MessagesReportComponent,
    ]

})

export class GridModule
{
}
