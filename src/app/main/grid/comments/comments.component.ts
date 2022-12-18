import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {Subject} from 'rxjs';
import {SitebillEntity} from '../../../_models';
import {ChatService, CommentsBlockMeta} from '../../apps/chat/chat.service';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'comments-apps',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss'],
    animations: fuseAnimations
})
export class CommentsComponent  implements OnInit {
    protected _unsubscribeAll: Subject<any>;
    commentsBlockMeta = new CommentsBlockMeta();

    @Input()
    entity: SitebillEntity;

    @Output() forToggle = new EventEmitter<boolean>();


    constructor(
        protected _chatService: ChatService,
    ) {
        this._unsubscribeAll = new Subject();

    }


    ngOnInit(): void {
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
    }

    OnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    eventOpenClose(): void {
        this.forToggle.emit(this.commentsBlockMeta.isOpened);
    }
}
