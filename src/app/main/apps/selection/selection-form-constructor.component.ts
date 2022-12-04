import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { ModelService } from '../../../_services/model.service';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    FormArray,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { SnackService } from '../../../_services/snack.service';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    takeUntil,
} from 'rxjs/operators';
import { FormType, SitebillEntity, SitebillModelItem } from '../../../_models';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { ConfirmComponent } from '../../../dialogs/confirm/confirm.component';
import { FilterService } from '../../../_services/filter.service';
import { Bitrix24Service } from '../../../integrations/bitrix24/bitrix24.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
    MAT_TOOLTIP_DEFAULT_OPTIONS,
    MatTooltipDefaultOptions,
} from '@angular/material/tooltip';
import { SitebillResponse } from '../../../_models/sitebill-response';
import { ChatService, CommentsBlockMeta } from '../../apps/chat/chat.service';
import { fuseAnimations } from '../../../../@fuse/animations';
import { StorageService } from '../../../_services/storage.service';
import { SelectionItems } from './selection-items';
import { objectKeys } from 'codelyzer/util/objectKeys';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
    showDelay: 1000,
    hideDelay: 1000,
    touchendHideDelay: 1000,
};

export function forbiddenNullValue(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        return control.value == null || control.value === 0
            ? { forbiddenNullValue: { value: control.value } }
            : null;
    };
}

@Component({
    selector: 'form-selector',
    templateUrl: './selection-form.component.html',
    styleUrls: ['./selection-form.component.scss'],
    animations: fuseAnimations,
    providers: [
        {
            provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
            useValue: myCustomTooltipDefaults,
        },
        StorageService,
    ],
})
export class SelectionFormConstructorComponent implements OnInit {
    // storageService: StorageService;

    constructor(
        protected modelService: ModelService,
        protected _formBuilder: FormBuilder,
        protected _snackService: SnackService,
        protected filterService: FilterService,
        protected bitrix24Service: Bitrix24Service,
        public _matDialog: MatDialog,
        protected cdr: ChangeDetectorRef,
        protected storageService: StorageService
    ) {
        this._unsubscribeAll = new Subject();
        this.loadingIndicator = true;

        // Set the private defaults
        this.api_url = this.modelService.get_api_url();
        this.lat_center = 55.76;
        this.lng_center = 37.64;
        this.form = this._formBuilder.group({});
        if (!this.height) {
            this.height = '100vh';
        }

        // this.storageService = new StorageService(this.bitrix24Service);
        this.savedNumber = +storageService.getItem('numberOfColumns');
        this.numberOfColumns = this.savedNumber ? this.savedNumber : 3;
    }
    form: FormGroup;
    public _data: { entity: SitebillEntity; selectionMode: boolean };
    public entity: SitebillEntity;
    public error_message: string = null;
    protected _unsubscribeAll: Subject<any>;

    public text_area_editor_storage = {};
    public parameters_storage = {};
    public options_storage = {};
    public options_storage_buffer = {};
    public loading: boolean;
    private selectBufferSize = 100;
    private numberOfItemsFromEndBeforeFetchingMore = 10;
    input$ = new Subject<string>();
    private termsearch = false;

    filterValue = {};
    currentYear = new Date().getFullYear();
    form_submitted = false;
    form_inited = false;
    rows: string[];
    tabs: any;
    tabs_keys: string[];
    records: SitebillModelItem[];
    api_url: string;
    render_value_string_array = [
        'empty',
        'select_box',
        'select_by_query',
        'select_box_structure',
        'date',
    ];
    render_value_array = [
        'empty',
        'textarea_editor',
        'safe_string',
        'textarea',
        'primary_key',
    ];
    square_options: any[] = [{ id: 1, value: 'range', actual: 1 }];
    galleryImages = {};
    latitude: any;
    longitude: any;
    lat: any;
    lng: any;
    lat_center: any;
    lng_center: any;
    form_title: string;

    selectionParams: any = {};
    itemsArray: any = {};
    currency = '$';
    currencyList: any;

    loadingIndicator: boolean;
    confirmDialogRef: MatDialogRef<ConfirmComponent>;

