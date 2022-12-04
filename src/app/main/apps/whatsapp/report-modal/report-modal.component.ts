import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ReportType, SendCallbackBundle} from "../types/whatsapp.types";
import {SitebillEntity} from "../../../../_models";

@Component({
    selector: 'report-modal',
    templateUrl: './report-modal.component.html',
    styleUrls: ['./report-modal.component.scss']
})
export class ReportModalComponent implements OnInit {
    sendCallbackBundle: SendCallbackBundle;
    public detail_fields: {};
    public detail_entity: SitebillEntity;

    constructor(
        protected dialog: MatDialog,
        public _matDialog: MatDialog,
        private dialogRef: MatDialogRef<ReportModalComponent>,
        @Inject(MAT_DIALOG_DATA) public _data: SendCallbackBundle
    ) {
        this.sendCallbackBundle = this._data;
    }

    ngOnInit(): void {
        if ( this._data.report_type === ReportType.data ) {
            this.setup_data_entity();
        } else {
            this.setup_client_entity();
        }
    }

    setup_client_entity () {
        this.detail_entity = new SitebillEntity();
        this.detail_entity.set_app_name('client');
        this.detail_entity.set_table_name('client');
        this.detail_entity.primary_key = 'client_id';
        this.detail_entity.set_key_value(this._data.client_id);

        this.detail_fields = {};
        this.detail_fields['company'] = true;
        this.detail_fields['fio'] = true;
        this.detail_fields['phone'] = true;
        this.detail_fields['email'] = true;
    }

    setup_data_entity () {
        this.detail_entity = new SitebillEntity();
        this.detail_entity.set_app_name('data');
        this.detail_entity.set_table_name('data');
        this.detail_entity.primary_key = 'id';
        this.detail_entity.set_key_value(this._data.data_id);

        this.detail_fields = {};
        this.detail_fields['topic_id'] = true;
        this.detail_fields['optype'] = true;
        this.detail_fields['street_id'] = true;
        this.detail_fields['number'] = true;
        this.detail_fields['square_all'] = true;
        this.detail_fields['cost_meter_per_month4rent'] = true;
    }


    close () {
        this.dialogRef.close();
    }

}
