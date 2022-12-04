import {ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormBuilder, FormGroup} from '@angular/forms';

import {ChatService} from 'app/main/apps/chat/chat.service';
import {APP_CONFIG, AppConfig} from 'app/app.config.module';
import {ModelService} from 'app/_services/model.service';
import {FormComponent} from '../form/form.component';
import {SnackService} from '../../../_services/snack.service';
import {FilterService} from '../../../_services/filter.service';
import {Bitrix24Service} from '../../../integrations/bitrix24/bitrix24.service';
import {SitebillEntity} from '../../../_models';
import {FormConstructorComponent} from '../form/form-constructor.component';
import {StorageService} from "../../../_services/storage.service";

class CommentsBlockMeta {
    isOpened?: boolean = false;
    commentsTotal?: number = 0;
    lastMessage?: string = '';
}

@Component({
    selector: 'view-static',
    templateUrl: './view-modal.component.html',
    styleUrls: ['./view-modal.component.scss']
})
export class ViewStaticComponent extends FormConstructorComponent implements OnInit {
    @Input("entity")
    _data: SitebillEntity;


    form: FormGroup;
    rows: any[];
    records: any[];
    api_url: string;
    render_value_string_array = ['empty', 'select_box', 'select_by_query', 'select_box_structure', 'date'];
    render_value_array = ['empty', 'textarea_editor', 'safe_string', 'textarea', 'primary_key'];

    loadingIndicator: boolean;
    commentsBlockMeta: CommentsBlockMeta = {};
    public disable_toolbar: boolean;

    constructor(
        protected _chatService: ChatService,
        protected modelService: ModelService,
        protected _formBuilder: FormBuilder,
        protected _snackService: SnackService,
        public _matDialog: MatDialog,
        protected filterService: FilterService,
        protected bitrix24Service: Bitrix24Service,
        protected cdr: ChangeDetectorRef,
        protected storageService: StorageService

    ) {

        super(
            modelService,
            _formBuilder,
            _snackService,
            filterService,
            bitrix24Service,
            _matDialog,
            cdr,
            storageService,
        );

        this.loadingIndicator = true;
        this.disable_toolbar = true;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.api_url = this.modelService.get_api_url();

    }

    ngOnInit() {
        this.form = this._formBuilder.group({});
        this._data.set_readonly(true);
        this._data.set_disable_comment();
        this.getModel();
    }

    get_youtube_code(video_id: string) {
        if (video_id === '') {
            return '';
        }
        return '<iframe width="100%" height="100" src="https://www.youtube.com/embed/' + video_id + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><strong>';
    }

    get_colspan(type: string, name: string) {
        if (type === 'geodata' || type === 'uploads' || type === 'textarea_editor' || name === 'youtube') {
            return 2;
        }
        return 1;
    }

    save() {
        this._data.set_readonly(false);
    }

    close() {
        this._data.set_readonly(false);
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this._chatService.closeChat();
    }
}
