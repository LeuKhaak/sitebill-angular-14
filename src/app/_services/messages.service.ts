import { Injectable } from '@angular/core';
import {ModelService} from "./model.service";
import {Message} from "../main/apps/whatsapp/types/venom-bot/model/message";
import {SitebillEntity} from "../_models";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {SitebillResponse} from "../_models/sitebill-response";
import * as moment from "moment";
import {indexOf} from "lodash";


@Injectable()
export class MessagesService {
    private entity: SitebillEntity;
    protected _unsubscribeAll: Subject<any>;
    private cache = [];

    constructor(
        private modelService: ModelService,
    ) {
        this._unsubscribeAll = new Subject();
        this.entity = new SitebillEntity();
        this.entity.set_app_name('messages')
        this.entity.set_table_name('messages')
        this.entity.set_primary_key('message_id')

    }

    message(message: Message, client_id?: number, data_id?: number) {
        if ( this.cache.indexOf(message.id) < 0 ) {
            const chatId = message.chatId;
            const ql_items = {
                id: message.id,
                content: message.content,
                isMedia: message.isMedia,
                file_name: message.filename,
                chatId: (typeof chatId === 'string' ? chatId : chatId['_serialized']),
                client_id: client_id,
                data_id: data_id,
                created_at: (moment(message.timestamp*1000)).format('YYYY-MM-DD HH:mm:ss')
            };
            this.modelService.native_insert(this.entity.get_app_name(), ql_items)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: SitebillResponse) => {
                    this.cache.push(message.id);
                });
        }
    }

    OnDestroy () {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
