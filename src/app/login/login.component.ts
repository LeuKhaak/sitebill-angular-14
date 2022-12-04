import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {FuseConfigService} from '@fuse/services/config.service';
import {fuseAnimations} from '@fuse/animations';

import {AlertService, AuthenticationService} from '../_services/index';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { ModelService } from 'app/_services/model.service';
import { DOCUMENT } from '@angular/common';
import {SnackService} from '../_services/snack.service';
import {LoginModalComponent} from './modal/login-modal.component';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: fuseAnimations
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    hide_domain: boolean = true;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _fuseConfigService: FuseConfigService,
        public snackBar: MatSnackBar,
        protected dialog: MatDialog,
        protected _snackService: SnackService,
        private modelService: ModelService,
        protected _fuseNavigationService: FuseNavigationService,
        @Inject(DOCUMENT) private document: any,
        private alertService: AlertService) {

    }

    ngOnInit() {
        if ( this.modelService.is_logged_in() ) {
            this.logout();
        } else {
            console.log('login component login model');
            this.login_modal();
        }
    }

    logout() {
        this.authenticationService.logout()
            .subscribe(
            data => {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('api_url');
                localStorage.clear();
                this.router.navigate(['/login/']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }


    login_modal () {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.panelClass = 'login-form';

        this.dialog.open(LoginModalComponent, dialogConfig);
    }
}

