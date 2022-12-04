import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {SitebillEntity} from '../../../../_models';
import {ModelService} from '../../../../_services/model.service';
import {FilterService} from '../../../../_services/filter.service';
import {ViewStaticComponent} from '../../view-modal/view-static.component';
import {ChatService} from '../../../apps/chat/chat.service';
import {SnackService} from '../../../../_services/snack.service';
import {Bitrix24Service} from '../../../../integrations/bitrix24/bitrix24.service';
import {takeUntil} from 'rxjs/operators';
import {StorageService} from "../../../../_services/storage.service";

@Component({
    selector: 'contact-injector',
    templateUrl: '../../view-modal/view-modal.component.html',
    styleUrls: ['../../view-modal/view-modal.component.scss'],
    animations: fuseAnimations,
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactInjectorComponent extends ViewStaticComponent implements OnInit {

    @Input('contact_id')
    contact_id: number;


    constructor(
        protected _chatService: ChatService,
        protected modelService: ModelService,
        protected _formBuilder: FormBuilder,
        protected _snackService: SnackService,
        public _matDialog: MatDialog,
        protected filterService: FilterService,
        protected bitrix24Service: Bitrix24Service,
        protected cdr: ChangeDetectorRef,
        protected storageService: StorageService
    ) {

        super(
            _chatService,
            modelService,
            _formBuilder,
            _snackService,
            _matDialog,
            filterService,
            bitrix24Service,
            cdr,
            storageService,
        );
        this._data = new SitebillEntity();
        this._data.set_app_name('contact');
        this._data.set_table_name('contact');
        this._data.set_primary_key('id');
        this._data.set_key_value(this.contact_id);
        this._data.set_readonly(true);
        this._data.set_disable_comment();

    }

    getModel(): void {
        this.modelService.get_contact(this.contact_id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result) {
                    if (result.state === 'error') {
                        this._snackService.message(result.message);
                        return false;
                    } else {
                        this.records = result.data;
                        this.tabs = result.tabs;
                        this.tabs_keys = Object.keys(result.tabs);
                        this.rows = Object.keys(result.data);
                        // console.log(this.rows);
                        // console.log(this.tabs);
                        this.init_form();
                    }
                    this.cdr.markForCheck();
                }
            });
    }
}
