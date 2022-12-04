import { Injectable } from '@angular/core';
import {FuseConfigService} from '../../@fuse/services/config.service';

@Injectable()
export class UiService {
    private navbarHidden: boolean;
    private toolbarHidden: boolean;

    constructor(
        protected _fuseConfigService: FuseConfigService,
    ) { }

    disable_menu(): void {
        // console.log('disable menu');
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                }
            }
        };
    }

    show_navbar(): void {
        this.navbarHidden = false;
    }

    hide_navbar(): void {
        this.navbarHidden = true;
    }

    is_navbar_hidden(): boolean {
        return this.navbarHidden;
    }

    show_toolbar(): void {
        this.toolbarHidden = false;
    }

    hide_toolbar(): void {
        this.toolbarHidden = true;
    }

    is_toolbar_hidden(): boolean {
        return this.toolbarHidden;
    }

}
