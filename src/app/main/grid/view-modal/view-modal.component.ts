import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormBuilder, FormGroup} from '@angular/forms';

import {ChatService, CommentsBlockMeta} from 'app/main/apps/chat/chat.service';
import {APP_CONFIG, AppConfig} from 'app/app.config.module';
import {ModelService} from 'app/_services/model.service';
import {FormComponent} from '../form/form.component';
import {SnackService} from '../../../_services/snack.service';
import {FilterService} from '../../../_services/filter.service';
import {Bitrix24Service} from '../../../integrations/bitrix24/bitrix24.service';
import {SitebillEntity} from '../../../_models';
import {StorageService} from "../../../_services/storage.service";


@Component({
    selector: 'view-modal',
    templateUrl: './view-modal.component.html',
    styleUrls: ['./view-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewModalComponent extends FormComponent implements OnInit {

    form: FormGroup;
    rows: any[];
    records: any[];
    api_url: string;
    render_value_string_array = ['empty', 'select_box', 'select_by_query', 'select_box_structure', 'date'];
    render_value_array = ['empty', 'textarea_editor', 'safe_string', 'textarea', 'primary_key'];
    disable_toolbar: boolean;

    loadingIndicator: boolean;
    commentsBlockMeta: CommentsBlockMeta = {};

    constructor(
        protected _chatService: ChatService,
        protected dialogRef: MatDialogRef<FormComponent>,
        protected modelService: ModelService,
        protected _formBuilder: FormBuilder,
        protected _snackService: SnackService,
        public _matDialog: MatDialog,
        protected filterService: FilterService,
        protected bitrix24Service: Bitrix24Service,
        @Inject(APP_CONFIG) protected config: AppConfig,
        @Inject(MAT_DIALOG_DATA) public _data: SitebillEntity,
        protected cdr: ChangeDetectorRef,
        protected storageService: StorageService
    ) {

        super(
            dialogRef,
            modelService,
            _formBuilder,
            _snackService,
            _matDialog,
            filterService,
            bitrix24Service,
            config,
            _data,
            cdr,
            storageService
        );

        this.loadingIndicator = true;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.api_url = this.modelService.get_api_url();

    }

    ngOnInit() {
        this._chatService.onChatSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chatData) => {
                if (chatData && chatData.dialog) {
                    this.commentsBlockMeta.commentsTotal = chatData.dialog.length;
                    const lastCommentData = chatData.dialog[this.commentsBlockMeta.commentsTotal - 1];
                    if (lastCommentData) {
                        this.commentsBlockMeta.lastMessage = lastCommentData.comment_text.value;
                    } else {
                        this.commentsBlockMeta.lastMessage = '';
                    }
                }
            });
        this.form = this._formBuilder.group({});
        this._data.set_readonly(true);
        this.getModel();
        this._chatService.getChat(this._data.get_table_name(), this._data.primary_key, this._data.key_value);
    }

    get_youtube_code(video_id: string) {
        if (video_id === '') {
            return '';
        }
        return '<iframe width="100%" height="100" src="https://www.youtube.com/embed/' + video_id + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><strong>';
    }

    get_colspan(type: string, name: string) {
        if (type === 'geodata' || type === 'uploads' || type === 'textarea_editor' || name === 'youtube' || type === 'injector') {
            return 2;
        }
        return 1;
    }

    save() {
        this._data.set_readonly(false);
        this.dialogRef.close(this.form.value);
    }

    close() {
        this._data.set_readonly(false);
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.dialogRef.close();
        this._chatService.closeChat();
    }
}
