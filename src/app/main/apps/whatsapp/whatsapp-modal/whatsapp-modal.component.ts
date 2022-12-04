import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SendCallbackBundle} from "../types/whatsapp.types";

@Component({
    selector: 'whatsapp-modal',
    templateUrl: './whatsapp-modal.component.html',
    styleUrls: ['./whatsapp-modal.component.scss']
})
export class WhatsappModalComponent implements OnInit {
    sendCallbackBundle: SendCallbackBundle;

    constructor(
        protected dialog: MatDialog,
        public _matDialog: MatDialog,
        private dialogRef: MatDialogRef<WhatsappModalComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: SendCallbackBundle
    ) {
        this.sendCallbackBundle = this._data;
    }

    ngOnInit(): void {
    }

    close () {
        this.dialogRef.close();
    }

}
