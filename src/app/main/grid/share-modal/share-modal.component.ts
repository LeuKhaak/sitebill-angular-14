import {Component, Inject, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {SnackService} from '../../../_services/snack.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GetApiUrlService} from '../../../_services/get-api-url.service';

@Component({
    selector: 'share-modal',
    templateUrl: './share-modal.component.html',
    styleUrls: ['./share-modal.component.scss'],
    animations: fuseAnimations
})
export class ShareModalComponent  implements OnInit {
    public link: string;

    constructor(
        protected getApiUrlService: GetApiUrlService,
        private dialogRef: MatDialogRef<ShareModalComponent>,
        protected _snackService: SnackService,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
    }


    ngOnInit(): void {
        this.link = this.getApiUrlService.get_api_url() + '/memorylist/grid/123';
    }

    copy(): void {
        // this.clipboard.copy(this.link);
        this._snackService.message('Ссылка скопирована в буфер обмена');
    }

    close(): void {
        this.dialogRef.close();
    }
}
