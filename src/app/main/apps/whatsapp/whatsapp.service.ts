import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ModelService} from "../../../_services/model.service";
import {SitebillSession} from "../../../_models/sitebillsession";
import parsePhoneNumber from 'libphonenumber-js';
import {EmptyObservable} from "rxjs-compat/observable/EmptyObservable";
import {APP_CONFIG, AppConfig} from "../../../app.config.module";
import {Socket} from "ngx-socket-io";
import {SitebillEntity, SitebillModelItem} from "../../../_models";

@Injectable()
export class WhatsAppService {
    public schema = this.config.whatsapp_schema;
    private ready: boolean = false;
    private mailing_list: SitebillModelItem[] = [];
    private mailing_attach_list: SitebillModelItem[] = [];


    /**
     * Constructor
     */
    constructor(
        private http: HttpClient,
        private modelService: ModelService,
        @Inject(APP_CONFIG) private config: AppConfig,
    )
    {
        if ( this.hostname !== '192.168.1.37' ) {
            this.isLoggedIn(this.modelService.sitebill_session)
                .subscribe(
                    (result ) => {
                        if ( result ) {
                            console.log('WhatsAppService isConnected');
                            this.readyState = true;
                        }
                    }
                );
        }
    }

    get readyState(): boolean {
        return this.ready;
    }

    set readyState (state) {
        this.ready = state;
    }

    get api_url(): string {
        return `${this.schema}://${this.hostname}:${this.port}/${this.api_uri}`
    }

    get hostname(): string {
        return this.config.whatsapp_host;
    }

    get port(): string {
        return this.config.whatsapp_port;
    }

    get api_uri(): string {
        return 'api'
    }

    getHostDevice() {
        return this.http.get(`${this.api_url}/getHostDevice`);
    }

    normalizeNumber ( number: string ) {
        if ( !number ) {
            return '';
        }
        const phoneNumber = parsePhoneNumber(number, 'RU');
        if (phoneNumber && phoneNumber.isValid()) {
            return phoneNumber.number.replace('+','') + '@c.us';
        }
        return '';
    }

    getAllMessagesInChat ( number: string ) {
        number = this.normalizeNumber(number);
        const chat_session = {
            session: this.modelService.sitebill_session,
            chat: {chatId: number}
        };
        console.log(chat_session);
        return this.http.post(`${this.api_url}/getAllMessagesInChat`, chat_session);
    }

    sendText ( number: string, message: string ) {
        number = this.normalizeNumber(number);
        const chat_session = {
            session: this.modelService.sitebill_session,
            chat: {chatId: number},
            message: message
        };
        console.log(chat_session);
        return this.http.post(`${this.api_url}/sendText`, chat_session);
    }

    sendFile ( number: string, files: any ) {
        number = this.normalizeNumber(number);
        const chat_session = {
            session: this.modelService.sitebill_session,
            chat: {chatId: number},
            files: files
        };
        console.log(chat_session);
        return this.http.post(`${this.api_url}/sendFile`, chat_session);
    }

    getGroupMembers ( number: string ) {
        let groupId = '79529374488-1634787586@g.us';
        number = this.normalizeNumber(number);
        const chat_session = {
            session: this.modelService.sitebill_session,
            group: {groupId: groupId},
        };
        console.log(chat_session);
        return this.http.post(`${this.api_url}/getGroupMembers`, chat_session);
    }

    getAllChatsGroups ( number: string ) {
        let groupId = '79529374488-1634787586@g.us';
        number = this.normalizeNumber(number);
        const chat_session = {
            session: this.modelService.sitebill_session,
            group: {groupId: groupId},
        };
        console.log(chat_session);
        return this.http.post(`${this.api_url}/getAllChatsGroups`, chat_session);
    }

    checkNumberStatus ( number: string ) {
        number = this.normalizeNumber(number);
        if ( number !== '' ) {
            const chat_session = {
                session: this.modelService.sitebill_session,
                chat: {chatId: number},
            };
            return this.http.post(`${this.api_url}/checkNumberStatus`, chat_session);
        } else {
            return new EmptyObservable();
        }
    }
    isConnectedOnStart (session: SitebillSession) {
        return this.http.post(`${this.api_url}/isConnected`, session);
    }
    isConnected (session: SitebillSession) {
        return this.http.post(`${this.api_url}/isConnected`, session);
    }

    isLoggedIn (session: SitebillSession) {
        return this.http.post(`${this.api_url}/isLoggedIn`, session);
    }

    getQrCode (session: SitebillSession) {
        return this.http.post(`${this.api_url}/getQrCode`, session);
    }

    sendChatSocket(message){

        //this.socket.emit('msgToServer', {session: this.modelService.sitebill_session,message: message});
    }
    receiveChatSocket(session: SitebillSession){
        return null;
        //return this.socket.fromEvent('msgToClient/'+session.sessionId);
    }

    addToMailingList ( entities: SitebillModelItem[] ) {
        this.mailing_list = this.mailing_list.concat(entities);
    }
    getMailingList (): SitebillModelItem[] {
        return this.mailing_list;
    }
    addToMailingAttachList ( entities: SitebillModelItem[] ) {
        this.mailing_attach_list = this.mailing_attach_list.concat(entities);
    }
    getMailingAttachList (): SitebillModelItem[] {
        return this.mailing_attach_list;
    }
    clearMailingAttachList () {
        this.mailing_attach_list = [];
    }
}
