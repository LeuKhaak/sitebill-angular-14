import {Component, OnDestroy, OnInit, ViewEncapsulation, Input, Output, EventEmitter, Inject} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import {fuseAnimations} from '@fuse/animations';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ModelService} from 'app/_services/model.service';
import {SitebillEntity, SitebillModelItem} from 'app/_models';
import {FilterService} from 'app/_services/filter.service';
import {Page} from '../../page';
import {Bitrix24Service} from '../../../../integrations/bitrix24/bitrix24.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GetSessionKeyService} from '../../../../_services/get-session-key.service';

@Component({
    selector: 'grid-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class GridSettingsSidenavComponent implements OnInit, OnDestroy {
    view: string;

    @Input() entity: SitebillEntity;
    @Input() grid_items: any[];
    @Input() page: Page;

    @Output() byClose = new EventEmitter();

    page_options: number[];
    per_page: number;

    active_columns: SitebillModelItem[];
    not_active_columns: SitebillModelItem[];
    init_columns_complete = false;

    protected _unsubscribeAll: Subject<any>;
    private show_logout_button = false;

    constructor(
        private modelService: ModelService,
        protected getSessionKeyService: GetSessionKeyService,
        protected bitrix24Service: Bitrix24Service,
        private dialogRef: MatDialogRef<GridSettingsSidenavComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private filterService: FilterService
    ) {
        this._unsubscribeAll = new Subject();
        this.entity = this._data.entity;
        this.grid_items = this._data.grid_items;
        this.page = this._data.page;

        // Set the defaults
        this.view = 'main';
        this.page_options = [5, 10, 12, 20, 30, 40, 50, 60, 70, 80, 90, 100, 250, 500, 1000];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.per_page = this.page.size;
        this.init_grid();
        this.drop(null);
        if (this.bitrix24Service.get_domain()) {
            this.show_logout_button = true;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    init_grid(): void {
        let grid_items = this.grid_items;
        let tmp_model_array;
        if (grid_items.length === 0) {
            grid_items = this.entity.default_columns_list;
        }

        this.active_columns = [];
        this.not_active_columns = [];
        // this.not_active_columns = this.entity.model;
        // this.not_active_columns = Object.assign([], this.entity.model);


        // console.log(this.entity.model);
        // console.log(grid_items);
        // console.log(this.entity.columns_index);
        // console.log(this.not_active_columns);
        if ( !Array.isArray(this.entity.model) ) {
            tmp_model_array = Object.values(this.entity.model);
        }

        grid_items.forEach((item) => {
            if (this.entity.columns_index[item] == null) {
                return;
            }
            if ( Array.isArray(this.entity.model) ) {
                this.active_columns.push(this.entity.model[this.entity.columns_index[item]]);
            } else {
                this.active_columns.push(tmp_model_array[this.entity.columns_index[item]]);
            }
        });

        if ( Array.isArray(this.entity.model) ) {
            this.entity.model.forEach((item) => {
                if (grid_items.indexOf(item.name) === -1) {
                    this.not_active_columns.push(item);
                }
            });
        } else if (typeof this.entity.model === 'object') {
            Object.values(this.entity.model).forEach((item: SitebillModelItem) => {
                if (grid_items.indexOf(item.name) === -1) {
                    this.not_active_columns.push(item);
                }
            });
        }


        this.init_columns_complete = true;
        /*

        */
        // this.not_active_columns.splice(3, 1);

        // console.log(this.active_columns);
        // c onsole.log(this.not_active_columns);
    }

    drop(event: CdkDragDrop<string[]>): void {
        // console.log('drop');

        if (event !== null) {
            if (event.previousContainer === event.container) {
                moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            } else {
                if ( this.active_columns.length <= 1 && (event.previousContainer.data.length === this.active_columns.length)) {
                    return;
                }

                transferArrayItem(
                    event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex
                );
            }
        }

        const new_grid_items = [];
        let isNewGridEquals = true;
        this.active_columns.forEach((item, index) => {
            if (! (isNewGridEquals && this.grid_items.indexOf(item.name) === index)) {
                isNewGridEquals = false;
            }
            new_grid_items.push(item.name);
        });

        if (isNewGridEquals && this.grid_items.length === new_grid_items.length) {
            return;
        }

        this.modelService.format_grid(this.entity, new_grid_items, this.per_page)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                if (event != null) {
                    this.filterService.empty_share(this.entity);
                }
            });

    }

    per_page_change(event): void {
        const params = event.value;

        this.modelService.update_column_meta(this.entity.get_table_name(), null, 'per_page', params)
            .subscribe(() => {
                this.filterService.empty_share(this.entity);
            });

    }

    logout(): void {
        this.getSessionKeyService.logout();
    }

    /**
     * Toggle card cover
     */
    toggleCardCover(): void {
    }

    /**
     * Toggle subscription
     */
    toggleSubscription(): void {
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onCloseClick(): void {
        this.byClose.emit();
        this.dialogRef.close();
    }
}
