import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {HouseSchemaComponent} from "./house-schema.component";
import {HouseSchemaBuilderComponent} from "./builder/house-schema-builder.component";
import {HouseSchemaService} from "./services/houseschema.service";
import {HouseSchemaBuilderModalComponent} from "./builder/modal/house-schema-builder-modal.component";
import {TranslateModule} from "@ngx-translate/core";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {FuseWidgetModule} from "../../../@fuse/components";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {ReactiveFormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatRadioModule} from "@angular/material/radio";
import {MatCardModule} from "@angular/material/card";
import {MatSliderModule} from "@angular/material/slider";
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
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatBadgeModule} from "@angular/material/badge";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {NgxDaterangepickerMd} from "ngx-daterangepicker-material";
import {NgSelectModule} from "@ng-select/ng-select";
import {Ng5SliderModule} from "ng5-slider";
import {FuseSharedModule} from "../../../@fuse/shared.module";
import {QuillModule} from "ngx-quill";
import {NgxUploaderModule} from "ngx-uploader";
import {NgxGalleryModule} from "ngx-gallery-9";
import {LabelSelectorComponent} from "./builder/modal/label-selector/label-selector.component";

const bundle = [
    HouseSchemaComponent,
    HouseSchemaBuilderComponent,
    HouseSchemaBuilderModalComponent,
    LabelSelectorComponent
];

@NgModule({
    declarations: [...bundle],
    imports     : [
        CommonModule,
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
        NgxUploaderModule,
        NgxGalleryModule,

    ],
    exports: [...bundle],
    providers: [
        HouseSchemaService,
    ],
    entryComponents: [...bundle]

})

export class HouseSchemaModule
{
}
