import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bitrix24Entity, Bitrix24PlacementOptions } from './bitrix24';
import { DOCUMENT } from '@angular/common';


@Injectable()
export class Bitrix24Service {
    public entity: Bitrix24Entity;
    private placement_options: Bitrix24PlacementOptions;
    private access_token: string;
    private domain: string;
    private placement: string;
    private collections_count: number;
    private app_root_element: any;
    private bitrix24_user_option: string;
    private params_inited: boolean;

    constructor(
        private http: HttpClient,
        @Inject(DOCUMENT) private document: any,
    ) {
        this.collections_count = 0;
        this.entity = new Bitrix24Entity;
        this.placement_options = new Bitrix24PlacementOptions;
        this.params_inited = false;
        this.set_access_token(null);
    }

    get_client() {
        const url = `https://${this.get_domain()}/rest/crm.contact.get.json`;
        const request = { id: this.placement_options.get_id(), auth: this.get_access_token() };
        return this.http.post<any>(url, request);
    }

    get_deal(id) {
        const url = `https://${this.get_domain()}/rest/crm.deal.get.json`;
        const request = { id: id, auth: this.get_access_token() };
        return this.http.post<any>(url, request);
    }

    log_blogpost_add (message) {
        const url = `https://${this.get_domain()}/rest/log.blogpost.add.json`;
        const request = { POST_MESSAGE: message, auth: this.get_access_token() };
        return this.http.post<any>(url, request);
    }

    crm_timeline_comment_add (type, id, comment) {
        const url = `https://${this.get_domain()}/rest/crm.timeline.comment.add`;
        const request = { fields: {ENTITY_ID: id, ENTITY_TYPE: type, COMMENT: comment}, auth: this.get_access_token() };
        return this.http.post<any>(url, request);
    }

    comment_add ( data_id, items, operation ) {
        //Добавляем комментарий
        try {
            let compose_item = this.compose_comment(items);
            if (compose_item === '') {
                return false;
            }

            let comment = '<b>Подборка:</b> ' +
                (operation == 'add'? 'Добавлен':'Удален') +
                ' объект ID = ' +
                data_id + ', ' +
                compose_item;


            this.crm_timeline_comment_add (
                this.get_entity_type(),
                this.get_entity_id(),
                comment
            ).subscribe((response: any) => {
                        // console.log(response);
                    }
                );
        } catch (e) {

        }
    }

    compose_comment ( row ) {
        let result = [];
        for (let key in row) {
            if ( row[key].type != 'image' &&
                row[key].type != 'primary_key' &&
                row[key].name != 'date_added'  &&
                !Array.isArray(row[key].value) &&
                row[key].value != ''  &&
                row[key].value != 0  ) {
                if (row[key].value_string !== undefined && row[key].value_string.length > 0) {
                    result.push(row[key].value_string);
                } else {
                    result.push(row[key].value);
                }
            }
        }
        return result.join(' | ');
    }

    crm_timeline_comment_list (type, id) {
        const url = `https://${this.get_domain()}/rest/crm.timeline.comment.list.json`;
        const request = { fields: {ENTITY_ID: id, ENTITY_TYPE: type}, auth: this.get_access_token() };
        return this.http.post<any>(url, request);
    }

    crm_timeline_comment_fields () {
        const url = `https://${this.get_domain()}/rest/crm.timeline.comment.fields.json`;
        const request = { auth: this.get_access_token() };
        return this.http.post<any>(url, request);
    }

    user_option_get () {
        const url = `https://${this.get_domain()}/rest/user.option.get.json`;
        const request = { options: 'mister', auth: this.get_access_token() };
        return this.http.post<any>(url, request);
    }

    user_option_set ( options ) {
        const url = `https://${this.get_domain()}/rest/user.option.set.json`;
        const request = { options: options, auth: this.get_access_token() };
        return this.http.post<any>(url, request);
    }


    set_domain(_domain: string) {
        this.domain = _domain;
    }

    get_domain() {
        if ( this.domain === null || this.domain === undefined ) {
            return 'localhost';
        }
        return this.domain;
    }

    set_access_token(_access_token: string) {
        this.access_token = _access_token;
    }

