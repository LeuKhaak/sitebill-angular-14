export class Bitrix24Entity {
    private DEAL_ID: number;
    constructor() {
        this.set_deal_id(null);
    }

    set_deal_id(id: number) {
        this.DEAL_ID = id;
    }
    get_deal_id() {
        return this.DEAL_ID;
    }
}

export class HashAccessor {
    private hash: {};
    constructor() {
        this.set_hash(null);
    }

    set_hash(hash: {}) {
        this.hash = hash;
    }
    get_value(key: string) {
        if ( this.hash != null ) {
            if ( this.hash[key] != null ) {
                return this.hash[key];
            }
        }
        return null;
    }
}


export class Bitrix24PlacementOptions {
    private ID: number;
    private USER_OPTION: HashAccessor;
    constructor() {
        this.set_id(null);
    }

    set_id( id: number) {
        this.ID = id;
    }
    get_id() {
        return this.ID;
    }

    set_user_option( user_option: {}) {
        let hash = new HashAccessor();
        hash.set_hash(user_option);
        this.USER_OPTION = hash;
    }
    get_user_option() {
        return this.USER_OPTION;
    }

}
