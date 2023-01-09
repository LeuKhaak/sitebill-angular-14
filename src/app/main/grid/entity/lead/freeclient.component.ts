import { Component, TemplateRef, ViewChild} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';
import { DeclineClientComponent } from 'app/dialogs/decline-client/decline-client.component';
import { MatDialogConfig } from '@angular/material/dialog';

@Component({
    selector: 'freeclient-grid',
    templateUrl: './myclient.component.html',
    styleUrls: ['../../grid.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class FreeClientComponent extends GridComponent {
    @ViewChild('controlTmpl') controlTmpl: TemplateRef<any>;
    @ViewChild('controlTmplMy') controlTmplMy: TemplateRef<any>;
    @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;

    setup_apps(): void {
        this.entity.set_app_name('freeclient');
        this.entity.set_table_name('client');
        this.entity.primary_key = 'client_id';
        this.entity.set_default_params({ user_id: 0 });
        this.disable_view_button = true;

        this.enable_date_range('date');

        // this.table_index_params[0] = { user_id: 0 };
        this.define_grid_params({ user_id: 0 });

        const grid_fields = ['user_id', 'date', 'type_id', 'src_page', 'fio'];
        this.define_grid_fields(grid_fields);
        // this.refresh();

        // this.add_my_tab();

    }

    get_control_column(): {[index: string]: any} {
        const cellTemplate = this.controlTmpl;
        // if (table_index == 1) {
        //    cellTemplate = this.controlTmplMy;
        // }

        const control_column = {
            headerTemplate: this.commonTemplate.controlHdrTmpl,
            cellTemplate: cellTemplate,
            width: 40,
            type: 'primary_key',
            ngx_name: this.entity.primary_key + '.title',
            model_name: this.entity.primary_key,
            title: '',
            prop: this.entity.primary_key + '.value'
        };
        return control_column;

    }

    get_header_template(): TemplateRef<any> {
        return this.hdrTpl;
    }


    toggleUserGet(event): void {
        // console.log(event);       
        const value = event[this.entity.primary_key].value;
        const ql_items = {};

        ql_items['user_id'] = this.getSessionKeyService.get_user_id();

        this.modelService.update_only_ql(this.entity.get_table_name(), value, ql_items)
            .subscribe((response: any) => {
                if (response.state === 'error') {
                    this._snackService.message(response.message);
                } else {
                    this.refresh();
                }
            });
    }

    declineClient(row): void {
        // console.log('user_id');
        // console.log(row.client_id.value);

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        // dialogConfig.width = '100%';
        // dialogConfig.height = '100%';
        dialogConfig.autoFocus = true;
        dialogConfig.data = { app_name: this.entity.get_table_name(), primary_key: 'client_id', key_value: row.client_id.value };

        const dialogRef = this.dialog.open(DeclineClientComponent, dialogConfig);
        dialogRef.afterClosed()
            .subscribe(() => {
                this.refresh();
            });
        return;
    }



}