    get_access_token() {
        return this.access_token;
    }

    set_placement(_placement: string) {
        this.placement = _placement;
    }

    get_placement() {
        return this.placement;
    }

    get_entity_type () {
        let entity_type = '';
        switch (this.get_placement()) {
            case 'CRM_DEAL_DETAIL_TAB':
                entity_type = 'deal';
                break;
            case 'CRM_CONTACT_DETAIL_TAB':
                entity_type = 'contact';
                break;
            default:
                entity_type = 'undefined';

        }
        return entity_type;
    }

    get_placement_options_id() {
        return this.placement_options.get_id();
    }

    get_placement_options() {
        return this.placement_options;
    }

    get_collections_count() {
        return this.collections_count;
    }

    set_collections_count( count:number ) {
        this.collections_count = count;
    }

    get_entity_id() {
        this.reload_placement_option_id();
        // console.log('this.placement_options.get_id() = ' + this.placement_options.get_id());
        if ( this.placement_options.get_id() === null ) {
            return 1;
        }
        return this.placement_options.get_id();
    }

    reload_placement_option_id () {
        try {
            let placement_options = this.app_root_element.getAttribute('bitrix24_placement_options').replace(/\'/g, '"');
            // console.log(this.app_root_element.getAttribute('bitrix24_placement_options'));
            // console.log(placement_options);
            if (placement_options != null) {
                let placement_options_parsed = JSON.parse(placement_options);
                // console.log('placement_options_parsed.ID = ' + placement_options_parsed.ID);
                this.placement_options.set_id(placement_options_parsed.ID);
            }
        } catch (e) {
            // console.log(e);
        }
    }

    init_input_parameters() {
        if ( this.params_inited ) {
            return;
        }
        // console.log('Решить загрузку битрикс24 параметров один раз');
        let app_root_element;
        let elements = [];
        if (this.document.getElementById('angular_search')) {
            app_root_element = this.document.getElementById('angular_search');
        } else if (this.document.getElementById('angular_search_ankonsul')) {
            app_root_element = this.document.getElementById('angular_search_ankonsul');
        } else if (this.document.getElementById('app_root')) {
            app_root_element = this.document.getElementById('app_root');
        }
        this.app_root_element = app_root_element;

        if (app_root_element.getAttribute('bitrix24_access_token')) {
            this.set_access_token(app_root_element.getAttribute('bitrix24_access_token'));
        }
        if (app_root_element.getAttribute('bitrix24_domain')) {
            this.set_domain(app_root_element.getAttribute('bitrix24_domain'));
        }
        if (app_root_element.getAttribute('bitrix24_placement')) {
            this.placement = app_root_element.getAttribute('bitrix24_placement');
        }
        if (app_root_element.getAttribute('bitrix24_placement_options')) {
            try {
                let placement_options = app_root_element.getAttribute('bitrix24_placement_options').replace(/\'/g, '"');
                // console.log(placement_options);
                if (placement_options != null) {
                    let placement_options_parsed = JSON.parse(placement_options);
                    this.placement_options.set_id(placement_options_parsed.ID);
                }
            } catch {
            }
        }
        if (app_root_element.getAttribute('bitrix24_user_option')) {
            this.set_bitrix24_user_option(app_root_element.getAttribute('bitrix24_user_option'));
        }
        this.params_inited = true;


        //console.log(this.access_token);
        //console.log(this.domain);
        //console.log(this.placement);
        //console.log(this.placement_options);
    }

    set_bitrix24_user_option (user_option: string) {
        try {
            this.bitrix24_user_option = user_option;
            let user_option_replaced = user_option.replace(/\'/g, '"');
            // console.log(placement_options);
            if (user_option_replaced != null) {
                let user_options_parsed = JSON.parse(user_option_replaced);
                this.placement_options.set_user_option(user_options_parsed);
            }
        } catch {
        }
    }

    get_bitrix24_user_option () {
        return this.bitrix24_user_option.replace(/\'/g, '"');
    }

    is_bitrix24_inited () {
        if ( this.get_access_token() != null ) {
            return true;
        }
        return false;
    }
}