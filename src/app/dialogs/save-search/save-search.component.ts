import {Component, Inject, OnInit, Input, Output, EventEmitter }  from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

import {Model} from 'app/model';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { ModelService } from 'app/_services/model.service';
import {SnackService} from "../../_services/snack.service";
import {SitebillEntity} from "../../_models";


@Component({
    selector: 'save-search',
    templateUrl: './save-search.component.html',
    styleUrls: ['./save-search.component.css']
})
export class SaveSearchComponent implements OnInit {
    filter_params_json: any;

    form: FormGroup;
    formErrors: any;
    dialogFormErrors: any;
    comment: any;
    declinePressed: boolean;
    declineProcessing: boolean;

    dialogForm: FormGroup;

    description:string;
    @Input() model: Model;
    @Input() data: SitebillEntity;

    private _unsubscribeAll: Subject<any>;
    loadingIndicator: boolean;

    @Output() submitEvent = new EventEmitter<string>();




    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<SaveSearchComponent>,
        public modelService: ModelService,
        @Inject(APP_CONFIG) private config: AppConfig,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        protected _snackService: SnackService,
        ) {
        this.loadingIndicator = true;

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.dialogFormErrors = {
            name: {}
        };

        this.declinePressed = false;
        this.declineProcessing = false;
    }

    ngOnInit() {
        // Horizontal Stepper form steps
        this.dialogForm = this.fb.group({
            name: ['', Validators.required],
        });



        this.dialogForm.valueChanges
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
        if (this.dialogForm.valid) {
            this.modelService.save_search(this.filter_params_json, this.dialogForm.controls.name.value).subscribe((response: any) => {
                this._snackService.message('Поиск сохранен успешно');
                this.dialogRef.close();
            });
        } else {
            this._snackService.message('Укажите название для поиска');
        }
    }

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.dialogRef.close();
    }

}
