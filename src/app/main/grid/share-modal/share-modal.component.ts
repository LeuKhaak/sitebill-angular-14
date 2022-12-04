import {Component, Inject, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {ModelService} from '../../../_services/model.service';
import {SnackService} from '../../../_services/snack.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'share-modal',
    templateUrl: './share-modal.component.html',
    styleUrls: ['./share-modal.component.scss'],
    animations: fuseAnimations
})
export class ShareModalComponent  implements OnInit {
    public link: string;

    constructor(
        protected modelService: ModelService,
        private dialogRef: MatDialogRef<ShareModalComponent>,
        protected _snackService: SnackService,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
    }


    ngOnInit() {
        this.link = this.modelService.get_api_url() + '/memorylist/grid/123';
    }

    copy() {
        //this.clipboard.copy(this.link);
        this._snackService.message('Ссылка скопирована в буфер обмена');


    }

    close() {
        this.dialogRef.close();
    }


}
