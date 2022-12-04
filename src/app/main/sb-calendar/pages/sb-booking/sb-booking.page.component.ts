import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FuseConfigService} from '../../../../../@fuse/services/config.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

@Component({
    templateUrl: 'sb-booking.page.component.html',
    styleUrls: [
        'sb-booking.page.component.scss',
    ]
})
export class SbBookingPageComponent implements OnInit {

    keyValue = null;

    constructor(
        private fuseConfigService: FuseConfigService,
        private route: ActivatedRoute,
    ) {
        this.initFuseOptions();
    }

    ngOnInit() {
        this.initRouterEvents();
    }

    private initRouterEvents() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            if (params.get('keyValue')) {
                this.keyValue = params.get('keyValue');
            }
            this.initFuseOptions();
        });
    }

    private initFuseOptions() {
        this.fuseConfigService.config = {
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