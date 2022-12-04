import {Component, Input} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';
import {MatDialogConfig} from "@angular/material/dialog";
import {takeUntil} from "rxjs/operators";
import {SitebillEntity} from "../../../../_models";
import {ReportType} from "../../../apps/whatsapp/types/whatsapp.types";

@Component({
    selector: 'messages-report-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    animations: fuseAnimations
})
export class MessagesReportComponent extends GridComponent {

    @Input('report_type')
    report_type: number;

    @Input('client_id')
    client_id: number;

    @Input('data_id')
    data_id: number;

    setup_apps() {
        if ( this.report_type == ReportType.data ) {
            this.setup_data_report();
        } else if ( this.report_type == ReportType.client ) {
            this.setup_client_report();
        } else {
            this.setup_summary_report();
        }

        this.entity.primary_key = 'message_id';
        this.enable_select_rows = false;
        this.disable_add_button = true;
        this.disable_delete_button = true;
        //this.disable_edit_button = true;
        this.disable_header = false;
        this.disable_view_button = true;
    }

    setup_summary_report () {
        this.entity.set_app_name('messages_summary_report');
        this.entity.set_table_name('messages_summary_report');

        const default_columns_list = [
            'client_id',
            'data_id',
            'company',
            'fio',
            'phone',
            'address',
            'square_all',
            'cost_meter_per_month4rent',
            'created_at',
            'status_id',
            'comment_text'
        ];
        this.define_grid_fields(default_columns_list);
    }

    setup_data_report () {
        this.entity.set_app_name('messages_data_report');
        this.entity.set_table_name('messages_data_report');

        const default_columns_list = [
            'client_id',
            'company',
            'fio',
            'phone',
            'created_at',
            'status_id',
            'comment_text'
        ];
        this.define_grid_fields(default_columns_list);
        if ( this.data_id ) {
            this.entity.set_default_params({data_id: this.data_id});
        }
    }

    setup_client_report () {
        this.entity.set_app_name('messages_client_report');
        this.entity.set_table_name('messages_client_report');

        const default_columns_list = [
            'data_id',
            'address',
            'square_all',
            'cost_meter_per_month4rent',
            'created_at',
            'status_id',
            'comment_text'
        ];
        this.define_grid_fields(default_columns_list);
        if ( this.client_id ) {
            this.entity.set_default_params({client_id: this.client_id});
        }
    }

    edit_form(item_id: any) {
        this.modelService.loadById(this.entity.get_table_name(), this.entity.get_primary_key(), item_id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result && result.data.deal_id.value) {
                    const dialogConfig = new MatDialogConfig();

                    const deal_entity = new SitebillEntity();
                    deal_entity.set_app_name('deal')
                    deal_entity.set_table_name('deal')
                    deal_entity.set_primary_key('deal_id')
                    deal_entity.set_key_value(result.data.deal_id.value)
                    deal_entity.disable_delete()
                    deal_entity.set_hidden('created_at')
                    deal_entity.set_hidden('message_id')
                    deal_entity.set_hidden('deal_id')
                    deal_entity.set_hidden('alarm_at')


                    dialogConfig.disableClose = false;
                    dialogConfig.autoFocus = true;
                    dialogConfig.data = deal_entity;
                    dialogConfig.panelClass = 'regular-modal';
                    const modalRef = this.open_form_with_check_access(dialogConfig);
                    if ( modalRef ) {
                        modalRef.afterClosed()
                            .pipe(takeUntil(this._unsubscribeAll))
                            .subscribe((result) => {
                                this.filterService.empty_share(this.entity)
                            });


                    }

                } else {
                    this._snackService.error('Ошибка при открытии сделки', 5000);
                }
            });
    }
}
