import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FilterService } from 'app/_services/filter.service';
import {ModelService} from '../../../../_services/model.service';
import {FuseConfigService} from '../../../../../@fuse/services/config.service';
import {SitebillEntity} from '../../../../_models';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'front-component',
    templateUrl: './front.component.html',
    styleUrls: ['./front.component.scss'],
    animations: fuseAnimations
})
export class FrontComponent {
    form: FormGroup;

    public allow_load_grid = false;
    private disable_add_button: boolean = false;
    private disable_edit_button: boolean = false;
    private disable_delete_button: boolean = false;
    private disable_activation_button: boolean = false;
    private disable_gallery_controls: boolean = false;
    private disable_view_button: boolean = false;
    private sale_entity: SitebillEntity;
    private rent_entity: SitebillEntity;
    topics: any;
    regions: any;

    private dictiony_loaded: boolean = false;
    reload: boolean;
    private dayrent_entity: SitebillEntity;
    private buy_entity: SitebillEntity;
    private needrent_entity: SitebillEntity;

    private topic_columns: any[][];
    enable_collections: boolean;

    constructor(
        private filterService: FilterService,
        protected _formBuilder: FormBuilder,
        private _fuseConfigService: FuseConfigService,
        protected cdr: ChangeDetectorRef,
        public modelService: ModelService
    ) {
        this.disable_menu();
        this.topic_columns = [];
        this.enable_collections = true;
        // console.log('lead constructor');
    }

    ngOnInit() {
        this.form = this._formBuilder.group({
            topic_id: new FormControl('', []),
            region_id: new FormControl('', []),
        });
        this.form.valueChanges.subscribe(query => {
            this.change_columns_list({value: query.topic_id});
        });

        this.modelService.config_loaded_emitter.subscribe((result: any) => {
            if ( result === true ) {
                console.log('config_loaded_emitter ' + result);
                this.init_front();
            }
        });
        if ( this.modelService.is_config_loaded() ) {
            console.log('config already loaded');
            this.init_front();
        }
    }

    init_front () {
        this.enable_guest_mode();
        this.reload = true;

        this.sale_entity = new SitebillEntity();
        this.sale_entity.set_app_name('sale');
        this.sale_entity.set_table_name('data');
        this.sale_entity.set_primary_key('id');
        // this.sale_entity.set_disable_comment();
        this.sale_entity.set_default_params({
            active: 1,
            optype: 5
        });
        const default_columns_list_sale = ['address_composed', 'topic_id', 'room_count', 'floor', 'floor_count', 'square_composed', 'price', 'owner_phone', 'date_added', 'image', 'complaint_id'];
        this.sale_entity.set_default_columns_list(default_columns_list_sale);
        this.sale_entity.hide_column_edit('user_id');




        this.rent_entity = new SitebillEntity();
        this.rent_entity.set_app_name('rent');
        this.rent_entity.set_table_name('data');
        this.rent_entity.set_primary_key('id');
        // this.rent_entity.set_disable_comment();
        this.rent_entity.set_default_params({ active: 1, optype: 1 });
        const default_columns_list_rent = ['address_composed', 'topic_id', 'room_count', 'floor', 'floor_count', 'square_composed', 'price', 'owner_phone', 'date_added', 'image', 'complaint_id'];
        this.rent_entity.set_default_columns_list(default_columns_list_rent);
        this.rent_entity.hide_column_edit('user_id');

        this.dayrent_entity = new SitebillEntity();
        this.dayrent_entity.set_app_name('rent');
        this.dayrent_entity.set_table_name('data');
        this.dayrent_entity.set_primary_key('id');
        // this.dayrent_entity.set_disable_comment();
        this.dayrent_entity.set_default_params({ active: 1, optype: 2 });
        const default_columns_list_dayrent = ['address_composed', 'topic_id', 'room_count', 'floor', 'floor_count', 'square_composed', 'price', 'owner_phone', 'date_added', 'image', 'complaint_id'];
        this.dayrent_entity.set_default_columns_list(default_columns_list_dayrent);
        this.dayrent_entity.hide_column_edit('user_id');

        this.buy_entity = new SitebillEntity();
        this.buy_entity.set_app_name('rent');
        this.buy_entity.set_table_name('data');
        this.buy_entity.set_primary_key('id');
        // this.buy_entity.set_disable_comment();
        this.buy_entity.set_default_params({ active: 1, optype: 3 });
        const default_columns_list_buy = ['address_composed', 'topic_id', 'room_count', 'floor', 'floor_count', 'square_composed', 'price', 'owner_phone', 'date_added', 'image', 'complaint_id'];
        this.buy_entity.set_default_columns_list(default_columns_list_buy);
        this.buy_entity.hide_column_edit('user_id');

        this.needrent_entity = new SitebillEntity();
        this.needrent_entity.set_app_name('rent');
        this.needrent_entity.set_table_name('data');
        this.needrent_entity.set_primary_key('id');
        // this.needrent_entity.set_disable_comment();
        this.needrent_entity.set_default_params({ active: 1, optype: 4 });
        const default_columns_list_needrent = ['address_composed', 'topic_id', 'room_count', 'floor', 'floor_count', 'square_composed', 'price', 'owner_phone', 'date_added', 'image', 'complaint_id'];
        this.needrent_entity.set_default_columns_list(default_columns_list_needrent);
        this.needrent_entity.hide_column_edit('user_id');


        this.cdr.markForCheck();
    }

