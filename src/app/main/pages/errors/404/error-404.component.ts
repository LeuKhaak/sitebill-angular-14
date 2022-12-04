import {Component, ViewEncapsulation} from '@angular/core';
import {FuseConfigService} from '@fuse/services/config.service';

@Component({
    selector: 'error-404',
    templateUrl: './error-404.component.html',
    styleUrls: ['./error-404.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class Error404Component {
    /**
     * Constructor
     */
    constructor(
        private _fuseConfigService: FuseConfigService
    ) {
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
}
