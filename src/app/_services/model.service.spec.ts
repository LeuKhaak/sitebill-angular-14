import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import { ModelService } from './model.service';
import {FuseConfigService} from '../../@fuse/services/config.service';
import {StorageService} from './storage.service';
import {FilterService} from './filter.service';
import {SnackService} from './snack.service';
import {APP_CONFIG, AppConfig} from 'app/app.config.module';

xdescribe('ModelService', () => {

    const fakeHttpClient = jasmine.createSpyObj('fakeHttpClient', ['']);
    const fakeRouter = jasmine.createSpyObj('fakeRouter', ['']);
    const fakeFuseConfigService = jasmine.createSpyObj('fakeFuseConfigService', ['']);
    const fakeStorageService = jasmine.createSpyObj('fakeStorageService', ['getItem']);
    const fakeFilterService = jasmine.createSpyObj('fakeFilterService', ['']);
    const fakeSnackService = jasmine.createSpyObj('fakeSnackService', ['']);
    const fakeAppConfig = jasmine.createSpyObj('fakeAppConfig', ['']);
    fakeStorageService.getItem.and.returnValue(JSON.stringify({}));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ModelService,
                {provide: HttpClient, useValue: fakeHttpClient},
                {provide: Router, useValue: fakeRouter},
                {provide: FuseConfigService, useValue: fakeFuseConfigService},
                {provide: StorageService, useValue: fakeStorageService},
                {provide: FilterService, useValue: fakeFilterService},
                {provide: SnackService, useValue: fakeSnackService},
                {provide: APP_CONFIG, useValue: fakeAppConfig},
                ]
        });

        const modelService = TestBed.inject(ModelService);


    });

    xit('set_api_url() should set api_url', () => {
        spyOn(this.modelService, 'set_api_url').and.callThrough();

        // let a = appService.getData(2)
        // let b = appService.getData(3)
        //
        // expect(a).toBe(4, 'should be 4')
        // expect(b).toBe(6, 'should be 6')
        //
        expect(this.modelService.set_api_url).toHaveBeenCalled()
        // expect(appService.getData.calls.count()).toBe(2)
        // expect(appService.getData.calls.mostRecent()).toBe(6)
    });
});
