import { Component, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import {ConfigService} from '../../../_services/config.service';


@Component({
    selector: 'config-modal',
    templateUrl: './config-modal.component.html',
    styleUrls: ['./config-modal.component.scss']
})
export class ConfigModalComponent implements OnInit {

    constructor(
        private dialogRef: MatDialogRef<ConfigModalComponent>,
        public configService: ConfigService,
    ) {
    }

    ngOnInit(): void {
    }

    close(): void {
        this.dialogRef.close();
    }

}
