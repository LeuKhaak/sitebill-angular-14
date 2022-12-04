import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {FuseTranslationLoaderService} from '../../../../@fuse/services/translation-loader.service';
import {locale as english} from './i18n/en';
import {locale as russian} from './i18n/ru';
import {ActivatedRoute} from '@angular/router';
import {ModelService} from '../../../_services/model.service';
import {FuseConfigService} from '../../../../@fuse/services/config.service';

@Component({
    selector   : 'page',
    templateUrl: './page.component.html',
    styleUrls  : ['./page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class PageComponent
{
    private loading_in_progress: boolean;
    private slug: string;
    public page: any;
    public load_complete: boolean;

    /**
     * Constructor
     *
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private route: ActivatedRoute,
        private _fuseConfigService: FuseConfigService,
        public modelService: ModelService,
        protected cdr: ChangeDetectorRef
    )
    {
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: false
                },
                toolbar: {
                    hidden: false
                },
                footer: {
                    hidden: true
                }
            }
        };

        this.loading_in_progress = false;
        this._fuseTranslationLoaderService.loadTranslations(english, russian);

        this.slug = this.route.snapshot.paramMap.get('slug');
        this.load_complete = false;

    }

    ngOnInit() {
        this.load_page(this.slug);
    }

    ngAfterViewChecked() {
        if ( this.slug !==  this.route.snapshot.paramMap.get('slug')) {
            this.slug = this.route.snapshot.paramMap.get('slug');
            this.load_page(this.slug);
        }
    }


    load_page ( slug: string ) {
        this.modelService.load_page(slug).subscribe( (result: any) => {
            if ( result.state === 'success' ) {
                this.page = result.data;
                this.load_complete = true;
                this.cdr.markForCheck();
            }
        });
    }
}
