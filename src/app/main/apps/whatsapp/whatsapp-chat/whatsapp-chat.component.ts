import {AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subject} from "rxjs";
import {fuseAnimations} from "../../../../../@fuse/animations";
import {WhatsAppService} from "../whatsapp.service";
import {ModelService} from "../../../../_services/model.service";
import {takeUntil} from "rxjs/operators";
import {ResponseState, SitebillResponse} from "../../../../_models/sitebill-response";
import {WhatsappStateTypes} from "../types/whatsapp-state.types";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {SitebillSession} from "../../../../_models/sitebillsession";
import {Chat, DialogPost, SendCallbackBundle} from "../types/whatsapp.types";
import {Message} from "../types/venom-bot/model/message";
import {ApiCall, ApiParams, SitebillEntity, SitebillModelItem} from "../../../../_models";
import {SnackService} from "../../../../_services/snack.service";
// import {promise} from "protractor";
import {MessagesService} from "../../../../_services/messages.service";

@Component({
    selector: 'whatsapp-chat',
    templateUrl: './whatsapp-chat.component.html',
    styleUrls: ['./whatsapp-chat.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WhatsAppChatComponent  implements OnInit, AfterViewChecked {
    protected _unsubscribeAll: Subject<any>;
    public state: WhatsappStateTypes;
    public WhatsappStateTypes = WhatsappStateTypes;

    public qr_image: SafeResourceUrl;
    private wait_qr_ms = 12000;
    private qr_seconds: number = 0;
    private clearInterval: NodeJS.Timeout;

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    @Input("messages")
    messages: any[];

    @Input("sendCallbackBundle")
    sendCallbackBundle: SendCallbackBundle;

    private chat: Chat;

    public dialog: Message[];
    private subscribed = false;


    constructor(
        protected whatsAppService: WhatsAppService,
        protected modelService: ModelService,
        protected _snackService: SnackService,
        public _sanitizer: DomSanitizer,
        private messagesService: MessagesService
    ) {
        this._unsubscribeAll = new Subject();
    }


    initGetQrCodeProcess ( session: SitebillSession ) {
        console.log('need qr code');
        this.state = WhatsappStateTypes.wait_qr;
        this.clearInterval = setInterval(this.incrementSeconds.bind(this), 1000);
        setTimeout(() => {
            this.whatsAppService.getQrCode(this.modelService.sitebill_session)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: SitebillResponse) => {
                    clearInterval(this.clearInterval);
                    this.drawQrCode(result.data);
                });
        }, this.wait_qr_ms)
    }

    incrementSeconds() {
        this.qr_seconds += 1;
    }

    ngOnInit() {
        this.scrollToBottom();
        //this.getAllChatsGroups();

/*
        this.whatsAppService.isConnected(this.modelService.sitebill_session)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (result: SitebillResponse) => {
                    if ( result ) {
                        if ( result.state === ResponseState.success ) {
                            console.log('client connected');
                            this.drawChat(this.sendCallbackBundle);
                        } else {
                            this.initGetQrCodeProcess(this.modelService.sitebill_session);
                        }
                    } else {
                        this.initGetQrCodeProcess(this.modelService.sitebill_session);
                    }
                },
                error => {
                    //this.getQrCode();
                    console.log('error isConnected');
                    console.log(error);
                    this._snackService.error('Сервис отправки сообщений в WhatsApp временно недоступен');
                }
                );
        if ( !this.subscribed ) {
            this.receiveChatSocketSubscriber(this.sendCallbackBundle);
        }
*/

    }

    getAllChatsGroups () {
        this.whatsAppService.getGroupMembers(null)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (result ) => {
                    console.log(result);
                },
                error => {
                    console.log(error);
                }
            );
    }

    receiveChatSocketSubscriber(sendCallbackBundle: SendCallbackBundle) {
        this.whatsAppService.receiveChatSocket(this.modelService.sitebill_session)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (result: Message ) => {
                    if ( result.from == this.whatsAppService.normalizeNumber(sendCallbackBundle.phone) ) {
                        this.updateChatMessagesOnServer([result], sendCallbackBundle)
                        this.dialog.push(result);
                    }
                },
                error => {
                    console.log(error);
                }
            );
        this.subscribed = true;
    }

    drawChat (sendCallbackBundle: SendCallbackBundle) {
        if ( this.whatsAppService.getMailingList().length > 0 ) {
            this.state = WhatsappStateTypes.chat;
            if ( sendCallbackBundle.phone ) {
                this.whatsAppService.getAllMessagesInChat(sendCallbackBundle.phone)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(
                        (result: Message[]) => {
                            this.updateChatMessagesOnServer(result, sendCallbackBundle);
                        },
                        error => {
                            console.log(error);
                        }
                    );
            }

        } else {
            this.whatsAppService.getAllMessagesInChat(sendCallbackBundle.phone)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(
                    (result: Message[]) => {
                        this.updateChatMessagesOnServer(result, sendCallbackBundle);
                        this.state = WhatsappStateTypes.chat;
                        this.dialog = result;
                        this.whatsAppService.readyState = true;
                    },
                    error => {
                        console.log(error);
                    }
                );
        }
    }

    updateChatMessagesOnServer (messages: Message[], sendCallbackBundle: SendCallbackBundle) {
        const client_id = sendCallbackBundle.entity.get_key_value();
        messages.forEach(item => this.messagesService.message(item, client_id, sendCallbackBundle.data_id));
    }

    drawQrCode ( base64Qr: string ) {
        this.state = WhatsappStateTypes.draw_qr;
        this.qr_image = this._sanitizer.bypassSecurityTrustResourceUrl(base64Qr);
    }


    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }
    }


    OnDestroy () {
        console.log('OnDestroy');
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        clearInterval(this.clearInterval);
    }

    async update_chat(dialog_post: DialogPost) {
        let sendCallbackBundle = this.sendCallbackBundle;
        let result = null;
        if ( this.whatsAppService.getMailingList().length > 0 ) {
            let phone_cache = [];
            for (const item of this.whatsAppService.getMailingList()) {
                let mapped = Object.keys(item);
                for (const column_item of mapped) {
                    if ( column_item == 'phone' ) {
                        if ( phone_cache.indexOf(item[column_item].value) < 0 ) {
                            phone_cache.push(item[column_item].value);
                            sendCallbackBundle.phone = item[column_item].value;
                            sendCallbackBundle.entity.set_key_value(item[sendCallbackBundle.entity.get_primary_key()].value)
                            result = await this.sendPost(dialog_post, sendCallbackBundle, false ).catch((err) => {
                                this._snackService.error('Ошибка при отправке на номер ' + sendCallbackBundle.phone);
                            });
                            if ( result ) {
                                const messages = await this.getAllMessagesInChat(sendCallbackBundle.phone);
                                this.updateChatMessagesOnServer(messages, sendCallbackBundle);
                            }
                        }
                    }
                }
            }
        } else {
            result = await this.sendPost(dialog_post, sendCallbackBundle,true).catch((err) => {
                this._snackService.error('Ошибка при отправке на номер ' + sendCallbackBundle.phone);
            });
            if ( result ) {
                this._snackService.message('Сообщение отправлено на номер ' + sendCallbackBundle.phone);
            }

        }
        this.whatsAppService.clearMailingAttachList();
    }

    async getAllMessagesInChat (phone: string): Promise<Message[]> {
        return new Promise((resolve, reject) => {
            this.whatsAppService.getAllMessagesInChat(phone)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(
                    (result: Message[]) => {
                        resolve(result);
                    },
                    error => {
                        console.log(error);
                        reject(new Error(error))
                    }
                );
        })
    }

    async sendPost (dialog_post: DialogPost, sendCallbackBundle: SendCallbackBundle, update_chat = true ) {
        if ( dialog_post.entities ) {
            for (const item of dialog_post.entities) {
                let data_id = item['id']['value']

                const apiCall = <ApiCall> {
                    api: 'pdfreport',
                    name: 'pdfreport',
                    method: 'get_meta',
                    anonymous: true
                };
                const pdf_meta = await this.modelService.api_call_async(apiCall, {data_id: data_id})
                let recursive_dialog_post = <DialogPost> {
                    message: dialog_post.message,
                    files: [pdf_meta['data']]
                }
                sendCallbackBundle.data_id = data_id;
                let result = await this.sendPost(recursive_dialog_post, sendCallbackBundle, false).catch((err) => {
                    this._snackService.error('Ошибка при отправке файла ' + pdf_meta['data']['normal'] + ' на номер ' + sendCallbackBundle.phone);
                });
                if ( result ) {
                    this._snackService.message('Файл ' + pdf_meta['data']['normal'] + ' отправлен на номер ' + sendCallbackBundle.phone);
                    const messages = await this.getAllMessagesInChat(sendCallbackBundle.phone);
                    this.updateChatMessagesOnServer(messages, sendCallbackBundle);
                }
            }
            return new Promise((resolve, reject) => {
                resolve('ok');
            })
        }

        return new Promise((resolve, reject) => {
            if (dialog_post.message) {
                this.whatsAppService.sendText(sendCallbackBundle.phone, dialog_post.message)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(
                        (result) => {
                            if ( update_chat ) {
                                if (update_chat) {
                                    this.drawChat(sendCallbackBundle);
                                }
                            }
                            resolve(result);
                        },
                        error => {
                            console.log(error);
                            reject(new Error(error))
                        }
                    );
            }
            if ( dialog_post.files ) {
                this.whatsAppService.sendFile(sendCallbackBundle.phone, dialog_post.files)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(
                        (result) => {
                            if ( update_chat ) {
                                setTimeout(this.drawChat.bind(this, sendCallbackBundle), 2000);
                            }
                            resolve(result);
                        },
                        error => {
                            console.log(error);
                            reject(new Error(error))
                        }
                    );
            }
        })
    }

    getProgressInPercent() {
        return Math.round((1 - ((this.wait_qr_ms - this.qr_seconds*1000)/this.wait_qr_ms))*100);
    }
}
