import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';

import {ChatService} from 'app/main/apps/chat/chat.service';
import {ModelService} from 'app/_services/model.service';
import {SnackService} from '../../../_services/snack.service';
import {FilterService} from '../../../_services/filter.service';
import {Bitrix24Service} from '../../../integrations/bitrix24/bitrix24.service';
import {SitebillEntity} from '../../../_models';
import {FormConstructorComponent} from '../form/form-constructor.component';
import {StorageService} from '../../../_services/storage.service';
import {GetApiUrlService} from '../../../_services/get-api-url.service';

class CommentsBlockMeta {
    isOpened = false;
    commentsTotal = 0;
    lastMessage = '';
}

@Component({
    selector: 'view-static',
    templateUrl: './view-modal.component.html',
    styleUrls: ['./view-modal.component.scss']
})
export class ViewStaticComponent extends FormConstructorComponent implements OnInit {
    @Input()
    entity: SitebillEntity;


    form: UntypedFormGroup;
    rows: any[];
    records: any[];
    api_url: string;
    render_value_string_array = ['empty', 'select_box', 'select_by_query', 'select_box_structure', 'date'];
    render_value_array = ['empty', 'textarea_editor', 'safe_string', 'textarea', 'primary_key'];

    loadingIndicator: boolean;
    commentsBlockMeta = new CommentsBlockMeta();
    public disable_toolbar: boolean;

    constructor(
        protected _chatService: ChatService,
        public modelService: ModelService,
        protected _formBuilder: UntypedFormBuilder,
        protected _snackService: SnackService,
        public _matDialog: MatDialog,
        protected filterService: FilterService,
        protected bitrix24Service: Bitrix24Service,
        protected cdr: ChangeDetectorRef,
        protected getApiUrlService: GetApiUrlService,
        protected storageService: StorageService

    ) {

        super(
            modelService,
            getApiUrlService,
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
        this.api_url = this.getApiUrlService.get_api_url();

    }

    ngOnInit(): void {
        this.form = this._formBuilder.group({});
        this._data.set_readonly(true);
        this._data.set_disable_comment();
        this.getModel();
    }

    get_youtube_code(video_id: string): string {
        if (video_id === '') {
            return '';
        }
        return '<iframe width="100%" height="100" src="https://www.youtube.com/embed/' + video_id + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><strong>';
    }

    get_colspan(type: string, name: string): number {
        if (type === 'geodata' || type === 'uploads' || type === 'textarea_editor' || name === 'youtube') {
            return 2;
        }
        return 1;
    }

    save(): void {
        this._data.set_readonly(false);
    }

    close(): void {
        this._data.set_readonly(false);
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        this._chatService.closeChat();
    }
}
