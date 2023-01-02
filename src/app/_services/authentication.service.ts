import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {currentUser} from 'app/_models/currentuser';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import {StorageService} from './storage.service';
import {GetApiUrlService} from './get-api-url.service';
import {GetSessionKeyService} from './get-session-key.service';


@Injectable()
export class AuthenticationService {
    fuseConfig: any;
    api_url: string;
    private currentUser: currentUser;


    constructor(
        private http: HttpClient,
        protected storageService: StorageService,
        protected getApiUrlService: GetApiUrlService,
        protected getSessionKeyService: GetSessionKeyService,
        @Inject(APP_CONFIG) private config: AppConfig
        ) {
        this.api_url = this.getApiUrlService.get_api_url();
    }

    login(domain: string, username: string, password: string): any { // any ???
        this.api_url = this.getApiUrlService.get_api_url();

        // console.log('username' + username);

        const body = {login: username, password: password};
        // console.log(body);
        // return this.http.post<any>('/apps/api/rest.php', {login: username, password: password})
        // const url = `${this.api_url}/apps/apiproxy/restproxy.php`;
        const url = `${this.api_url}/apps/api/rest.php`;

        const login_request = {action: 'oauth', do: 'login', proxysalt: '123', domain: domain, login: username, password: password};

        return this.http.post<any>(url, login_request)
            .pipe(map((user: any) => {
                // console.log('authentication');
                // login successful if there's a jwt token in the response
                if (user && user.session_key) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    try {
                        this.storageService.setItem('currentUser', JSON.stringify(user));
                        this.storageService.setItem('api_url', this.getApiUrlService.get_api_url());
                    } catch (e) {
                        // console.log(e);
                    }
                    this.getSessionKeyService.reinit_currentUser();
                } else {
                    // console.log('not user');
                }
                return user;
                })
            );
        catchError((er) => ('site error'));
    }

    register(username: string, password: string, password_retype: string, additional_params = null): any { // any ???
        const url = `${this.getApiUrlService.get_api_url()}/apps/api/rest.php`;

        let register_request = {
            action: 'oauth',
            do: 'register',
            proxysalt: '123',
            login: username,
            password: password,
            password_retype: password_retype
        };
        if ( additional_params !== null ) {
            register_request = {...register_request, ...additional_params};
        }

        return this.http.post<any>(url, register_request)
            .pipe(map((user) => {
                return user;
                })
            );
        catchError((er) => 'site error');
    }

    remind(username: string): any { // any ???
        const url = `${this.getApiUrlService.get_api_url()}/apps/api/rest.php`;

        const register_request = {action: 'oauth', do: 'remind', proxysalt: '123', login: username};

        return this.http.post<any>(url, register_request)
            .pipe(map((user) => {
                return user;
                })
            );
        catchError((er) => 'site error');
    }

    remind_validate_code(code: string): any { // any ???
        const url = `${this.getApiUrlService.get_api_url()}/apps/api/rest.php`;

        const register_request = {action: 'oauth', do: 'remind_validate_code', proxysalt: '123', code: code};

        return this.http.post<any>(url, register_request)
            .pipe(map((user) => {
                return user;
                })
            );
        catchError((er) => 'site error');
    }


    logout(): any { // any ???
        this.currentUser = JSON.parse(this.storageService.getItem('currentUser')) || [];

        const body = {action: 'oauth', do: 'logout', session_key: this.currentUser.session_key};
        const url = `${this.api_url}/apps/api/rest.php`;

        return this.http.post<any>(url, body)
            .pipe(map((response: any) => {
                // login successful if there's a jwt token in the response
                if (response.state === 'success') {
                    // remove user from local storage to log user out
                    localStorage.removeItem('currentUser');
                    this.getSessionKeyService.reinit_currentUser();
                }
                })
            );

    }
}
