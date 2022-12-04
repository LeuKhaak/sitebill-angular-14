import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'data',
        title: 'Объекты',
        type: 'item',
        icon: 'home',
        url: 'grid/data',
        /*
        badge    : {
            title    : '25',
            translate: 'NAV.SAMPLE.BADGE',
            bg       : '#F44336',
            fg       : '#FFFFFF'
        }
        */
    },
    {
        id: 'parser',
        title: 'Парсер',
        type: 'item',
        icon: 'cloud',
        url: 'grid/parser',
        badge    : {
            title    : '',
            bg       : '#F44336',
            fg       : '#FFFFFF'
        }
    },
    {
        id: 'complex',
        title: 'ЖК',
        type: 'item',
        icon: 'location_city',
        url: 'grid/complex',
    },
    {
        id: 'client',
        title: 'Клиенты',
        type: 'item',
        icon: 'favorite',
        url: 'grid/client',
        /*
        badge    : {
            title    : '25',
            translate: 'NAV.SAMPLE.BADGE',
            bg       : '#F44336',
            fg       : '#FFFFFF'
        }
        */
    },
    /*
    {
        id: 'bitrix24collections',
        title: 'Подборки',
        type: 'item',
        icon: 'playlist_add',
        url: 'grid/collections',
    },
    */
    {
        id: 'dictionaries',
        title: 'Справочники',
        type: 'collapsable',
        icon: 'language',
        children: [
            {
                id: 'country',
                title: 'Страны',
                type: 'item',
                url: 'grid/country'
            },
            {
                id: 'region',
                title: 'Регионы',
                type: 'item',
                url: 'grid/region'
            },
            {
                id: 'city',
                title: 'Города',
                type: 'item',
                url: 'grid/city'
            },
            {
                id: 'district',
                title: 'Районы',
                type: 'item',
                url: 'grid/district'
            },
            {
                id: 'metro',
                title: 'Метро',
                type: 'item',
                url: 'grid/metro'
            },
            {
                id: 'street',
                title: 'Улицы',
                type: 'item',
                url: 'grid/street'
            },
        ]
    },

    {
        id: 'content',
        title: 'Контент',
        type: 'collapsable',
        icon: 'free_breakfast',
        children: [
            {
                id: 'news',
                title: 'Новости',
                type: 'item',
                url: 'grid/news'
            },
            {
                id: 'page',
                title: 'Страницы',
                type: 'item',
                url: 'grid/page'
            },
            {
                id: 'menu',
                title: 'Меню',
                type: 'item',
                url: 'grid/menu'
            },
        ]
    },

    {
        id: 'user',
        title: 'Пользователи',
        type: 'item',
        icon: 'supervisor_account',
        url: 'grid/user',
        /*
        badge    : {
            title    : '25',
            translate: 'NAV.SAMPLE.BADGE',
            bg       : '#F44336',
            fg       : '#FFFFFF'
        }
        */
    },
    {
        id: 'config',
        title: 'Настройки',
        type: 'item',
        icon: 'settings',
        url: 'config',
    },
    {
        id: 'models-editor',
        title: 'Редактор форм',
        type: 'item',
        icon: 'developer_board',
        url: 'models-editor',
    },

    /*
    {
        id       : 'sample',
        title    : 'Sample',
        type     : 'item',
        icon     : 'logout',
        url      : 'sample'
    },
    */

    /*
    {
        id       : 'allobjects',
        title    : 'Все объекты',
        type     : 'item',
        icon     : 'email',
        url      : '/documentation/components-third-party/datatables/ngx-datatable/all',
        badge    : {
            title    : '250',
            translate: 'NAV.SAMPLE.BADGE',
            bg       : '#F44336',
            fg       : '#FFFFFF'
        }
    },
    {
        id       : 'clientobjects',
        title    : 'Подборки клиента',
        type     : 'item',
        icon     : 'email',
        url      : '/apps/mail-ngrx/inbox/',
        badge    : {
            title    : '250',
            translate: 'NAV.SAMPLE.BADGE',
            bg       : '#F44336',
            fg       : '#FFFFFF'
        }
    },
    */

    {
        id: 'access',
        title: 'Доступ',
        type: 'collapsable',
        icon: 'vpn_key',
        children: [
            {
                id: 'group',
                title: 'Группы',
                type: 'item',
                url: 'grid/group'
            },
            {
                id: 'component',
                title: 'Компоненты',
                type: 'item',
                url: 'grid/component'
            },
            {
                id: 'function',
                title: 'Функции',
                type: 'item',
                url: 'grid/function'
            },
        ]
    },

    {
        id: 'login',
        title: 'Выход',
        type: 'item',
        icon: 'exit_to_app',
        url: '/login'
    },
];
