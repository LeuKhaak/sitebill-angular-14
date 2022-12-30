import { Injectable } from '@angular/core';

@Injectable()
export class ModelRedirectService {

    private model_redirect = true;

    constructor() {}

    disable_model_redirect(): void {
        this.model_redirect = false;
    }
    enable_model_redirect(): void {
        this.model_redirect = true;
    }
    is_model_redirect_enabled(): boolean {
        return this.model_redirect;
    }
}
