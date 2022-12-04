export const SB_DATE_FORMAT = 'YYYY-MM-DD';

export const SB_RATE_TYPES = {
    '10': {
        title: 'Регулярная цена за день',
        rateType: 'RDAY',
        rateTypeValue: '10',
    },
    '20': {
        title: 'Регулярная цена за месяц',
        rateType: 'RMONTH',
        rateTypeValue: '20',
    },
    '30': {
        title: 'Цена за период',
        rateType: 'RPERIOD',
        rateTypeValue: '30',
    },
    '40': {
        title: 'Регулярная цена за уикенд (сб, вс)',
        rateType: 'RWEEKEND',
        rateTypeValue: '40',
    },
    '50': {
        title: 'Регулярная цена за день недели',
        rateType: 'RWEEKDAY',
        rateTypeValue: '50',
    },
    '60': {
        title: 'Сезонная цена за месяц',
        rateType: 'SMONTH',
        rateTypeValue: '60',
    },
    '70': {
        title: 'Цена за период',
        rateType: 'SPERIOD',
        rateTypeValue: '70',
    },
    '80': {
        title: 'Сезонная цена за уикенд (сб, вс)',
        rateType: 'SWEEKEND',
        rateTypeValue: '80',
    },
    '90': {
        title: 'Сезонная цена за день недели',
        rateType: 'SWEEKDAY',
        rateTypeValue: '90',
    },
};

export const SB_MONTHS = [
    {id: 1, title: 'Январь'},
    {id: 2, title: 'Февраль'},
    {id: 3, title: 'Март'},
    {id: 4, title: 'Апрель'},
    {id: 5, title: 'Май'},
    {id: 6, title: 'Июнь'},
    {id: 7, title: 'Июль'},
    {id: 8, title: 'Август'},
    {id: 9, title: 'Сентябрь'},
    {id: 10, title: 'Октябрь'},
    {id: 11, title: 'Ноябрь'},
    {id: 12, title: 'Декабрь'},
];

export const SB_WEEKDAYS = [
    {id: 1, title: 'пн'},
    {id: 2, title: 'вт'},
    {id: 3, title: 'ср'},
    {id: 4, title: 'чт'},
    {id: 5, title: 'пт'},
    {id: 6, title: 'сб'},
    {id: 7, title: 'вс'},
];

export enum SB_EVENTS_STATE {
    loading,
    ready,
    error,
};