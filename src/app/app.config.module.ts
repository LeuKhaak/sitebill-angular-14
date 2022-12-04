import {NgModule, InjectionToken} from '@angular/core';
import {environment} from '../environments/environment';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export class AppConfig {
    apiEndpoint: string;
    whatsapp_host: string;
    whatsapp_port: string;
    whatsapp_schema: string;

}

export const APP_DI_CONFIG: AppConfig = {
    apiEndpoint: environment.apiEndpoint,
    whatsapp_host: environment.whatsapp_host,
    whatsapp_port: environment.whatsapp_port,
    whatsapp_schema: environment.whatsapp_schema,
};

@NgModule({
    providers: [{
        provide: APP_CONFIG,
        useValue: APP_DI_CONFIG
    }]
})
export class AppConfigModule {}