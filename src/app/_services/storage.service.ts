import { Injectable} from '@angular/core';
import {Bitrix24Service} from "../integrations/bitrix24/bitrix24.service";

@Injectable()
export class StorageService {
    constructor(
        protected bitrix24Service: Bitrix24Service,
    ) {
        this.bitrix24Service.init_input_parameters();
    }

    getItem (key: string) {
        //return localStorage.getItem(key);
        //заглушка
        //console.log(this.bitrix24Service);
        if ( this.bitrix24Service.is_bitrix24_inited() ) {
            try {
                if ( key === 'api_url' && this.bitrix24Service.get_placement_options().get_user_option().get_value('api_url') != null ) {
                    return this.bitrix24Service.get_placement_options().get_user_option().get_value('api_url');
                }
                if (
                    this.bitrix24Service.get_placement_options().get_user_option().get_value('session_key') != null &&
                    key === 'currentUser'
                ) {
                    //console.log(this.bitrix24Service.get_bitrix24_user_option());
                    return this.bitrix24Service.get_bitrix24_user_option();
                } else {
                    return localStorage.getItem(key);
                }

            } catch (e) {

            }
        }
        return localStorage.getItem(key);
    }

    setItem (key: string, value: any) {
        //Установка user_option
        localStorage.setItem(key, value);

        if ( this.bitrix24Service.is_bitrix24_inited() ) {
            if ( key === 'currentUser') {
                //console.log('Storage set currentUser');
                try {
                    this.bitrix24Service.user_option_set(JSON.parse(value) || [])
                        .subscribe(
                            (response: any) => {
                                // console.log(response);
                            }
                        );
                } catch (e) {

                }
                this.bitrix24Service.set_bitrix24_user_option(value.replace(/"/g, '\''));
            }
        }
    }
}
