import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GetSessionKeyService} from './get-session-key.service';
import {GetApiUrlService} from './get-api-url.service';

@Injectable()
export class BillingService {
    /**
     * Constructor
     */
    constructor(
        private http: HttpClient,
        protected getSessionKeyService: GetSessionKeyService,
        protected getApiUrlService: GetApiUrlService,
    )
    {

    }

    get_products(): any { // any ???
        const request = { action: 'cart', do: 'get_products', anonymous: true, session_key: this.getSessionKeyService.get_session_key_safe() };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request);
    }

    add_order(items): any { // any ???
        const request = { action: 'cart', do: 'add_order', items: items, session_key: this.getSessionKeyService.get_session_key_safe() };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request);
    }

    get_invoices(): any { // any ???
        const request = { action: 'cart', do: 'get_invoices', session_key: this.getSessionKeyService.get_session_key_safe() };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request);
    }

    get_user_limit(limit_name): any { // any ???
        const request = { action: 'cart', do: 'get_user_limit', limit_name: limit_name, session_key: this.getSessionKeyService.get_session_key_safe() };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request);
    }

    get_user_products(): any { // any ???
        const request = { action: 'cart', do: 'get_user_products', session_key: this.getSessionKeyService.get_session_key_safe() };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request);
    }
    load_gateways( invoice_id: number ): any { // any ???
        const request = { action: 'cart', do: 'load_gateways', invoice_id: invoice_id, session_key: this.getSessionKeyService.get_session_key_safe() };
        return this.http.post(`${this.getApiUrlService.get_api_url()}/apps/api/rest.php`, request);
    }
}
