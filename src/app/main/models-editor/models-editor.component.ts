import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
// import { ModelService } from 'app/_services/model.service';
import { ConfigService } from 'app/_services/config.service';
import {Subject} from "rxjs";
import {SitebillResponse} from "../../_models/sitebill-response";
import {SitebillEntity} from "../../_models";
import {FormControl} from "@angular/forms";
import {ConfigFormComponent} from "../config/config-form/config-form.component";
import {MatSidenav} from "@angular/material/sidenav";
import {SnackService} from "../../_services/snack.service";
import {MediaMatcher} from "@angular/cdk/layout";
import {debounceTime, distinctUntilChanged, takeUntil} from "rxjs/operators";
import * as _ from "lodash";
import {ModelsEditorService} from "./models-editor.service";

@Component({
    selector   : 'models-editor',
    templateUrl: './models-editor.component.html',
    styleUrls  : ['./models-editor.component.scss']
})
export class ModelsEditorComponent
{
    protected _unsubscribeAll: Subject<any>;
    public sitebillResponse:SitebillResponse;
    public itemsList:any;
    public menuItems:any;
    entity: SitebillEntity;
    public searchControl: FormControl;
    private debounce: number = 400;


    mobileQuery: MediaQueryList;

    private _mobileQueryListener: () => void;
    public saveButton: boolean = false;

    @ViewChild(ConfigFormComponent) config_form_child: ConfigFormComponent;
    @ViewChild(MatSidenav) side_nav: MatSidenav;

    constructor(
        // protected modelService: ModelService,
        protected configService: ConfigService,
        protected _snackService: SnackService,
        public _modelsEditorService: ModelsEditorService,
        changeDetectorRef: ChangeDetectorRef, media: MediaMatcher
    ) {
        this._unsubscribeAll = new Subject();
        this.sitebillResponse = new SitebillResponse();
        this.searchControl = new FormControl('');


        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);

        this.entity = new SitebillEntity();
        this.entity.set_app_name('config');
        this.entity.set_table_name('fake_config');
        this.entity.primary_key = 'id';
        this.entity.set_key_value(0);


    }

    ngOnInit(): void {
        this.searchControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(this.debounce),
                distinctUntilChanged(),
            )
            .subscribe((result: string) => {
                this.showAppsConfig(0, this.filterBy(this.sitebillResponse.data, result));
            });

    }

    filterBy(array, value = null){
        if (!value || value === '') {
            return array;
        }
        let filtered = [];
        let tmp_array = _.cloneDeep(array);



        for(let i = 0; i < tmp_array.length; i++){

            let obj = Object.assign({}, tmp_array[i].data);
            let f1 = Object.keys(obj)
                .filter( key =>
                    key.indexOf(value) >= 0
                    || obj[key].title.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) >= 0
                    || obj[key].hint.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) >= 0
                    || (obj[key].value && obj[key].value.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) >= 0)
                )
                .reduce( (res, key) => (res[key] = obj[key], res), {} );
            if ( Object.keys(f1).length !== 0 ) {
                //console.log(f1);
                tmp_array[i].data = f1;
                filtered.push(tmp_array[i]);
            }

        }

        return filtered;

    }

    save(event) {
        let ql_items = this.config_form_child.get_changed_items();
        this.configService.update_system_config(ql_items)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: SitebillResponse) => {
                if ( result.state === 'success' ) {
                    this._snackService.message('Конфигурация обновлена успешно!');
                } else {
                    this._snackService.error('Ошибка при обновлении конфигурации: ' + result.message);
                }
            });

        this.saveButton = false;
    }


    OnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    clickMenu(model_name: string) {
        if ( this.mobileQuery.matches ) {
            this.side_nav.toggle();

        }
        console.log(model_name);
        console.log(this.itemsList[model_name]);
        //this.showAppsConfig(index);
    }

    showAppsConfig(index: number, filtered_array = null) {
        if ( !filtered_array ) {
            filtered_array = this.filterBy(this.sitebillResponse.data, this.searchControl.value);
        }

        this.itemsList = filtered_array[index];
        this.menuItems = filtered_array;
    }

    showSaveButton() {
        this.saveButton = true;
    }

    clear_search_text() {
        this.searchControl.patchValue('');
    }

}
