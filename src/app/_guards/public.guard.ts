import { AuthGuard } from '.';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { ModelService } from 'app/_services/model.service';
import { SnackService } from 'app/_services/snack.service';
import {StorageService} from '../_services/storage.service';
import {GetSessionKeyService} from '../_services/get-session-key.service';
import {UiService} from '../_services/ui.service';

@Injectable()
export class PublicGuard extends AuthGuard {
    constructor(
        router: Router,
        protected modelService: ModelService,
        protected storageService: StorageService,
        protected getSessionKeyService: GetSessionKeyService,
        protected uiService: UiService,
        _fuseNavigationService: FuseNavigationService,
        _fuseConfigService: FuseConfigService,
        protected _snackService: SnackService,
    ) {
        super(
            router,
            modelService,
            getSessionKeyService,
            uiService,
            storageService,
            _fuseNavigationService,
            _fuseConfigService,
            _snackService
        );
        // this._fuseNavigationService.removeNavigationItem('page');
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // console.log('public canActivate');
        return this.check_session(route, state, '/');
    }
    check_permissions(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // @todo: Нужно проверять текущую сессию на пригодность
        // console.log('Activate result = ');
        // console.log('check permission public');
        this.set_public_menu();

        let navigation_origin = this._fuseNavigationService.getNavigation('main');
        let navigtaion_clone = navigation_origin.slice(0);
        let storage = JSON.parse(this.storageService.getItem('currentUser')) || [];
        this.cleanUpNavigation(navigtaion_clone, storage['structure']);

        if (storage['structure'] == null) {
            this.getSessionKeyService.logout();
            return false;
        }

        if (storage['structure']['group_name'] == null) {
            this.getSessionKeyService.logout();
            return false;
        }

        // console.log('complete cleanUp');

        // logged in so return true
        return true;
    }
}
