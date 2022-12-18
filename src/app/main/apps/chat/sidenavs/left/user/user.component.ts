import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { ChatService } from 'app/main/apps/chat/chat.service';

@Component({
    selector   : 'chat-user-sidenav',
    templateUrl: './user.component.html',
    styleUrls  : ['./user.component.scss']
})
export class ChatUserSidenavComponent implements OnInit, OnDestroy
{
    user: any;
    userForm: UntypedFormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ChatService} _chatService
     */
    constructor(
        private _chatService: ChatService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.user = this._chatService.user;

        this.userForm = new UntypedFormGroup({
            mood  : new UntypedFormControl(this.user.mood),
            status: new UntypedFormControl(this.user.status)
        });

        this.userForm.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe(data => {
                this.user.mood = data.mood;
                this.user.status = data.status;
                this._chatService.updateUserData(this.user);
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Change left sidenav view
     *
     * @param view
     */
    changeLeftSidenavView(view): void
    {
        this._chatService.onLeftSidenavViewChanged.next(view);
    }

}
