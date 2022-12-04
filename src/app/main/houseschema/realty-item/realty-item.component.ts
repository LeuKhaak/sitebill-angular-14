import {Component, Input} from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';
import {Realty} from "../../../_models/realty";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ViewModalComponent} from "../../grid/view-modal/view-modal.component";
import {SitebillEntity, SitebillModelItem} from "../../../_models";
import {takeUntil} from "rxjs/operators";

@Component({
    selector   : 'realty-item',
    templateUrl: './realty-item.component.html',
    styleUrls  : ['./realty-item.component.scss']
})
export class RealtyItemComponent
{
    @Input('realty_item')
    realty_item: Realty;

    entity: SitebillEntity;


    /**
     * Constructor
     *
     */
    constructor(
        private modelService: ModelService,
        protected dialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
    }
    ngOnInit() {
        this.entity = new SitebillEntity();

        this.entity.set_app_name('data');
        this.entity.set_table_name('data');
        this.entity.set_primary_key('id');
        this.entity.set_key_value(this.realty_item.get_id());
        this.load_realty();

    }

    load_realty() {
        this.modelService.loadById(this.entity.get_table_name(), this.entity.get_primary_key(), this.entity.get_key_value())
            .subscribe((result: any) => {
                if (result) {
                    this.entity.model = this.modelService.map_model(result.data);
                }
            });
    }

    view(item_id: any) {
        //console.log('view');
        //console.log(item_id);
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '99vw';
        dialogConfig.maxWidth = '99vw';

        const entity = new SitebillEntity();

        entity.set_app_name('data');
        entity.set_table_name('data');
        entity.set_primary_key('id');
        entity.set_key_value(item_id);

        dialogConfig.data = entity;
        //console.log(dialogConfig.data);
        dialogConfig.panelClass = 'form-ngrx-compose-dialog';

        this.dialog.open(ViewModalComponent, dialogConfig);
    }

}
