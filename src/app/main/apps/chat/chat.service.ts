import {Injectable, isDevMode, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {currentUser} from 'app/_models/currentuser';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';

import {FuseUtils} from '@fuse/utils';
import { ModelService } from 'app/_services/model.service';

export class CommentsBlockMeta {
    isOpened?: boolean = false;
    commentsTotal?: number = 0;
    lastMessage?: string = '';
}


@Injectable()
export class ChatService implements Resolve<any>
{
    contacts: any[];
    chats: any[];
    user: any;
    open_close: boolean;
    onChatSelected: BehaviorSubject<any>;
    onContactSelected: BehaviorSubject<any>;
    onChatsUpdated: Subject<any>;
    onUserUpdated: Subject<any>;
    onLeftSidenavViewChanged: Subject<any>;
    onRightSidenavViewChanged: Subject<any>;

    private model_name: string;
    private primary_key: string;
    private key_value: string;
    api_url: string;


    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private modelSerivce: ModelService,
        @Inject(APP_CONFIG) private config: AppConfig
    ) {

        this.api_url = this.modelSerivce.get_api_url();

        this.open_close = false;

        // Set the defaults
        this.onChatSelected = new BehaviorSubject(null);
        this.onContactSelected = new BehaviorSubject(null);
        this.onChatsUpdated = new Subject();
        this.onUserUpdated = new Subject();
        this.onLeftSidenavViewChanged = new Subject();
        this.onRightSidenavViewChanged = new Subject();
        //this.getContacts();
        //this.getChats();
        //this.getUser();
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        //console.log('ChatService resolve');

        return new Promise((resolve, reject) => {
            Promise.all([
                //this.getContacts(),
                //this.getChats(),
                //this.getUser()
            ]).then(
                ([contacts, chats, user]) => {
                    //console.log(contacts);
                    this.contacts = contacts;
                    this.chats = chats;
                    this.user = user;
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get chat
     *
     * @param contactId
     * @returns {Promise<any>}
     */
    getChat(model_name, primary_key, key_value): Promise<any> {
        const contactId = model_name + key_value;
        this.model_name = model_name;
        this.primary_key = primary_key;
        this.key_value = key_value;

        //console.log('open close ' + this.open_close);

        const chatItem = false;
        /*
        const chatItem = this.user.chatList.find((item) => {
            return item.contactId === contactId;
        });
         */

        /**
         * Create new chat, if it's not created yet.
         */
        if (!chatItem) {
            /*
            this.createNewChat(contactId).then((newChats) => {
                this.getChat(model_name, primary_key, key_value);
            });
            return;
             */
        }

        const body = { action: 'comment', do: 'get', model_name: model_name, primary_key: primary_key, key_value: key_value, session_key: this.modelSerivce.get_session_key() };
        //const chat_id = '5725a680b3249760ea21de52';


        return new Promise((resolve, reject) => {
            //this._httpClient.get('api/chat-chats/' + chatItem.id)
            this._httpClient.post(`${this.modelSerivce.get_api_url()}/apps/api/rest.php`, body)
                .subscribe((response: any) => {
                    const chat = response;
                    const chatContact = null;
                    /*
                    const chatContact = this.contacts.find((contact) => {
                        return contact.id === contactId;
                    });
                     */

                    const chatData = {
                        chatId: contactId,
                        dialog: chat.rows,
                        current_user_id: this.modelSerivce.get_user_id(),
                        contact: chatContact
                    };
                    //console.log(chatData);
                    this.open_close = true;


                    this.onChatSelected.next({...chatData});

                }, reject);

        });

    }

    closeChat() {
        const chatData = {
            chatId: null,
            dialog: [],
            current_user_id: this.modelSerivce.get_user_id(),
            contact: null
        };


        this.onChatSelected.next({...chatData});
    }

    /**
     * Create new chat
     *
     * @param contactId
     * @returns {Promise<any>}
     */
    createNewChat(contactId): Promise<any> {
        return new Promise((resolve, reject) => {

            /*
            const contact = this.contacts.find((item) => {
                return item.id === contactId;
            });
             */

            const chatId = FuseUtils.generateGUID();

            const chat = {
                id: chatId,
                dialog: []
            };

            const chatListItem = {
                contactId: contactId,
                id: chatId,
                lastMessageTime: '2017-02-18T10:30:18.931Z',
                name: contactId,
                unread: null
            };

            /**
             * Add new chat list item to the user's chat list
             */
            this.user.chatList.push(chatListItem);

            /**
             * Post the created chat
             */
            this._httpClient.post('api/chat-chats', {...chat})
                .subscribe((response: any) => {

                    /**
                     * Post the new the user data
                     */
                    this._httpClient.post('api/chat-user/' + this.user.id, this.user)
                        .subscribe(newUserData => {

                            /**
                             * Update the user data from server
                             */
                            this.getUser().then(updatedUser => {
                                this.onUserUpdated.next(updatedUser);
                                resolve(updatedUser);
                            });
                        });
                }, reject);
        });
    }

    /**
     * Select contact
     *
     * @param contact
     */
    selectContact(contact): void {
        this.onContactSelected.next(contact);
    }

    /**
     * Set user status
     *
     * @param status
     */
    setUserStatus(status): void {
        this.user.status = status;
    }

    /**
     * Update user data
     *
     * @param userData
     */
    updateUserData(userData): void {
        this._httpClient.post('api/chat-user/' + this.user.id, userData)
            .subscribe((response: any) => {
                this.user = userData;
            }
            );
    }

    /**
     * Update the chat dialog
     *
     * @param chatId
     * @param dialog
     * @returns {Promise<any>}
     */
    updateDialog(chatId, comment_text): Promise<any> {
        return new Promise((resolve, reject) => {
            /*
            const newData = {
                id    : chatId,
                dialog: dialog
            };
            console.log(newData);
            */
            //const comment_text = 'test';

            const body = { action: 'comment', do: 'add', model_name: this.model_name, primary_key: this.primary_key, key_value: this.key_value, comment_text: comment_text, session_key: this.modelSerivce.get_session_key()};

            this._httpClient.post(`${this.modelSerivce.get_api_url()}/apps/api/rest.php`, body)
                .subscribe((updatedChat: any) => {
                    const currentChat = this.onChatSelected.getValue();
                    if (currentChat.chatId === chatId && currentChat.dialog && updatedChat.comment_data) {
                        currentChat.dialog.push(updatedChat.comment_data);
                        this.onChatSelected.next(currentChat);
                    }
                    resolve(updatedChat);
                }, reject);
        });
    }

    /**
     * Get contacts
     *
     * @returns {Promise<any>}
     */
    getContacts(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/chat-contacts')
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get chats
     *
     * @returns {Promise<any>}
     */
    getChats(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/chat-chats')
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get user
     *
     * @returns {Promise<any>}
     */
    getUser(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/chat-user')
                .subscribe((response: any) => {
                    resolve(response[0]);
                }, reject);
        });
    }
}
