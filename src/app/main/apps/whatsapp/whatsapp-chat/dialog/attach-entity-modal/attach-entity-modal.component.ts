import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {fuseAnimations} from '../../../../../../../@fuse/animations';
import {SitebillEntity} from '../../../../../../_models';
import {ModelService} from '../../../../../../_services/model.service';
import {Subject} from 'rxjs';
import {WhatsAppService} from '../../../whatsapp.service';

@Component({
    selector: 'attach-entity-modal',
    templateUrl: './attach-entity-modal.component.html',
    styleUrls: ['./attach-entity-modal.component.scss'],
    animations: fuseAnimations
})
export class AttachEntityModalComponent  implements OnInit {
    public link: string;
    protected _unsubscribeAll: Subject<any>;

    @Output() attach_entity: EventEmitter<SitebillEntity> = new EventEmitter();


    onSave = new EventEmitter();
    public entity: SitebillEntity;

    constructor(
        private dialogRef: MatDialogRef<AttachEntityModalComponent>,
        protected modelService: ModelService,
        public whatsAppService: WhatsAppService,
        @Inject(MAT_DIALOG_DATA) public _data: any
    ) {
        this._unsubscribeAll = new Subject();
    }


    ngOnInit(): void {
    }


    close(): void {
        this.dialogRef.close();
    }

    save(event): void {
        // this.onSave.emit(event);
    }

    OnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    attach(): void {
        this.dialogRef.close();
    }

    is_show_attach_button(): boolean {
        return this.whatsAppService.getMailingAttachList().length > 0;
    }
}
