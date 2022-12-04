export class currentUser {
    admin_panel_login: number;
    session_key: string;
    success: number;
    user_id: number;
    profile: UserProfile;
}

export class UserProfile {
    group_id: ModelItem;
    user_id: ModelItem;
    fio: ModelItem;
    phone: ModelItem;
    email: ModelItem;
    imgfile: ModelItem;
    constructor () {
        this.user_id = new ModelItem();
        this.group_id = new ModelItem();
        this.fio = new ModelItem();
        this.phone = new ModelItem();
        this.email = new ModelItem();
        this.imgfile = new ModelItem();
    }
}

export class ModelItem {
    value: string;
    value_string: string;
    constructor () {
        this.value = null;
        this.value_string = null;
    }
}
