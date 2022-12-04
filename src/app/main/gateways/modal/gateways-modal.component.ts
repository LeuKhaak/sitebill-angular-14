import { Component, Inject, OnInit, Input} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { ModelService } from 'app/_services/model.service';
import { FilterService } from 'app/_services/filter.service';


@Component({
    selector: 'gateways-modal',
    templateUrl: './gateways-modal.component.html',
    styleUrls: ['./gateways-modal.component.css']
})
export class GatewaysModalComponent implements OnInit {
    invoice_id: number;

    constructor(
        private dialogRef: MatDialogRef<GatewaysModalComponent>,
        @Inject(APP_CONFIG) private config: AppConfig,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        //this.invoice_id = 100;
    }

    ngOnInit() {
        console.log(this.data);
        this.invoice_id = this.data.invoice.id.value;
    }

    close() {
        this.dialogRef.close();
    }

}
