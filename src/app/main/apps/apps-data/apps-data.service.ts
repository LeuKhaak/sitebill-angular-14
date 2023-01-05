import {Injectable} from '@angular/core';
import {ApiParams} from '../../../_models';
import {GetSessionKeyService} from '../../../_services/get-session-key.service';

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
        protected getSessionKeyService: GetSessionKeyService,
    )
    {
        this.main_menu = [
            {
                title: 'Мои',
                tag: 'my',
                params: {
                    user_id: this.getSessionKeyService.get_user_id()
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

    setActiveMenuItem(item: MenuItem): void {
        // console.log(item);
        this.active_menu_item = item;
    }

    getActiveMenuItem(): MenuItem {
        return this.active_menu_item;
    }

    getMenuItemByTag( tag: string ): MenuItem {
        return this.main_menu.filter(item => item.tag === tag)[0];
    }
}
