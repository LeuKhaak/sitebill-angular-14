import { Injectable, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { SitebillEntity } from 'app/_models';
import {StorageService} from "./storage.service";

@Injectable()
export class FilterIterator {
    private counter: number;
    constructor() {
        this.counter = 0;
    }

    get_default_price_min () {
        return 0;
    }

    get_default_price_max () {
        return 10000000;
    }


    iterate (share_array, operation) {
        let counter = 0;
        for (let key in share_array) {
            if ( share_array[key] !== null ) {
                let type = typeof share_array[key];
                // console.log(type);
                switch (type) {
                    case 'object':
                        if (Object.keys(share_array[key]).length > 0) {
                            if (this.do_operation(operation)) {
                                counter++;
                            }
                        }
                        break;
                    case 'number':
                        if ( key === 'price_min' && share_array[key] == this.get_default_price_min() ) {

                        } else if ( key === 'price_max' && share_array[key] == this.get_default_price_max() ) {

                        } else {
                            this.do_operation(operation);
                            counter++;
                        }
                        break;
                    case 'string':
                        if ( share_array[key].length > 0 ) {
                            counter++;
                        }
                    default:
                        // console.log(type);

                }
            }
        }
        return counter;
        //return this.get_operation_result();
    }

    do_operation ( operation ) {
        switch ( operation ) {
            case 'counter':
                return true;
                //this.counter++;
                break;

        }
        return false;
    }

    get_operation_result () {
        return this.counter;
    }
}

@Injectable()
export class FilterService {
    private share_array = [];
    private params_count = [];
    private share_counter_array = [];

    @Output() change: EventEmitter<any> = new EventEmitter();
    @Output() share: EventEmitter<any> = new EventEmitter();


    constructor(
        protected storageService: StorageService,
        protected filterIterator: FilterIterator,
    ) {
        // this.share_array = [];
    }

    onInnerChange(value) {
        this.share.emit(value);
    }

    save(controls: any) {
        this.change.emit(controls);
    }
    share_data(entity: SitebillEntity, key: string, datas: any) {
        let params_count = this.get_params_count(entity.get_app_name());

        if (params_count == null) {
            params_count = 0;
            this.set_params_count(entity.get_app_name(), params_count);
        }
        ++params_count;
        // console.log('params_count = ' + params_count);
        this.set_params_count(entity.get_app_name(), params_count);

        // console.log(this.share_array[entity.get_app_name()]);

        this.set_share_array(entity.get_app_name(), key, datas);
        // console.log(this.share_array);
        this.onInnerChange(entity);
    }

    share_any_data (app_name: string, key: string, datas: any) {
        if (this.params_count[app_name] == null) {
            this.params_count[app_name] = 0;
        }
        this.params_count[app_name]++;
        if (this.share_array[app_name] == null) {
            this.share_array[app_name] = [];
        }
        this.share_array[app_name][key] = datas;
        // console.log(this.share_array);
        this.onInnerChange(app_name);

    }
    unshare_data(entity: SitebillEntity, key: string) {
        if (this.get_share_array(entity.get_app_name()) != null ) {
            delete (this.share_array[entity.get_app_name()][key]);
            this.onInnerChange(entity);
        }
    }
    empty_share(entity: SitebillEntity) {
        this.onInnerChange(entity);
    }

    share_counter(entity: SitebillEntity, key: string, datas: any) {
        if (this.share_counter_array[entity.get_app_name()] == null) {
            this.share_counter_array[entity.get_app_name()] = [];
        }
        this.share_counter_array[entity.get_app_name()][key] = datas;
    }

    get_counter_value(app_name: string, key: string) {
        if (this.share_counter_array[app_name] != null) {
            return this.share_counter_array[app_name][key];
        }
        return null;
    }
    get_share_data (app_name: string, key: string) {
        const share_array = this.get_share_array(app_name);
        try {
            if (share_array[key] != null) {
                return share_array[key];
            }
        } catch (e) {

        }
        return null;
    }

    get_params_count (app_name: string ) {
        const params_count = this.get_params_count_array();
        if (params_count !== null) {
            return params_count[app_name];
        }
        return null;
    }

    get_params_count_array() {
        const params_count_array = JSON.parse(this.storageService.getItem('sitebill_params_count_' + this.get_postfix()));
        if (params_count_array !== null) {
            return params_count_array;
        }
        return null;
    }

    set_params_count (app_name: string, count: number ) {
        let params_count_array = this.get_params_count_array();
        if ( params_count_array === null ) {
            params_count_array = {};
        }
        params_count_array[app_name] = count;
        this.storageService.setItem('sitebill_params_count_' + this.get_postfix(), JSON.stringify(params_count_array));
    }

    get_postfix ( app_name = 'global_options' ) {
        const currentUser = JSON.parse(this.storageService.getItem('currentUser'));
        let user_id = 0;
        if ( currentUser !== null ) {
            user_id = currentUser['user_id'];
        }
        return app_name + '_' + user_id;
    }


    get_share_array(app_name: string): any {
        const array_title = 'sitebill_share_array_' + this.get_postfix(app_name);

        const share_array_local = JSON.parse(this.storageService.getItem(array_title));
        try {
            return share_array_local;
        } catch (e) {
            // console.log('null share for app = ' + app_name);
            return null;
        }
    }

    count_share_array (app_name: string): number {
        const share_array = this.get_share_array(app_name);
        let counter = 0;
        if (share_array !== null) {
            counter = this.filterIterator.iterate(share_array, 'counter');
        }
        return counter;
    }

    reset (entity: SitebillEntity) {
        const array_title = 'sitebill_share_array_' + this.get_postfix(entity.get_app_name());
        const prev_share_array = this.get_share_array(entity.get_app_name());
        const share_array_local = {};
        if ( prev_share_array.topic_id && prev_share_array.region_id) {
            const share_array_local_uniq = {
                topic_id: null,
                region_id: null
            };

            share_array_local_uniq.topic_id = prev_share_array.topic_id;
            share_array_local_uniq.region_id = prev_share_array.region_id;
            this.storageService.setItem(array_title, JSON.stringify(share_array_local_uniq));
        } else {
            this.storageService.setItem(array_title, JSON.stringify(share_array_local));
        }


        this.onInnerChange(entity);
    }



    set_share_array(app_name: string, key: string, datas: any) {
        const array_title = 'sitebill_share_array_' + this.get_postfix(app_name);

        let share_array_local = JSON.parse(this.storageService.getItem(array_title));
        // console.log(share_array_local);
        if (share_array_local === null) {
            share_array_local = {};
        }
        share_array_local[key] = datas;
        // share_array_local[key] = 'test';

        // console.log(share_array_local);
        // console.log(JSON.stringify(share_array_local));
        this.storageService.setItem(array_title, JSON.stringify(share_array_local));
    }
}
