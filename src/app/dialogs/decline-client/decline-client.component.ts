import {Component, Inject, OnInit, isDevMode, ViewEncapsulation, Input, Output, EventEmitter }  from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Course} from "app/model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import * as moment from 'moment';

import {Model} from 'app/model';
import { ChatService } from 'app/main/apps/chat/chat.service';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { ModelService } from 'app/_services/model.service';


@Component({
    selector: 'decline-dialog',
    templateUrl: './decline-client.component.html',
    styleUrls: ['./decline-client.component.css']
})
export class DeclineClientComponent implements OnInit {

    form: FormGroup;
    formErrors: any;
    declineFormErrors: any;
    comment: any;
    declinePressed: boolean;
    declineProcessing: boolean;

    declineForm: FormGroup;

    description:string;
    @Input() model: Model;
    rows: any[];
    records: any[];
    api_url: string;
    render_value_string_array = ['empty','select_box','select_by_query', 'select_box_structure', 'date'];
    render_value_array = ['empty','textarea_editor', 'safe_string', 'textarea', 'primary_key'];

    private _unsubscribeAll: Subject<any>;
    loadingIndicator: boolean;

    @Output() submitEvent = new EventEmitter<string>();




    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<DeclineClientComponent>,
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

        this.declineFormErrors = {
            comment: {}
        };

        this.declinePressed = false;
        this.declineProcessing = false;

        this.description = '123';

    }

    ngOnInit() {
        // Horizontal Stepper form steps
        this.declineForm = this.fb.group({
            comment: ['', Validators.required]
        });

        this._chatService.onChatSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(chatData => {
            });

        this.getModel();

        this.declineForm.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onFormValuesChanged();
            });


    }

    /**
     * On form values changed
     */
    onFormValuesChanged(): void
    {
        for ( const field in this.formErrors )
        {
            if ( !this.formErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.formErrors[field] = {};

            // Get the control
            const control = this.form.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.formErrors[field] = control.errors;
            }
        }
    }

    decline () {
        console.log('decline');
        console.log(this.declineForm.controls.comment.value);
        const chat_id = this._data.app_name + this._data.key_value;
        console.log(chat_id);
        this.declinePressed = true;
        this.declineProcessing = true;

        // Update the server
        this._chatService.updateDialog(chat_id, 'Причина отказа: ' + this.declineForm.controls.comment.value).then(response => {
            console.log(response);
            if ( response.status == 'ok' ) {
                this.toggleUserGet(this._data.key_value);
                //this.dialog.push(response.comment_data);
            }
            //this.dialog.push(message);

            //this.readyToReply();
        });
    }

    toggleUserGet ( client_id ) {
        //console.log('user_id');
        //console.log(row.client_id.value);

        const body = { action: 'model', do: 'set_user_id_for_client', client_id: client_id, session_key: this.modelSerivce.get_session_key() };
        //console.log(body);

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.close();
                //this.submitEvent.emit('refresh');
                //console.log(result);
                //this.refreash();
            });

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

        const load_data_request = { action: 'model', do: 'load_data', model_name: model_name, primary_key: primary_key, key_value: key_value, session_key: this.modelSerivce.get_session_key()};
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
