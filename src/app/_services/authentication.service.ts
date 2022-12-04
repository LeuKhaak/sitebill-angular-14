import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map'
import {currentUser} from 'app/_models/currentuser';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { ModelService } from './model.service';
import 'rxjs/add/operator/catch';
import 'rxjs-compat/add/operator/catch';
import 'rxjs-compat/add/observable/of';
import 'rxjs-compat/add/observable/empty';
import {throwError} from 'rxjs';
import {StorageService} from "./storage.service";



@Injectable()
export class AuthenticationService {
    fuseConfig: any;
    api_url: string;
    private currentUser: currentUser;


    constructor(
        private http: HttpClient,
        protected modelSerivce: ModelService,
        protected storageService: StorageService,
        @Inject(APP_CONFIG) private config: AppConfig
        ) {
        this.api_url = this.modelSerivce.get_api_url();
    }

    login(domain: string, username: string, password: string) {
        this.api_url = this.modelSerivce.get_api_url();

        //console.log('username' + username);

        const body = {login: username, password: password};
        //console.log(body);
        //return this.http.post<any>('/apps/api/rest.php', {login: username, password: password})
        //const url = `${this.api_url}/apps/apiproxy/restproxy.php`;
        const url = `${this.api_url}/apps/api/rest.php`;

        const login_request = {action: 'oauth', do: 'login', proxysalt: '123', domain: domain, login: username, password: password};

        return this.http.post<any>(url, login_request)
            .map(user => {
                //console.log('authentication');
                // login successful if there's a jwt token in the response
                if (user && user.session_key) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    try {
                        this.storageService.setItem('currentUser', JSON.stringify(user));
                        this.storageService.setItem('api_url', this.modelSerivce.get_api_url());
                    } catch (e) {
                        //console.log(e);
                    }
                    this.modelSerivce.reinit_currentUser();
                } else {
                    //console.log('not user');
                }
                return user;
            })
            .catch(e => { return throwError('site error'); });
    }

    register(username: string, password: string, password_retype: string, additional_params = null) {
        const url = `${this.modelSerivce.get_api_url()}/apps/api/rest.php`;

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
            .map(user => {
                return user;
            })
            .catch(e => { return throwError('site error'); });
    }

    remind(username: string) {
        const url = `${this.modelSerivce.get_api_url()}/apps/api/rest.php`;

        const register_request = {action: 'oauth', do: 'remind', proxysalt: '123', login: username};

        return this.http.post<any>(url, register_request)
            .map(user => {
                return user;
            })
            .catch(e => { return throwError('site error'); });
    }

    remind_validate_code(code: string) {
        const url = `${this.modelSerivce.get_api_url()}/apps/api/rest.php`;

        const register_request = {action: 'oauth', do: 'remind_validate_code', proxysalt: '123', code: code};

        return this.http.post<any>(url, register_request)
            .map(user => {
                return user;
            })
            .catch(e => { return throwError('site error'); });
    }


    logout() {
        this.currentUser = JSON.parse(this.storageService.getItem('currentUser')) || [];

        const body = {action: 'oauth', do: 'logout', session_key: this.currentUser.session_key};
        const url = `${this.api_url}/apps/api/rest.php`;

        return this.http.post<any>(url, body)
            .map(response => {
                // login successful if there's a jwt token in the response
                if (response.state == 'success') {
                    // remove user from local storage to log user out
                    localStorage.removeItem('currentUser');
                    this.modelSerivce.reinit_currentUser();
                }
            });

    }
}