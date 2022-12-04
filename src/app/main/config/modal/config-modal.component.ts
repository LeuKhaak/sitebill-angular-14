import { Component, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ModelService } from 'app/_services/model.service';


@Component({
    selector: 'config-modal',
    templateUrl: './config-modal.component.html',
    styleUrls: ['./config-modal.component.scss']
})
export class ConfigModalComponent implements OnInit {

    constructor(
        private dialogRef: MatDialogRef<ConfigModalComponent>,
        public modelService: ModelService,
    ) {
    }

    ngOnInit() {
    }

    close() {
        this.dialogRef.close();
    }

}
