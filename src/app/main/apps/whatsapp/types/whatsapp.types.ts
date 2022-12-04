import {SitebillEntity, SitebillModelItem} from "../../../../_models";

export enum ReportType {
    data = 0,
    client = 1,
    summary = 1,
}

export class Chat {
    chatId: string;
}
export class SendCallbackBundle {
    entity: SitebillEntity;
    modelItems: SitebillModelItem[];
    data_id?: number;
    phone?:string;
    report_type?: ReportType;
    client_id?: number;
}
export class MessageContactVcard {
    chatId: string;
    contactsId: string;
    name: string
}

export class MessageText {
    chatId: string;
    text: string;
}

export class MessageReply {
    chatId: string;
    text: string;
    reply_to: string;
}

export class MessageLocation {
    chatId: string;
    latitude: string;
    longitude: string;
    title: string;
}

export class MessageImage {
    chatId: string;
    path: string;
    filename: string;
    caption: string;
}

export class MessageFile {
    chatId: string;
    path: string;
    filename: string;
    caption: string;
}

export class MessageLinkPreview {
    chatId: string;
    url: string;
    title: string;
}

export class DialogPost {
    message: string;
    files: string[];
    phone_list?: string[];
    entities?: SitebillModelItem[];
}
