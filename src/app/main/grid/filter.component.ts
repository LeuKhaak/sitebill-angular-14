import {ChangeDetectorRef, Component, EventEmitter, Input} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, takeUntil, switchMap} from 'rxjs/operators';
import {FilterService} from 'app/_services/filter.service';
import {SitebillEntity} from 'app/_models';
import {Options, ChangeContext} from 'ng5-slider';
import {ModelService} from 'app/_services/model.service';
import {NgSelectConfig} from '@ng-select/ng-select';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ComposeModalComponent} from './compose-modal/compose-modal.component';
import {HttpClient} from '@angular/common/http';

interface Dict {
    data: any[];
}

@Component({
    selector: 'filter-comp',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
    options: any;
    options_checkbox: number[] = [1, 0];
    options_select_box: any;
    @Input() columnObject: any;
    columnObjectTitle: string;
    @Input() entity: SitebillEntity;
    api_url: string;
    selectedFilter: any;
    filter_enable = false;
    select_filter_enable = false;
    select_box_filter_enable = false;
    string_filter_enable = false;
    checkbox_filter_enable = false;
    focus_complete = false;
    hoverElement: boolean;
    @Input() extraParam: boolean;

    price_selector: any;
    price_filter_enable = false;
    price_options: any[] = [{id: 0, value: 'Все', actual: 0}, {id: 5, value: 'range'}];
    price_min = 0;
    price_max = 10000000;
    options_price_zero_10m: Options = {
        floor: 0,
        ceil: 10000000,
        step: 1000
    };
    highValue = 100;
    slider_value = 0;
    value: any;

    private _unsubscribeAll: Subject<any>;
    subscription: Subscription;
    public compose_enable: boolean;

    typeahead = new EventEmitter<string>();
    items = [];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private modelSerivce: ModelService,
        private filterService: FilterService,
        protected dialog: MatDialog,
        private config: NgSelectConfig,
        protected cdr: ChangeDetectorRef
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.config.notFoundText = 'Загружаем данные';

        this.typeahead
            .pipe(
                debounceTime(200),
                switchMap(term => this.modelSerivce.load_dictionary_model(this.entity.get_table_name(),
                    this.columnObject.model_name, term))
            )
            .subscribe(items => {
                this.items = items['data'];
            }, (err) => {
                console.log('error', err);
                this.items = [];
            });
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit(): void {
        // console.log(this.filterService.get_share_array(this.entity.get_app_name()));
        if (this.filterService.get_share_array(this.entity.get_app_name()) !== null &&
            this.filterService.get_share_array(this.entity.get_app_name()) !== undefined) {
            // console.log(this.filterService.get_share_array(this.entity.get_app_name()));
            if (this.filterService.get_share_array(this.entity.get_app_name())[this.columnObject.model_name] !==
                undefined) {
                this.onFocus();
            }
        }

        this.columnObjectTitle =
            this.columnObject && this.columnObject.shortTitle ? this.columnObject.shortTitle : this.columnObject.title;

        switch (this.columnObject.type) {
            case 'select_by_query': {
                this.select_filter_enable = true;
                this.filter_enable = true;
                break;
            }

            case 'compose': {
                this.compose_enable = true;
                this.filter_enable = true;
                break;
            }

            case 'mobilephone':
            case 'primary_key':
            case 'safe_string': {
                this.string_filter_enable = true;
                this.filter_enable = true;
                break;
            }
            case 'uploads':
            case 'checkbox': {
                this.checkbox_filter_enable = true;
                this.filter_enable = true;
                break;
            }

            case 'select_box_structure': {
                this.select_filter_enable = true;
                this.filter_enable = true;
                break;
            }

            case 'select_box': {
                this.initSelectBox();
                this.select_box_filter_enable = true;
                this.filter_enable = true;
                break;
            }


            case 'price': {
                this.filter_enable = true;
                this.price_filter_enable = true;
                break;
            }


            default: {
                break;
            }
        }
    }

    initSelectBox() {
        try {
            this.options_select_box =
                this.entity.model[this.entity.columns_index[this.columnObject.model_name]].select_data_indexed;
        } catch (e) {
            console.log(e);
        }
    }

    onFocus() {
        if (!this.focus_complete) {
            if (this.columnObject.type === 'price') {
                this.get_max(this.entity, this.columnObject.model_name);
            } else {
                this.load_dictionary(this.columnObject.model_name);
            }
            this.focus_complete = true;
        }
    }

    get_max(entity: SitebillEntity, columnName) {
        this.modelSerivce.get_max(entity.get_table_name(), columnName)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result.state === 'success') {
                    this.price_max = result.message;
                    this.options_price_zero_10m.ceil = result.message;
                }
                if (this.filterService.get_share_array(this.entity.get_app_name()) !== null) {
                    if (this.filterService.get_share_array(this.entity.get_app_name())['price_min']) {
                        this.price_min = this.filterService.get_share_array(this.entity.get_app_name())['price_min'];
                    }
                    if (this.filterService.get_share_array(this.entity.get_app_name())['price_max']) {
                        this.price_max = this.filterService.get_share_array(this.entity.get_app_name())['price_max'];
                    }
                    if (this.filterService.get_share_array(this.entity.get_app_name())['price_min'] ||
                        this.filterService.get_share_array(this.entity.get_app_name())['price_max']) {
                        this.price_selector = 5;
                    }
                }
                this.cdr.markForCheck();
            });
    }


    selectItem(value) {
        // console.log(this.selectedFilter);
        if (this.columnObject.type === 'checkbox') {
            if (value == null) {
                this.filterService.unshare_data(this.entity, this.columnObject.model_name);
                return;
            }
        }
        // console.log(value);
        this.filterService.share_data(this.entity, this.columnObject.model_name, value);
    }

    load_dictionary(columnName) {
        this.modelSerivce.load_dictionary_model(this.entity.get_table_name(), columnName)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                // console.log(columnName);
                // console.log(result);
                if (this.filterService.get_share_array(this.entity.get_app_name()) !== null &&
                    this.filterService.get_share_array(this.entity.get_app_name()) !== undefined) {
                    this.selectedFilter = this.filterService.get_share_array(this.entity.get_app_name())[columnName];
                }
                this.options = result.data;
                this.cdr.markForCheck();
            });

    }


    onPriceSelectorClose() {
        if (this.price_selector !== 0) {
            this.filterService.share_data(this.entity, 'price_min', this.price_min);
            this.filterService.share_data(this.entity, 'price_max', this.price_max);
        }
        this.cdr.markForCheck();
    }

    onPriceSelectorChange() {
        // console.log(this.price_selector);
        if (this.price_selector === 0) {
            this.filterService.unshare_data(this.entity, 'price_min');
            this.filterService.unshare_data(this.entity, 'price_max');
        }
        this.cdr.markForCheck();
    }

    onPriceSliderChange(changeContext: ChangeContext): void {
        this.price_selector = 5;
        this.cdr.markForCheck();
    }

    compose_modal(column) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {column: column, entity: this.entity};
        this.dialog.open(ComposeModalComponent, dialogConfig);

    }

    get_compose_params_counter(columnObject: any) {
        const share_data = this.filterService.get_share_data(this.entity.get_app_name(), columnObject.model_name);
        if (share_data != null) {
            // console.log(share_data);
            // console.log(typeof share_data);

            if (typeof share_data === 'object') {
                return true;
            }
        }
        return false;
    }
}