    disable_delete: boolean;
    disable_form_title_bar: boolean;
    disable_save_button = false;
    disable_cancel_button = false;
    fake_save = false;

    savedNumber: number;
    numberOfColumns: number;

    @Input('predefined_ql_items')
    predefined_ql_items: any;

    @Input('column_mode')
    column_mode: number;

    @Input('height')
    height: any;

    @Input('disable_mat_dialog_content_tag')
    disable_mat_dialog_content_tag = false;

    onSave = new EventEmitter();
    afterSave = new EventEmitter();

    @Output() afterFormInited = new EventEmitter();

    private visible_items_counter: number;
    commentsBlockMeta: CommentsBlockMeta = {};

    private comment_open = false;

    quillConfig = {
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                ['blockquote', 'code-block'],

                [{ header: 1 }, { header: 2 }], // custom button values
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
                [{ direction: 'rtl' }], // text direction

                [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
                [{ header: [1, 2, 3, 4, 5, 6, false] }],

                [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                [{ font: [] }],
                [{ align: [] }],

                ['clean'], // remove formatting button
            ],
        },
    };

    editorOptions = {
        theme: 'snow',
        modules: {
            toolbar: {
                container: [
                    [{ placeholder: ['[GuestName]', '[HotelName]'] }], // my custom dropdown
                    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                    ['blockquote', 'code-block'],

                    [{ header: 1 }, { header: 2 }], // custom button values
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
                    [{ direction: 'rtl' }], // text direction

                    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],

                    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                    [{ font: [] }],
                    [{ align: [] }],

                    ['clean'], // remove formatting button
                ],
                handlers: {
                    placeholder: function(value) {
                        if (value) {
                            const cursorPosition =
                                this.quill.getSelection().index;
                            this.quill.insertText(cursorPosition, value);
                            this.quill.setSelection(
                                cursorPosition + value.length
                            );
                        }
                    },
                },
            },
        },
    };

    unusedItems = [
        'exclusive_agrrement',
        'image',
        'geo',
        'active',
        'Internal_notes',
        'hot',
        'korpnr',
        'meta_description',
        'meta_keywords',
        'meta_title',
        'owner_fio',
        'planning_en',
        'planning_ua',
        'region_id',
        'rayon_id',
        'flatnumber',
        'owner_phone',
        'translit_alias',
        'walls',
        'text',
        'text_en',
        'text_ua',
        'view_count',
        'youtube',
        'date_added',
        // 'id',
    ];

    ngOnInit() {
        // Reactive Form
        this._data.entity.set_readonly(false);
        if (this._data.entity.is_delete_disabled()) {
            this.disable_delete = true;
        }
        this.getModel();
        this.initSubscribers();
        this.getCurrency();

        const filters = this.filterService.get_share_array(this._data.entity.get_app_name());
        this.entity = this._data.entity;
        // console.log(filters);
    }

    initSubscribers() {}

    getCurrency(): void {
        this.modelService
            .loadById('currency', 'currency', null)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                // console.log(result);
            });
        this.modelService
            .load('currency', null, null, null, null, null)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.currencyList = result.rows;
                // console.log(this.currencyList);
            });
    }

    getModel(): void {
        const primary_key = this._data.entity.primary_key;
        const key_value = this._data.entity.get_key_value();
        const model_name = this._data.entity.get_table_name();
        // console.log(this.modelService.entity);
        this.modelService.entity.set_app_name(this._data.entity.get_app_name());
        this.modelService.entity.set_table_name(
            this._data.entity.get_table_name()
        );
        this.modelService.entity.primary_key = primary_key;
        this.modelService.entity.key_value = key_value;
        if (this.predefined_ql_items) {
            this._data.entity.set_hidden(primary_key);
            this.modelService.entity.set_hidden(primary_key);
        }

        this.modelService
            .loadById(
                model_name,
                primary_key,
                key_value,
                this.predefined_ql_items
            )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                // console.log(result)
                if (result) {
                    if (result.state === 'error') {
                        this._snackService.message(result.message);
                        this.close();
                        this.error_message = result.message;
                        return false;
                    } else {
                        // console.log(result.data);
                        this.initSelectForm(result.data);
                        this.init_form();
                    }
                    this.cdr.markForCheck();
                }
            });
    }

    initSelectForm(data): any {
        const items_array = data;

        this.unusedItems.forEach((item) => {
            if (items_array[item]) {
                delete items_array[item];
            }
        });

        // console.log(items_array);

        const itemsNames = Object.keys(items_array);

        const names = SelectionItems.names.concat(
            itemsNames
        );

        itemsNames.forEach((item) => {
            items_array[item].hint = '';
            items_array[item].required = 'off';
            if (
                items_array[item].type === 'select_by_query'
            ) {
                items_array[item].type = 'select_by_query_multi';
            }
            this.filterValue[item] = '';
        });

        // const fromToArray = [
        //     'year',
        //     'price',
        //     'room_count',
        //     'floor',
        //     'floor_count',
        //     'square_all',
        //     'square_live',
        //     'square_kitchen',
        //     'land_area',
        //     'ceiling_height',
        // ];
        //
        // fromToArray.forEach((item) => {
        //     if (items_array[item]) {
        //         items_array[item].type = 'fromTo';
        //     }
        // });

        items_array.currency_id.type = 'select_by_query';
        items_array.price.type = 'fromTo';
        // временно закомментировано - пока в базу не добавлен год постройки
        // items_array.year.type = 'fromTo';
        items_array.postponded_to.type = 'checkbox';
        items_array.postponded_to.title = 'Отложено';
        // items_array.commercialtype_id.hidden = false;

        this.itemsArray = Object.assign(
            SelectionItems.items,
            items_array
        );

       //  objectKeys(this.itemsArray).forEach(item => {
       //     console.log(this.itemsArray[item].name, this.itemsArray[item].type);
       // });

        // console.log(this.itemsArray);

        this.records = this.itemsArray;

        for (const [key_obj, value_obj] of Object.entries(this.itemsArray)) {
            this.records[key_obj] = new SitebillModelItem(value_obj);
        }

        this.rows = names;

        // console.log(this.rows);

        this._data.entity.model = this.records;
        this.tabs = {
            Основное: names,
        };
        this.tabs_keys = [Object.keys(this.tabs)[0]];
        // this.setSelectedParams(names, fromToArray);
    }

    selectItem(value, name): void {
        this.changeCurrency(value, name);
        this.filterService.share_data(this.entity, name, value);
    }

    changeCurrency(value, name): void {
        if (name === 'currency_id') {
           this.currencyList.forEach(item => {
             if (item.currency_id.value === value) {
                 this.currency = item.name.value;
             }
           });
        }
    }

    setSelectedParams(names, fromTo): void {
        // console.log(items);
        names.forEach((item) => {
            this.selectionParams[item] = this.itemsArray[item].value;
        });

        // console.log(this.selectionParams);
    }

    getEditingMode(): boolean {
        return this._data.entity.get_key_value() && !this._data.selectionMode;
    }

    getCreationMode(): boolean {
        return !this._data.entity.get_key_value() && !this._data.selectionMode;
    }

    getAnableComments(): boolean {
        return (
            !this._data.selectionMode &&
            this._data.entity.is_enable_comment() &&
            this.modelService.get_access('comment', 'access')
        );
    }

    getInputValue(name) {
        if (name === 'year') {
            return this.currentYear;
        }
    }

    init_form() {
        // Сначала нужно получить значение topic_id
        // В цикле, есть есть совпадения с active_in_topic, тогда применяем правила ОБЯЗАТЕЛЬНОСТИ
        // При смене типа в форме, надо перезапускать процесс показа/валидации элементов
        // console.log(this.rows);
        for (let i = 0; i < this.rows.length; i++) {
            // console.log(this.records);
            const form_control_item = new FormControl(
                this.records[this.rows[i]].value
            );
            form_control_item.clearValidators();
            this.records[this.rows[i]].required_boolean = false;

            if (this._data.entity.get_hidden_column_edit(this.rows[i])) {
                this.records[this.rows[i]].hidden = true;
            } else {
                this.records[this.rows[i]].hidden = false;
            }
            if (
                this.records[this.rows[i]].active_in_topic !== '0' &&
                this.records[this.rows[i]].active_in_topic != null
            ) {
                this.records[this.rows[i]].active_in_topic_array =
                    this.records[this.rows[i]].active_in_topic.split(',');
            } else {
                this.records[this.rows[i]].active_in_topic_array = null;
            }

            if (this.records[this.rows[i]].required === 'on') {
                if (!this.records[this.rows[i]].hidden) {
                    form_control_item.setValidators(forbiddenNullValue());
                    this.records[this.rows[i]].required_boolean = true;
                }
            }
            if (this.records[this.rows[i]].name === 'email') {
                form_control_item.setValidators(Validators.email);
            }
            // console.log(this.rows[i]);
            // console.log(form_control_item);

            this.form.addControl(this.rows[i], form_control_item);

            if (
                this.is_date_type(this.records[this.rows[i]].type) &&
                this.records[this.rows[i]].value === 'now'
            ) {
                this.form.controls[this.rows[i]].patchValue(moment());
            }

            if (this.records[this.rows[i]].type === 'textarea_editor') {
                this.text_area_editor_storage[this.records[this.rows[i]].name] =
                    this.records[this.rows[i]].value;
            }

            if (this.records[this.rows[i]].type === 'parameter') {
                this.parameters_storage[this.records[this.rows[i]].name] =
                    this.records[this.rows[i]].value;
            }

            if (
                this.records[this.rows[i]].type === 'select_by_query' ||
                this.records[this.rows[i]].type ===
                    'select_by_query_multiple' ||
                this.records[this.rows[i]].type === 'select_by_query_multi'
            ) {
                this.init_select_by_query_options(
                    this.records[this.rows[i]].name,
                    i
                );
                if (this.records[this.rows[i]].value === 0) {
                    this.form.controls[this.rows[i]].patchValue(null);
                }
            }
            if (
                this.records[this.rows[i]].type === 'select_box_structure' ||
                this.records[this.rows[i]].type ===
                    'select_box_structure_simple_multiple' ||
                this.records[this.rows[i]].type ===
                    'select_box_structure_multiple_checkbox'
            ) {
                this.init_select_by_query_options(
                    this.records[this.rows[i]].name,
                    i
                );
                if (this.records[this.rows[i]].value === 0) {
                    this.form.controls[this.rows[i]].patchValue(null);
                }
            }

            if (this.records[this.rows[i]].type === 'date') {
                // this.form.controls[this.rows[i]].patchValue();
                // console.log(this.records[this.rows[i]]);
                if (
                    this.records[this.rows[i]].value_string !== '' &&
                    this.records[this.rows[i]].value_string != null
                ) {
                    this.form.controls[this.rows[i]].patchValue(
                        moment(
                            this.records[this.rows[i]].value_string,
                            'DD.MM.YYYY'
                        )
                    );
                } else {
                    this.form.controls[this.rows[i]].patchValue(null);
                }
            }

            if (this.records[this.rows[i]].type === 'dttime') {
                this.form.controls[this.rows[i]].patchValue(
                    this.records[this.rows[i]].value.slice(10, 16)
                );
            }

            if (this.records[this.rows[i]].type === 'select_box') {
                this.init_select_box_options(this.records[this.rows[i]].name);
                if (
                    this.records[this.rows[i]].value_string === '' &&
                    this.records[this.rows[i]].value === ''
                ) {
                    this.form.controls[this.rows[i]].patchValue(null);
                }
            }

            if (this.records[this.rows[i]].type === 'checkbox') {
                if (this.records[this.rows[i]].value !== 1) {
                    this.form.controls[this.rows[i]].patchValue(false);
                }
            }

            if (this.records[this.rows[i]].type === 'geodata') {
                this.init_geodata(this.records[this.rows[i]].name);
            }

            if (this.records[this.rows[i]].type === 'photo') {
                this.init_photo_image(
                    this.records[this.rows[i]].name,
                    this.records[this.rows[i]].value
                );
            }

            if (this.records[this.rows[i]].type === 'uploads') {
                this.init_gallery_images(
                    this.records[this.rows[i]].name,
                    this.records[this.rows[i]].value
                );
            }

            if (this.records[this.rows[i]].parameters != null) {
                if (this.records[this.rows[i]].parameters.dadata === 1) {
                    this.hide_dadata(this.rows[i]);
                }
            }
            if (this._data.entity.is_hidden(this.rows[i])) {
                this.hide_row(this.rows[i]);
            }
            if (this._data.entity.get_default_value(this.rows[i])) {
                this.records[this.rows[i]].value =
                    this._data.entity.get_default_value(this.rows[i]);
                this.form.controls[this.rows[i]].patchValue(
                    this.records[this.rows[i]].value
                );
            }

            // if (this.rows[i] === 'id' || this.rows[i] === 'user_id') {
            //     this.records[this.rows[i]].hidden = true;
            // }
        }

        this.apply_topic_activity();
        this.form_inited = true;
        this.after_form_inited();
        this.count_visible_items();
        // console.log(this.records);
    }

    onChangeTextarea(newValue: string, name: string) {
        this.form.controls[name].patchValue(newValue);
    }

    count_visible_items() {
        this.visible_items_counter = 0;
        for (let i = 0; i < this.rows.length; i++) {
            if (
                !this.records[this.rows[i]].hidden &&
                this.records[this.rows[i]].type !== 'hidden'
            ) {
                this.visible_items_counter++;
            }
        }
    }
    get_visible_items_counter() {
        return this.visible_items_counter;
    }

    hide_dadata(row) {
        this.hide_row(row);
    }

    hide_row(row) {
        this.records[row].hidden = true;
        this.records[row].type = 'hidden';
    }

    show_row_soft(row) {
        this.records[row].hidden = false;
        if (this.records[row].type_native !== this.records[row].type) {
            this.records[row].type = this.records[row].type_native;
        }
    }

    get_records(): SitebillModelItem[] {
        return this.records;
    }

    get_SitebillModelItem(key: string): SitebillModelItem {
        return this.records[key];
    }

    init_geodata(columnName) {
        try {
            // console.log(parseFloat(this.records[columnName].value.lat));
            if (parseFloat(this.records[columnName].value.lat)) {
                this.lat = parseFloat(this.records[columnName].value.lat);
                this.lat_center = this.lat;
            } else {
                this.lat = '';
            }
            if (parseFloat(this.records[columnName].value.lng)) {
                this.lng = parseFloat(this.records[columnName].value.lng);
                this.lng_center = this.lng;
            } else {
                this.lng = '';
            }
        } catch {}
    }

    init_photo_image(field_name, image) {
        this.galleryImages[field_name] = [];
        const self = this;
        if (image !== '') {
            const item = {
                small:
                    self.api_url +
                    '/img/data/user/' +
                    image +
                    '?' +
                    new Date().getTime(),
                medium:
                    self.api_url +
                    '/img/data/user/' +
                    image +
                    '?' +
                    new Date().getTime(),
                big:
                    self.api_url +
                    '/img/data/user/' +
                    image +
                    '?' +
                    new Date().getTime(),
            };
            this.galleryImages[field_name][0] = item;
        } else {
            this.galleryImages[field_name] = [];
        }
    }

    init_gallery_images(field_name, images) {
        this.galleryImages[field_name] = {};
        const self = this;
        if (images) {
            this.galleryImages[field_name] = images.map((image: any) => {
                if (image.remote === 'true') {
                    return {
                        small: image.preview + '?' + new Date().getTime(),
                        medium: image.normal + '?' + new Date().getTime(),
                        big: image.normal + '?' + new Date().getTime(),
                    };
                } else {
                    return {
                        small:
                            self.api_url +
                            '/img/data/' +
                            image.preview +
                            '?' +
                            new Date().getTime(),
                        medium:
                            self.api_url +
                            '/img/data/' +
                            image.normal +
                            '?' +
                            new Date().getTime(),
                        big:
                            self.api_url +
                            '/img/data/' +
                            image.normal +
                            '?' +
                            new Date().getTime(),
                    };
                }
            });
        } else {
            this.galleryImages[field_name] = [];
        }
        // console.log(this.galleryImages[field_name]);
    }

    init_select_box_options(columnName) {
        if (this.records[columnName].api) {
            this.modelService
                .api_call(this.records[columnName].api)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: SitebillResponse) => {
                    this.options_storage[columnName] = result.data;
                });
        } else {
            this.options_storage[columnName] =
                this.records[columnName].select_data_indexed;
            try {
                this.options_storage[columnName].forEach((row, index) => {
                    row.id = row.id.toString();
                    row.value = row.value.toString();
                });
            } catch {}
        }
    }

    init_select_by_query_options(columnName, rowIndex = 0) {
        // console.log(this._data.get_default_params());
        this.termsearch = false;
        this.modelService
            .load_dictionary_model_with_params(
                this._data.entity.get_table_name(),
                columnName,
                this.get_ql_items_from_form(),
                true
            )
            // this.modelService.load_dictionary_model_all(this._data.get_table_name(), columnName)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result) {
                    this.options_storage[columnName] = result.data;
                    this.options_storage_buffer[columnName] =
                        this.options_storage[columnName].slice(
                            0,
                            this.selectBufferSize
                        );

                    if (
                        this.records[this.rows[rowIndex]].multiple &&
                        this.records[this.rows[rowIndex]].value
                    ) {
                        if (this.records[this.rows[rowIndex]].value === '0') {
                            this.form.controls[this.rows[rowIndex]].patchValue(
                                null
                            );
                        } else {
                            if (
                                !Array.isArray(
                                    this.records[this.rows[rowIndex]].value
                                )
                            ) {
                                this.form.controls[
                                    this.rows[rowIndex]
                                ].patchValue(
                                    this.records[
                                        this.rows[rowIndex]
                                    ].value.split(',')
                                );
                            }
                        }
                    } else {
                        if (this.records[this.rows[rowIndex]].value_string) {
                            this.initial_select_list(
                                this.records[this.rows[rowIndex]].name,
                                this.records[this.rows[rowIndex]].value_string
                            );
                        }
                    }
                    this.cdr.markForCheck();
                }
            });
    }

    onScrollToEnd(columnName: string) {
        this.fetchMore(columnName);
    }

    onScroll({ end }, columnName: string) {
        if (
            !this.options_storage[columnName] ||
            !this.options_storage_buffer[columnName]
        ) {
            return;
        }
        if (
            this.loading ||
            this.options_storage[columnName].length <=
                this.options_storage_buffer[columnName].length
        ) {
            return;
        }

        if (
            end + this.numberOfItemsFromEndBeforeFetchingMore >=
            this.options_storage_buffer[columnName].length
        ) {
            this.fetchMore(columnName);
        }
    }

    private fetchMore(columnName: string) {
        if (this.termsearch) {
            return;
        }
        const len = this.options_storage_buffer[columnName].length;
        const more = this.options_storage[columnName].slice(
            len,
            this.selectBufferSize + len
        );
        this.loading = true;
        // using timeout here to simulate backend API delay
        setTimeout(() => {
            this.loading = false;
            this.options_storage_buffer[columnName] =
                this.options_storage_buffer[columnName].concat(more);
        }, 200);
    }

    initial_select_list(columnName: string, term: string) {
        if (typeof this.options_storage[columnName] === 'object') {
            this.options_storage_buffer[columnName] = this.options_storage[
                columnName
            ]
                .filter((item) => item.value.includes(term))
                .slice(0, this.selectBufferSize);
        }
    }

    onSearch(columnName: string) {
        this.input$
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                map((term) => {
                    this.options_storage_buffer[columnName] =
                        this.options_storage[columnName]
                            .filter((item) => item.value.includes(term))
                            .slice(0, this.selectBufferSize);

                    this.termsearch = true;
                })
                // map(term => this.options_storage[columnName].filter((x: { title: string }) => x.title.includes(term)))
            )
            .subscribe((data) => {
                // this.options_storage_buffer[columnName] = data.slice(0, this.selectBufferSize);
            });
    }

    is_date_type(type: string) {
        if (
            type === 'dtdatetime' ||
            type === 'dtdate' ||
            type === 'dttime' ||
            type === 'date'
        ) {
            return true;
        }
        return false;
    }

    apply_topic_activity() {
        return null;
        let current_topic_id = 0;
        if (this.form.controls['topic_id'] != null) {
            if (this.form.controls['topic_id'].value != null) {
                current_topic_id = this.form.controls['topic_id'].value;
            }
        }

        if (current_topic_id != null) {
            for (let i = 0; i < this.rows.length; i++) {
                if (
                    this.records[this.rows[i]].active_in_topic !== '0' &&
                    this.records[this.rows[i]].active_in_topic != null
                ) {
                    if (
                        Array.isArray(
                            this.records[this.rows[i]].active_in_topic_array
                        ) &&
                        this.records[
                            this.rows[i]
                        ].active_in_topic_array.indexOf(
                            current_topic_id.toString()
                        ) == -1
                    ) {
                        this.form.get(this.rows[i]).clearValidators();
                        this.form.get(this.rows[i]).updateValueAndValidity();
                        this.records[this.rows[i]].required_boolean = false;
                        this.records[this.rows[i]].hidden = true;
                    } else {
                        this.records[this.rows[i]].hidden = false;
                        if (this.records[this.rows[i]].required == 'on') {
                            this.records[this.rows[i]].required_boolean = true;
                            this.form
                                .get(this.rows[i])
                                .setValidators(forbiddenNullValue());
                            this.form
                                .get(this.rows[i])
                                .updateValueAndValidity();
                        }
                    }
                }
                if (this.records[this.rows[i]].parameters != null) {
                    if (this.records[this.rows[i]].parameters.dadata === 1) {
                        this.hide_dadata(this.rows[i]);
                    }
                }
                if (this.records[this.rows[i]].type === 'compose') {
                    this.hide_dadata(this.rows[i]);
                }
            }
        }
    }
    after_form_inited() {
        this.form_title = this.get_title();
        this.afterFormInited.emit(this.form);
        this.cdr.markForCheck();
    }

    get_title() {
        // @todo нужно будет сделать генератор заголовков для всхе сущностей (не только data)
        const title_items = [
            'topic_id',
            'city_id',
            'district_id',
            'street_id',
            'number',
            'price',
        ];
        const final_title_items = [];
        let final_title = '';
        const title_length = 60;

        title_items.forEach((row, index) => {
            if (this.records[row] != null) {
                if (
                    this.records[row].value_string !== '' &&
                    this.records[row].value_string != null
                ) {
                    final_title_items.push(this.records[row].value_string);
                } else if (this.records[row].value !== 0) {
                    final_title_items.push(this.records[row].value);
                }
            }
        });
        final_title = final_title_items.join(', ');
        if (final_title.length > title_length) {
            final_title = final_title.substr(0, title_length) + '...';
        }

        return final_title;
    }

    delete() {
        this.confirmDialogRef = this._matDialog.open(ConfirmComponent, {
            disableClose: false,
        });

        this.confirmDialogRef.componentInstance.confirmMessage =
            'Вы уверены, что хотите удалить запись?';

        this.confirmDialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.modelService
                    .delete(
                        this._data.entity.get_table_name(),
                        this._data.entity.primary_key,
                        this._data.entity.key_value
                    )
                    .subscribe((response: any) => {
                        console.log(response);

                        if (response.state === 'error') {
                            this._snackService.message(response.message);
                            return null;
                        } else {
                            this._snackService.message(
                                'Запись удалена успешно'
                            );
                            this._data.entity.set_hook('afterDelete');
                            this.filterService.empty_share(this._data.entity);
                            this.close();
                        }
                    });
            }
            this.confirmDialogRef = null;
        });
    }

   save() {

    }

    get_ql_items_from_form() {
        const ql_items = {};
        const now = moment();

        this.rows.forEach((row) => {
            const type = this.records[row].type;
            const control = this.form.controls[row];
            const name = this.records[row].name;
            if (control !== undefined && control !== null) {
                if (this.text_area_editor_storage[row]) {
                    ql_items[row] = this.text_area_editor_storage[row];
                } else if (type === 'checkbox' && !control.value) {
                    ql_items[row] = null;
                } else if (type === 'parameter') {
                    ql_items[row] = this.parameters_storage[row];
                } else if (type === 'date' && moment.isMoment(control.value)) {
                    ql_items[row] = control.value.format('DD.MM.YYYY');
                } else if (
                    type === 'dtdatetime' &&
                    moment.isMoment(control.value)
                ) {
                    ql_items[row] = control.value
                        .set({
                            hour: now.get('hour'),
                            minute: now.get('minute'),
                            second: now.get('second'),
                        })
                        .toISOString(true);
                } else if (type === 'dtdate') {
                    console.log(control.value);
                } else if (type === 'geodata') {
                    ql_items[row] = { lat: this.lat, lng: this.lng };
                } else if (type === 'primary_key' && control.value === 0) {
                    ql_items[row] = this.modelService.entity.key_value;
                } else {
                    ql_items[row] = control.value;
                }
            }
        });
        return ql_items;
    }

    add_to_collections(data_id, items) {
        const title = 'bitrix deal ' + this.bitrix24Service.get_entity_id();
        this.modelService
            .toggle_collections(
                this.bitrix24Service.get_domain(),
                this.bitrix24Service.get_entity_id(),
                title,
                data_id
            )
            .subscribe((response: any) => {
                if (response.state == 'error') {
                    this._snackService.message(response.message);
                } else {
                    this.bitrix24Service.comment_add(data_id, items, 'add');
                    this.filterService.empty_share(this._data.entity);
                    this.close();
                }
            });
    }

    mapClick(event) {
        // console.log('map click');
        // console.log(event);
        if (event.coords) {
            this.lat = event.coords.lat;
            this.lng = event.coords.lng;
        } else {
            this.lat = event.lat;
            this.lng = event.lng;
        }
    }

    OnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    close() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    valid_link(value) {
        if (value !== null) {
            const reg =
                '^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
            return !!value.match(reg);
        }
        return false;
    }

    setNumberOfColumns(n: number): void {
        this.numberOfColumns = n;
        this.storageService.setItem('numberOfColumns', String(n));
    }

    get_flex_width(size: string, form_type: string, record: SitebillModelItem) {
        // console.log(record);
        if (record.type === 'hidden' || record.hidden === true) {
            return 0;
        }
        const width_100: Array<string> = [
            'uploads',
            'textarea',
            'textarea_editor',
            'injector',
            'photo',
            'geodata',
        ];
        if (width_100.indexOf(record.type) > -1) {
            return 100;
        }
        if (record.parameters && record.parameters['fxFlex']) {
            return record.parameters['fxFlex'];
        }

        if (record.fxFlex) {
            return record.fxFlex;
        }
        if (this.column_mode) {
            return this.column_mode;
        }
        if (this.get_visible_items_counter() === 1) {
            return 'auto';
        }
        if (form_type === FormType.inline) {
            return 100;
        }
        if (this.numberOfColumns === 1) {
            return 100;
        } else if (this.numberOfColumns === 2) {
            if (size === 'xs') {
                return 100;
            } else {
                return 50;
            }
        } else {
            if (size === 'lg') {
                return 33;
            }
            if (size === 'xl') {
                return 20;
            }
            if (size === 'md') {
                return 50;
            }
            if (size === 'xs') {
                return 100;
            }

            return 'auto';
        }
    }
    get_flex_padding(
        size: string,
        form_type: string,
        record: SitebillModelItem
    ) {
        if (record.type === 'hidden' || record.hidden === true) {
            return '';
        }
        let css_class = 'p-12';
        if (record.fxFlex) {
            css_class += ' border-top-1px';
        }
        return css_class;
    }
    get_appearance() {
        // outline,standard,fill,legacy
        return 'outline';
    }

    updateParametersStorage(value: any, name: string) {
        this.parameters_storage[name] = value;
    }

    onCommentToggle(comment_open: boolean) {
        this.comment_open = comment_open;
    }

    getCommentHeightFix() {
        if (this.comment_open) {
            return 'comment-on-height-fix';
        }
        return 'comment-off-height-fix';
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
