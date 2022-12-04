import { Injectable } from '@angular/core';
import {SitebillEntity} from "../_models";

@Injectable()
export class EntityStorageService {
    private storage: SitebillEntity[];

    constructor() {
        this.storage = [];
    }

    set_entity ( key: string, entity: SitebillEntity ) {
        this.storage[key] = entity;
    }

    get_entity ( key: string ) {
        if ( this.storage[key] ) {
            return this.storage[key];
        }
        return null;
    }

}