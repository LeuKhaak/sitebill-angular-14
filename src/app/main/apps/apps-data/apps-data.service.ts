import {Injectable} from '@angular/core';
import {ModelService} from "../../../_services/model.service";
import {ApiParams} from "../../../_models";

export class MenuItem {
    title: string;
    tag: string;
    params: ApiParams;
}


@Injectable()
export class AppsDataService {
    public main_menu: MenuItem[];
    private active_menu_item: MenuItem;

    constructor(
        private modelService: ModelService,
    )
    {
        this.main_menu = [
            {
                title: 'Мои',
                tag: 'my',
                params: {
                    user_id: this.modelService.get_user_id()
                }
            },
            {
                title: 'Все',
                tag: 'all',
                params: {

                }
            },
            {
                title: 'Активные',
                tag: 'active',
                params: {
                    active: 1,
                }
            },
            {
                title: 'В архиве',
                tag: 'archive',
                params: {
                    active: 0,
                }
            },
        ];
    }

    setActiveMenuItem(item: MenuItem) {
        // console.log(item);
        this.active_menu_item = item;
    }

    getActiveMenuItem () {
        return this.active_menu_item;
    }

    getMenuItemByTag ( tag:string ): MenuItem {
        return this.main_menu.filter(item => item.tag === tag)[0];
    }
}
