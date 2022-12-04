import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ModelService} from './model.service';

@Injectable()
export class BillingService {
    /**
     * Constructor
     */
    constructor(
        private http: HttpClient,
        private modelService: ModelService,
    )
    {

    }

    get_products() {
        const request = { action: 'cart', do: 'get_products', anonymous: true, session_key: this.modelService.get_session_key_safe() };
        return this.http.post(`${this.modelService.get_api_url()}/apps/api/rest.php`, request);
    }

    add_order (items) {
        const request = { action: 'cart', do: 'add_order', items: items, session_key: this.modelService.get_session_key_safe() };
        return this.http.post(`${this.modelService.get_api_url()}/apps/api/rest.php`, request);
    }

    get_invoices () {
        const request = { action: 'cart', do: 'get_invoices', session_key: this.modelService.get_session_key_safe() };
        return this.http.post(`${this.modelService.get_api_url()}/apps/api/rest.php`, request);
    }

    get_user_limit (limit_name) {
        const request = { action: 'cart', do: 'get_user_limit', limit_name: limit_name, session_key: this.modelService.get_session_key_safe() };
        return this.http.post(`${this.modelService.get_api_url()}/apps/api/rest.php`, request);
    }

    get_user_products () {
        const request = { action: 'cart', do: 'get_user_products', session_key: this.modelService.get_session_key_safe() };
        return this.http.post(`${this.modelService.get_api_url()}/apps/api/rest.php`, request);
    }
    load_gateways ( invoice_id: number ) {
        const request = { action: 'cart', do: 'load_gateways', invoice_id: invoice_id, session_key: this.modelService.get_session_key_safe() };
        return this.http.post(`${this.modelService.get_api_url()}/apps/api/rest.php`, request);
    }
}
