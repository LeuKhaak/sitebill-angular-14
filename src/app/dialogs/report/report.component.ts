import {Component, Inject, OnInit, Input, Output, EventEmitter }  from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

import {Model} from 'app/model';
import { ChatService } from 'app/main/apps/chat/chat.service';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { ModelService } from 'app/_services/model.service';
import {SnackService} from "../../_services/snack.service";
import {SitebillEntity} from "../../_models";
import {FilterService} from "../../_services/filter.service";


@Component({
    selector: 'report-dialog',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
    favoriteSeason: string;

    seasons = [
        'Winter',
        'Spring',
        'Summer',
        'Autumn',
    ];

    form: FormGroup;
    formErrors: any;
    declineFormErrors: any;
    comment: any;
    declinePressed: boolean;
    declineProcessing: boolean;

    declineForm: FormGroup;

    description:string;
    @Input() model: Model;
    @Input() data: SitebillEntity;
    rows: any[];
    records: any[];
    api_url: string;

    private _unsubscribeAll: Subject<any>;
    loadingIndicator: boolean;

    @Output() submitEvent = new EventEmitter<string>();




    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ReportComponent>,
        private _httpClient: HttpClient,
        public modelService: ModelService,
        private _chatService: ChatService,
        @Inject(APP_CONFIG) private config: AppConfig,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private filterService: FilterService,
        protected _snackService: SnackService,
        ) {
        this.loadingIndicator = true;

        // Set the private defaults
        this._unsubscribeAll = new Subject();

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
            comment: [''],
            variant: ['', Validators.required]
        });



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

    submit () {
        this.declinePressed = true;
        this.declineProcessing = true;

        this.modelService.report(this._data.get_table_name(), this._data.primary_key, this._data.get_key_value(), this.declineForm.controls.variant.value)
            .subscribe((response: any) => {
                console.log(response);

                if (response.state == 'error') {
                    this._snackService.message(response.message);
                    return null;
                } else {
                    this._snackService.message('Жалоба отправлена');
                    this.filterService.empty_share(this._data);
                    this.close();
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
