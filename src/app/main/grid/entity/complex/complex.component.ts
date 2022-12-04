import {Component} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';
import {MatDialogConfig} from "@angular/material/dialog";
import {HouseSchemaComponent} from "../../../houseschema/house-schema.component";

@Component({
    selector: 'complex-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class ComplexComponent extends GridComponent {
    setup_apps() {
        this.entity.set_app_name('complex');
        this.entity.set_table_name('complex');
        this.entity.set_primary_key('complex_id');
        this.disable_wild_search = true;
        this.enable_building_blocks_button = true;

    }

    view(item_id: any) {
        //console.log('view');
        //console.log(item_id);
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '99vw';
        dialogConfig.maxWidth = '99vw';
        //dialogConfig.data = { app_name: this.entity.get_table_name(), primary_key: this.entity.primary_key, key_value: item_id };
        this.entity.set_key_value(item_id);
        dialogConfig.data = this.entity;
        //console.log(dialogConfig.data);
        dialogConfig.panelClass = 'form-ngrx-compose-dialog';

        this.dialog.open(HouseSchemaComponent, dialogConfig);
    }

}
