import {Component, EventEmitter, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {ModelService} from '../../../_services/model.service';
import {SnackService} from '../../../_services/snack.service';
import {SitebillEntity} from "../../../_models";
import {humanizeBytes, UploaderOptions, UploadFile, UploadInput, UploadOutput} from "ngx-uploader";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {ExcelState} from "./types/state.type";
import {worksheetData} from "./types/worksheet-data.type";
import {SitebillResponse} from "../../../_models/sitebill-response";
import {StatisticsType} from "./types/statistics.type";
import {FilterService} from "../../../_services/filter.service";

@Component({
    selector: 'excel-apps',
    templateUrl: './excel.component.html',
    styleUrls: ['./excel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ExcelComponent  implements OnInit {
    public link: string;
    options: UploaderOptions;
    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;
    protected _unsubscribeAll: Subject<any>;


    @Input("entity")
    entity: SitebillEntity;

    onSave = new EventEmitter();
    start_excel_columns = {};
    excel_columns = [];
    excel_rows: any;
    mapped_columns = {};
    mapped_model_titles = [];
    mapped_model_keys = [];
    mapped_model_keys_for_import = {};
    public mapped_columns_array: any[];
    public can_import = false;
    public loading = false;
    public file_for_import = null;
    public state: ExcelState;
    public ExcelState = ExcelState;
    public worksheetData: worksheetData;
    public progress_page = 1;
    public import_result: string;
    public import_statistics = {
        new_stat_items: 0,
        updated_stat_items: 0,
        rejected_stat_items: 0,
        error_stat_items: [],
    };

    constructor(
        protected modelService: ModelService,
        protected _snackService: SnackService,
        protected filterService: FilterService,
    ) {
        this._unsubscribeAll = new Subject();

        this.options = { concurrency: 1, maxUploads: 99, maxFileSize: 10000000 };
        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
    }


    ngOnInit() {
        console.log(this.entity);
        let index = 0;
        for (const [key_obj, value_obj] of Object.entries(this.entity.model)) {
            this.mapped_model_titles[index] = value_obj.title;
            this.mapped_model_keys[value_obj.title] = value_obj.name;
            index++;
            this.excel_columns.push({
                title: value_obj.title,
                prop: value_obj.title,
                //cellTemplate: this.rowTemplate,
            });
        }
    }



    startParse ( file_name ) {
        this.setState(ExcelState.loading);
        const request = {
            action: 'dropzone_xls',
            layer: 'native_ajax',
            do: 'parse_xls_json',
            file_name: file_name,
            model_name: this.entity.get_table_name(),
            primary_key: this.entity.get_primary_key(),
            anonymous: false,
            session_key: this.modelService.get_session_key_safe()
        };
        this.modelService.api_request(request)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result.status == 'OK') {
                    this.worksheetData = result.excel_full_data.worksheetData[0];
                    this.prepareTableData(result.excel_full_data.data);
                    this.mapped_columns = this.mapper(result.excel_full_data.data);
                    this.mapped_columns_array = this.mapper_array(result.excel_full_data.data);
                    this.can_import = true;
                    this.file_for_import = file_name;
                    this.setState(ExcelState.preview_table);
                    this.update_mapper_import();
                } else {
                    this._snackService.error(result.error);
                }
            });
    }

    mapper ( rows ) {
        let hashmap = rows[0];

        let ret = {};
        for(let key in hashmap){
            ret[hashmap[key]] = key;
        }
        return ret;
    }
    mapper_array ( rows ) {
        let hashmap = rows[0];
        this.start_excel_columns = hashmap;

        let ret = [];
        ret.push({
            letter: undefined,
            column_key: '_not_defined',
            title: 'не выбрано'
        });

        for(let key in hashmap){
            ret.push({
                letter: key,
                title: hashmap[key]
            });
        }
        return ret;
    }


    startImport(page = 0) {
        this.setState(ExcelState.import_in_progress);
        this.clearTable();

        const request = {
            action: 'dropzone_xls',
            layer: 'native_ajax',
            do: 'import_json',
            page: page,
            totalPages: this.worksheetData.totalPages,
            file_name: this.file_for_import,
            model_name: this.entity.get_table_name(),
            primary_key: this.entity.get_primary_key(),
            anonymous: false,
            mapped_columns: this.mapped_model_keys_for_import,
            excel_header: this.start_excel_columns,
            session_key: this.modelService.get_session_key_safe()
        };
        //console.log(request);
        this.progress_page = page;

        this.modelService.api_request(request)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: SitebillResponse) => {
                console.log(result);
                if ( result.state === 'OK' ) {
                    this.updateStatistics(result.data.import_statistics);
                    if ( result.data.import_status === ExcelState.import_in_progress ) {
                        this.startImport(result.data.page);
                    } else {
                        this.progress_page = result.data.page;

                        setTimeout(() => {
                            this.finish_import('Данные загружены');
                        }, 1000);
                    }

                } else {
                    this._snackService.error(result.message);
                    this.finish_import(result.message);
                }
            });
    }

    finish_import (import_result: string) {
        this.filterService.empty_share(this.entity);
        this.import_result = import_result;
        this.setState(ExcelState.import_complete);
    }

    import_mapper () {

    }

    updateStatistics( import_statistics: {} ) {
        for (let item in StatisticsType) {
            if ( import_statistics &&  import_statistics.hasOwnProperty(item) ) {
                if ( item === StatisticsType.error_stat_items ) {
                    this.import_statistics[item] = this.import_statistics[item].concat(import_statistics[item]);
                } else {
                    if ( !isNaN(Number(import_statistics[item])) ) {
                        this.import_statistics[item] += Number(import_statistics[item]);
                    }
                }
            }
        }
    }


    getImportedRows () {
        let imported_rows = Math.round(this.progress_page*this.worksheetData.perPage);
        if ( imported_rows > this.worksheetData.totalRows ) {
             imported_rows = this.worksheetData.totalRows;
        }
        return imported_rows;
    }

    getProgressInPercent () {
        return Math.round(((this.getImportedRows())/this.worksheetData.totalRows)*100);
    }

    prepareTableData ( data ) {
        if ( data.length > 5 ) {
            this.excel_rows = [...data.slice(0, 5)];
        } else {
            this.excel_rows = [...data];
        }
        // console.log(this.excel_rows);
    }

    clearTable () {
        let empty = [];
        this.excel_rows = [...empty];
    }

    getState (): ExcelState {
        return this.state;

    }

    setState (state:ExcelState) {
        this.state = state;

    }

    startUpload(): void {
        // console.log('start upload');
        this.clearTable();
        this.setState(ExcelState.loading);
        const request = {
            action: 'dropzone_xls',
            layer: 'native_ajax',
            model_name: this.entity.get_table_name(),
            primary_key: this.entity.get_primary_key(),
            anonymous: false,
            session_key: this.modelService.get_session_key_safe()
        };
        let params = new URLSearchParams();
        for(let key in request){
            params.set(key, request[key])
        }

        const event: UploadInput = {
            type: 'uploadAll',
            url: this.modelService.get_api_url() + '/apps/api/rest.php?' + params.toString(),
            method: 'POST',
            data: { foo: 'bar' }
        };
        this.uploadInput.emit(event);
    }

    cancelUpload(id: string): void {
        this.uploadInput.emit({ type: 'cancel', id: id });
    }

    removeFile(id: string): void {
        this.uploadInput.emit({ type: 'remove', id: id });
    }

    removeAllFiles(): void {
        this.uploadInput.emit({ type: 'removeAll' });
    }

    colName(n) {
        let ordA = 'a'.charCodeAt(0);
        let ordZ = 'z'.charCodeAt(0);
        let len = ordZ - ordA + 1;

        let s = "";
        while(n >= 0) {
            s = String.fromCharCode(n % len + ordA) + s;
            n = Math.floor(n / len) - 1;
        }
        return s.toUpperCase();
    }


    onUploadOutput(output: UploadOutput): void {
        switch (output.type) {
            case 'allAddedToQueue':
                this.startUpload();
                // uncomment this if you want to auto upload files when added
                // const event: UploadInput = {
                //   type: 'uploadAll',
                //   url: '/upload',
                //   method: 'POST',
                //   data: { foo: 'bar' }
                // };
                // this.uploadInput.emit(event);
                break;
            case 'addedToQueue':
                if (typeof output.file !== 'undefined') {
                    this.files.push(output.file);
                }
                break;
            case 'uploading':
                if (typeof output.file !== 'undefined') {
                    // update current data in files array for uploading file
                    const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
                    this.files[index] = output.file;
                }
                break;
            case 'removed':
                // remove file from array when removed
                this.files = this.files.filter((file: UploadFile) => file !== output.file);
                break;
            case 'dragOver':
                this.dragOver = true;
                break;
            case 'dragOut':
            case 'drop':
                this.dragOver = false;
                break;
            case 'done':
                this.startParse(output.file.response.file);
                break;
        }
    }


    OnDestroy () {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    get_default_value(i: number) {
        return 0;
    }

    update_mapper(event: any) {
        this.excel_rows = [...this.excel_rows];
    }

    update_mapper_import() {
        for (let i = 0; i < this.mapped_model_titles.length; i++) {
            if ( this.mapped_columns[this.mapped_model_titles[i]] !== undefined ) {
                this.mapped_model_keys_for_import[this.mapped_model_keys[this.mapped_model_titles[i]]] = this.start_excel_columns[this.mapped_columns[this.mapped_model_titles[i]]];
            } else {
                this.mapped_model_keys_for_import[this.mapped_model_keys[this.mapped_model_titles[i]]] = '_not_defined';
            }
        }
    }
}
