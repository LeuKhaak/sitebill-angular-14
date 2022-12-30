import {EventEmitter, Injectable, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {GetApiUrlService} from './get-api-url.service';
import {GetSessionKeyService} from './get-session-key.service';
import {ConfigService} from './config.service';
import {ModelRedirectService} from './model-redirect.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class ConfigSystemService {

    protected _unsubscribeAll: Subject<any>;

    @Output() config_loaded_emitter: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: HttpClient,
        private router: Router,
        protected getApiUrlService: GetApiUrlService,
        protected getSessionKeyService: GetSessionKeyService,
        protected modelRedirectService: ModelRedirectService,
        protected configService: ConfigService
    ) { }

    system_config(): any { // any ???
        const body = {action: 'config', do: 'system_config', session_key: this.getSessionKeyService.get_session_key_safe()};
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    update_system_config( qlItems: any ): any { // any ???
        const body = {
            action: 'config',
            do: 'update',
            ql_items: qlItems,
            session_key: this.getSessionKeyService.get_session_key_safe()
        };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    load_config(): any { // any ???
        // console.log(this.get_api_url());
        const body = {action: 'model', do: 'load_config', anonymous: true, session_key: this.getSessionKeyService.get_session_key_safe()};
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, body);
    }

    init_config(): void { // config
        // console.log('start init config');
        this.load_config()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                    // console.log('config data loaded');
                    if (result.state === 'success') {
                        this.configService.set_sitebill_config(result.data);
                        this.configService.set_config_loaded(true);
                        this.configService.after_config_loaded();
                    } else {
                        console.log('load config failed');
                        if (this.modelRedirectService.is_model_redirect_enabled()) {
                            this.router.navigate(['grid/data']);
                        }
                    }
                },
                error => {
                    console.log('load config failed, bad request');
                    this.config_loaded_emitter.emit(true);
                    if ( this.modelRedirectService.is_model_redirect_enabled() ) {
                        this.router.navigate(['grid/data']);
                    }
                });

    }

    OnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
