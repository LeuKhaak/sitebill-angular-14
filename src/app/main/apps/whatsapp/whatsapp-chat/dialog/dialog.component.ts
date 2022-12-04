import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {Message} from "../../types/venom-bot/model/message";
import {Chat, DialogPost, SendCallbackBundle} from "../../types/whatsapp.types";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AttachModalComponent} from "./attach-modal/attach-modal.component";
import {SitebillEntity} from "../../../../../_models";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {DomSanitizer} from "@angular/platform-browser";
import {WhatsAppService} from "../../whatsapp.service";
import {AttachEntityModalComponent} from "./attach-entity-modal/attach-entity-modal.component";

@Component({
    selector: 'chat-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    protected _unsubscribeAll: Subject<any>;
    form: FormGroup;


    public show_gallery = false;

    @Input("chat")
    chat: Chat;

    @Input("sendCallbackBundle")
    sendCallbackBundle: SendCallbackBundle;

    @Input("dialog")
    dialog: Message[];

    @Output() onChange: EventEmitter<DialogPost> = new EventEmitter();

    @ViewChildren('replyInput')
    replyInputField;

    @ViewChild('replyForm')
    replyForm: NgForm;
    files_field = 'files';
    files_entity: SitebillEntity;
    can_send = false;
    dialogPost: DialogPost;

    @ViewChild('whatsappContactsList') whatsappContactsList;


    constructor(
        protected dialog_modal: MatDialog,
        private fb: FormBuilder,
        public whatsAppService: WhatsAppService,
        public _sanitizer: DomSanitizer
    ) {
        this._unsubscribeAll = new Subject();
        this.dialogPost = null;
    }

    ngOnInit(): void {
        this.readyToReply();
        this.form = this.fb.group({
            message: [''],
        });

        this.form.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onFormValuesChanged();
            });

    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }



    /**
     * Ready to reply
     */
    readyToReply(): void {
        setTimeout(() => {
            this.scrollToBottom();
            this.form.controls['message'].patchValue('');
            this.can_send = false;
        });

    }


    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {
        }
    }

    /**
     * Reply
     */
    reply(): void {
        if ( this.can_send ) {
            this.dialogPost = {
                message: null,
                files: null,
            };

            if (this.form.controls['message'].value != null && this.form.controls['message'].value.trim() !== '') {
                this.dialogPost.message = this.form.controls['message'].value;
            }

            if (
                this.files_entity &&
                this.files_entity.model &&
                this.files_entity.model[this.files_field] &&
                this.files_entity.model[this.files_field].value &&
                this.files_entity.model[this.files_field].value.length > 0
            ) {
                this.dialogPost.files = this.files_entity.model[this.files_field].value;
                this.show_gallery = false;
                this.files_entity = null;
            }
            if ( this.whatsAppService.getMailingAttachList().length > 0 ) {
                this.dialogPost.entities = this.whatsAppService.getMailingAttachList();
            }
            this.onChange.emit(this.dialogPost);
            this.dialogPost = null;
        }
        this.readyToReply();
    }

    attach_entity_modal() {


        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.panelClass = 'regular-modal';
        dialogConfig.minWidth = '90vw';
        dialogConfig.data = {entity: this.files_entity};
        this.show_gallery = false;

        const modalRef = this.dialog_modal.open(AttachEntityModalComponent, dialogConfig);
        modalRef.componentInstance.attach_entity
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if ( result.model && result.model['files'] && result.model['files'].value.length > 0 ) {
                    this.show_gallery = true;
                    this.files_entity = new SitebillEntity();
                    this.files_entity = result;
                    this.can_send = true;
                }
            });
    }

    attach_modal() {


        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.panelClass = 'regular-modal';
        dialogConfig.minWidth = '50vw';
        dialogConfig.data = {entity: this.files_entity};
        this.show_gallery = false;

        const modalRef = this.dialog_modal.open(AttachModalComponent, dialogConfig);
        modalRef.componentInstance.attach_entity
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if ( result.model && result.model['files'] && result.model['files'].value.length > 0 ) {
                    this.show_gallery = true;
                    this.files_entity = new SitebillEntity();
                    this.files_entity = result;
                    this.can_send = true;
                }
            });
    }

    OnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    private onFormValuesChanged() {
        if (this.form.controls['message'].value != null && this.form.controls['message'].value.trim() !== '') {
            this.can_send = true;
        } else {
            this.can_send = false;
        }
    }

    show_mailing_list () {
        if (this.whatsAppService.getMailingList().length > 0) {
            return true;
        }
        return false;
    }

    show_mailing_attach_list () {
        if (this.whatsAppService.getMailingAttachList().length > 0) {
            this.can_send = true;
            return true;
        }
        return false;
    }

    clear_mailing_attach_list() {
        this.can_send = false;
        this.whatsAppService.clearMailingAttachList();
    }
}

