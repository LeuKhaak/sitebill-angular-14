import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';
import {MatDialogConfig} from "@angular/material/dialog";


@Component({
    selector: 'data-grid',
    templateUrl: '../grid.component.html',
    styleUrls: ['../grid.component.scss'],
    animations: fuseAnimations
})
export class DataComponent extends GridComponent {
    @Input('default_params')
    default_params = {};

    setup_apps() {
        this.entity.set_app_name('data');
        this.entity.set_table_name('data');
        this.entity.primary_key = 'id';
        if ( this.modelService.getConfigValue('apps.mailbox.use_complaint_mode') === '1' ) {
            this.complaint_mode = true;
        }
        this.switch_collections(true);
        this.enable_date_range('date_added');
        this.enable_coworker_button = true;
        if ( this.default_params ) {
            this.entity.set_default_params(this.default_params);
        }
    }

    edit_form(item_id: any) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        //dialogConfig.width = '99vw';
        dialogConfig.minWidth = '85vw';
        //dialogConfig.height = '99vh';

        //dialogConfig.data = { app_name: this.entity.get_table_name(), primary_key: this.entity.primary_key, key_value: item_id };
        this.entity.set_key_value(item_id);
        if (this.only_collections) {
            this.entity.set_hook('add_to_collections');
        }
        dialogConfig.data = this.entity;
        dialogConfig.panelClass = 'regular-modal';
        if ( this.modelService.getConfigValue('apps.products.limit_add_data') === '1') {
            this.billingService.get_user_limit('exclusive').subscribe(
                (limit: any) => {
                    if ( limit.data > 0 ) {
                        this.open_form_with_check_access(dialogConfig);
                        //this.dialog.open(SelectionFormComponent, dialogConfig);
                    } else {
                        this._snackService.message('Закончился лимит добавления эксклюзивных вариантов', 5000);
                    }
                }
            );
        } else {
            this.open_form_with_check_access(dialogConfig);
            //this.dialog.open(SelectionFormComponent, dialogConfig);
        }

    }

    getRowClass(row): string {
        return '';
        try {
            if (row['id'].collections != null) {
                return 'green-100-bg';
            }
        } catch {
        }

        try {
            if (row.active.value != 1) {
                return 'red-100-bg';
            }
            if (row.hot.value == 1) {
                return 'amber-100-bg';
            }
        } catch {
        }

        try {
            if (row.complaint_id.value !== '0') {
                return 'pink-100-bg';
            }
        } catch {
        }

    }

}
