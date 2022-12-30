import {EventEmitter, Injectable, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {GetApiUrlService} from './get-api-url.service';
import {ModelRedirectService} from './model-redirect.service';
import {UiService} from './ui.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class ConfigService {

    private config_loaded: boolean;
    protected _unsubscribeAll: Subject<any>;
    private sitebill_config: any;
    private dom_sitebill_config: any;
    public init_config_complete = false;

    @Output() config_loaded_emitter: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: HttpClient,
        private router: Router,
        protected getApiUrlService: GetApiUrlService,
        protected modelRedirectService: ModelRedirectService,
        protected uiService: UiService,
    ) {
        this.sitebill_config = {};
        this.dom_sitebill_config = {};
    }

    set_sitebill_config(data: any): void {
        this.sitebill_config = data;
    }

    set_config_loaded(arg: boolean): void {
        this.config_loaded = arg;
    }

    is_config_loaded(): boolean { // config
        return this.config_loaded;
    }

    init_config_standalone(): void { // config
        // console.log('start init config standalone');
        this.load_config_anonymous()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                    // console.log('config standalone data loaded');
                    if (result.state === 'success') {
                        this.sitebill_config = result.data;
                        this.config_loaded = true;
                        this.config_loaded_emitter.emit(true);
                    } else {
                        console.log('load config failed');
                    }
                },
                error => {
                    console.log('load config failed, bad request standalone');
                });
    }


    after_config_loaded(): void { // config
        // console.log('after_config_loaded');
        this.config_loaded_emitter.emit(true);
        this.init_config_complete = true;
        // console.log('apps.realty.default_frontend_route = ' + this.getConfigValue('apps.realty.default_frontend_route'));
        if (this.getConfigValue('apps.realty.enable_navbar') === '1') {
            this.uiService.show_navbar();
        }
        if (this.getConfigValue('apps.realty.enable_toolbar') === '1') {
            this.uiService.show_toolbar();
        }

        if ( this.getConfigValue('apps.realty.default_frontend_route') === null || this.getConfigValue('apps.realty.default_frontend_route') === undefined) {
            // console.log('default route');
            if ( this.modelRedirectService.is_model_redirect_enabled() ) {
                this.router.navigate(['grid/data']);
            }
        } else {
            // console.log('config route');
            // console.log(this.getConfigValue('apps.realty.default_frontend_route'));
            if ( this.modelRedirectService.is_model_redirect_enabled() ) {
                this.router.navigate([this.getConfigValue('apps.realty.default_frontend_route')]);
            }
        }
    }

    getConfigValue( key: string ): any { // any ???
        if ( this.is_config_loaded() ) {
            return this.sitebill_config[key];
        }
        return null;
    }

    getDomConfigValue( key: string ): any { // any ???
        return this.dom_sitebill_config[key];
    }

    setDomConfigValue( key: string, value: any ): boolean { // config
        return this.dom_sitebill_config[key] = value;
    }

    load_config_anonymous(): any { // any ???
        // console.log(this.get_api_url());
        let body = {};
        body = {action: 'model', do: 'load_config', anonymous: true, session_key: ''};
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    OnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
