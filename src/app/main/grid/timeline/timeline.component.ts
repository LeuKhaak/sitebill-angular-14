import {Component, OnDestroy, OnInit, ViewEncapsulation, Inject, Input} from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { ChatService } from 'app/main/apps/chat/chat.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import {SitebillEntity} from '../../../_models';
import {GetApiUrlService} from '../../../_services/get-api-url.service';


@Component({
    selector   : 'profile-timeline',
    templateUrl: './timeline.component.html',
    styleUrls  : ['./timeline.component.scss'],
    animations : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ProfileTimelineComponent implements OnInit, OnDestroy
{
    timeline: any;
    selectedChat: any;

    // Private
    private _unsubscribeAll: Subject<any>;
    api_url: string;

    @Input()
    entity: SitebillEntity;


    /**
     * Constructor
     *
     * @param {ProfileService} _profileService
     */
    constructor(
        private _chatService: ChatService,
        protected getApiUrlService: GetApiUrlService,
        @Inject(APP_CONFIG) private config: AppConfig
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.api_url = this.getApiUrlService.get_api_url();

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // console.log('init timeline');

        // this._chatService.getChat('5725a680b3249760ea21de52');
        if ( this.entity ) {
            this._chatService.getChat(this.entity.get_table_name(), this.entity.get_primary_key(), this.entity.get_key_value());
        }


        this._chatService.onChatSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(chatData => {
                this.selectedChat = chatData;
            });

    }



    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
