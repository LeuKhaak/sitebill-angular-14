import {Component, Inject, OnInit, isDevMode, ViewEncapsulation, Input }  from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';

import {Model} from '../model';
import {currentUser} from '../_models/currentuser';
import { ChatService } from 'app/main/apps/chat/chat.service';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { ModelService } from 'app/_services/model.service';


@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

    form: FormGroup;
    description:string;
    @Input() model: Model;
    rows: any[];
    records: any[];
    api_url: string;
    render_value_string_array = ['empty','select_box','select_by_query', 'select_box_structure', 'date'];
    render_value_array = ['empty','textarea_editor', 'safe_string', 'textarea', 'primary_key'];

    private _unsubscribeAll: Subject<any>;
    private currentUser: currentUser;
    loadingIndicator: boolean;



    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        private _httpClient: HttpClient,
        private modelSerivce: ModelService,
        private _chatService: ChatService,
        @Inject(APP_CONFIG) private config: AppConfig,
        @Inject(MAT_DIALOG_DATA) private _data: any
        ) {
        this.loadingIndicator = true;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.api_url = this.modelSerivce.get_api_url();


        this.description = '123';

    }

    ngOnInit() {
        this._chatService.onChatSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(chatData => {
            });

        this.getModel();
    }

    getModel(): void {
        //console.log('get');

        const primary_key = this._data.primary_key;
        const key_value = this._data.key_value;
        const model_name = this._data.app_name;

        //'5725a680b3249760ea21de52'
        this._chatService.getChat(model_name, primary_key, key_value);


        //const PLACEMENT = this.route.snapshot.paramMap.get('PLACEMENT');
        //const PLACEMENT_OPTIONS = this.route.snapshot.paramMap.get('PLACEMENT_OPTIONS');
        //console.log('subscribe PLACEMENT = ' + PLACEMENT + 'PLACEMENT_OPTIONS = ' + PLACEMENT_OPTIONS);

        //console.log(`${this.api_url}/apps/api/rest.php?action=model&do=load_data&session_key=${this.currentUser.session_key}`);

        const load_data_request = {action: 'model', do: 'load_data', model_name: model_name, primary_key: primary_key, key_value: key_value, session_key: this.currentUser.session_key};
        //console.log(load_data_request);


        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, load_data_request)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result) {
                    //this.rows = result.data;
                    this.records = result.data;
                    //console.log('load_data > ');
                    //console.log(result.data);
                    this.rows = Object.keys(result.data);
                    //console.log(Object.keys(this.rows));
                }

            });


        //console.log(this.model);
        //this.model_body = JSON.stringify(this.model);
        //this.model_body = 'test';

    }

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.dialogRef.close();
        this._chatService.closeChat();
    }

}