    push_reload_event () {
        this.reload = false;
        this.modelService.get_cms_session().subscribe((response: any) => {
            this.reload = true;
            this.cdr.markForCheck();
        });
    }

    change_columns_list (event) {
        this.push_reload_event();
        let default_columns_list = ['address_composed', 'topic_id', 'room_count', 'floor', 'floor_count', 'square_composed', 'price', 'owner_phone', 'date_added', 'image'];
        try {
            if ( this.topic_columns[event.value].length > 1) {
                default_columns_list = this.topic_columns[event.value];
            }
        } catch (e) {

        }
        this.sale_entity.set_default_columns_list(default_columns_list);
        this.redefine_default_params(this.sale_entity, 'topic_id', event.value);

        this.rent_entity.set_default_columns_list(default_columns_list);
        this.redefine_default_params(this.rent_entity, 'topic_id', event.value);

        this.dayrent_entity.set_default_columns_list(default_columns_list);
        this.redefine_default_params(this.dayrent_entity, 'topic_id', event.value);

        this.buy_entity.set_default_columns_list(default_columns_list);
        this.redefine_default_params(this.buy_entity, 'topic_id', event.value);

        this.needrent_entity.set_default_columns_list(default_columns_list);
        this.redefine_default_params(this.needrent_entity, 'topic_id', event.value);
        //console.log(this.selectedTopic);
    }

    redefine_default_params (entity: SitebillEntity, name: string, value: string) {
        const params = entity.get_default_params();
        params[name] = value;
        entity.set_default_params(params);
        this.filterService.share_data(entity, name, value);
    }

    change_region_list ( event ) {
        this.push_reload_event();
        // console.log(event.value);

        this.redefine_default_params(this.sale_entity, 'region_id', event.value);
        this.redefine_default_params(this.rent_entity, 'region_id', event.value);
        this.redefine_default_params(this.dayrent_entity, 'region_id', event.value);
        this.redefine_default_params(this.buy_entity, 'region_id', event.value);
        this.redefine_default_params(this.needrent_entity, 'region_id', event.value);
    }

    set_topic_id_value (value: string) {
        this.form.controls['topic_id'].setValue(value);
        this.form.controls['topic_id'].patchValue(value);
    }
    set_region_id_value (value: string) {
        this.form.controls['region_id'].setValue(value);
        this.form.controls['region_id'].patchValue(value);
        this.filterService.share_data(this.sale_entity, 'region_id', value.toString());
        this.filterService.share_data(this.rent_entity, 'region_id', value.toString());
        this.filterService.share_data(this.dayrent_entity, 'region_id', value.toString());
        this.filterService.share_data(this.buy_entity, 'region_id', value.toString());
        this.filterService.share_data(this.needrent_entity, 'region_id', value.toString());
    }


    enable_guest_mode () {
        if ( this.modelService.get_user_id() === null ) {
            this.switch_off_grid_controls();
            this.modelService.enable_guest_mode();
        }
    }

    load_topics () {
        this.modelService.load_dictionary_model_all('data', 'topic_id')
            .subscribe((response: any) => {
                response.data.forEach((row, index) => {
                    if ( row.columns_list ) {
                        this.topic_columns[row.id] = row.columns_list.split(',');
                    }
                });
                this.topics = response.data;
                this.set_topic_id_value(this.topics[0].id);
                this.cdr.markForCheck();
            });
    }

    load_regions () {
        this.modelService.load_dictionary_model_all('data', 'region_id')
            .subscribe((response: any) => {
                const share_region_id = this.filterService.get_share_data('sale', 'region_id');
                this.regions = response.data;
                if ( share_region_id !== null ) {
                    this.set_region_id_value(share_region_id);
                } else {
                    this.set_region_id_value(this.regions[0].id);
                }
                this.cdr.markForCheck();
            });
    }

    ngAfterViewChecked () {
        if ( this.modelService.all_checks_passes() && !this.dictiony_loaded) {
            this.load_regions();
            this.load_topics();
            this.dictiony_loaded = true;
        }
    }

    switch_off_grid_controls () {
        this.disable_add_button = false;
        this.disable_edit_button = false;
        this.disable_delete_button = false;
        this.disable_activation_button = false;
        this.disable_gallery_controls = true;
        this.disable_view_button = false;

    }

    disable_menu() {
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: false
                },
                footer: {
                    hidden: true
                }
            }
        };
    }
}
