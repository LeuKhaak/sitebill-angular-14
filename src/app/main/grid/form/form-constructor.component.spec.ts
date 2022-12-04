import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormConstructorComponent } from './form-constructor.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModelService } from 'app/_services/model.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import { SnackService } from 'app/_services/snack.service';
import { FilterService } from 'app/_services/filter.service';
import { Bitrix24Service } from 'app/integrations/bitrix24/bitrix24.service';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'app/_services/storage.service';
import { SitebillEntity } from '../../../_models';
import { TestDataFake } from './test-data';
import { Observable, Observer, Subject } from 'rxjs';
import {debounceTime, distinctUntilChanged, map, takeUntil} from 'rxjs/operators';

xdescribe('FormConstructorComponent', () => {

    let component: FormConstructorComponent;
    let fixture: ComponentFixture<FormConstructorComponent>;
    const fakeData = new Observable((sub) => {
        sub.next(TestDataFake.data[0]);
    });
    let val: any = 'OOO';
    fakeData.subscribe((vl) => {
        val = vl;
    });

    const fakeModelService = {
        ...jasmine.createSpyObj('fakeModelService',
            ['get_access', 'get_user_id', 'get_api_url', 'get_app_name', 'loadById', 'load_dictionary_model_with_params']), entity: new SitebillEntity()
    };
    // const xxx = fakeModelService.loadById.and.returnValue(val); // вернуть обзервйбл
    const fakeFormBuilder = jasmine.createSpyObj('fakeFormBuilder', ['group']);
    const fakeSnackService = jasmine.createSpyObj('fakeSnackService', ['message']);
    const fakeMatDialog = jasmine.createSpyObj('fakeMatDialog', ['open']);
    const fakeFilterService = {};
    const fakeBitrix24Service = jasmine.createSpyObj('fakeBitrix24Service',
        ['init_input_parameters', 'is_bitrix24_inited']);
    const fakeStorageService = jasmine.createSpyObj('fakeStorageService', ['getItem', 'setItem']);

    fakeFormBuilder.group.and.returnValue(new FormGroup({}));

    beforeEach(async () => { // _unsubscribeAll
        await TestBed.configureTestingModule({
            declarations: [FormConstructorComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                {provide: ModelService, useValue: fakeModelService},
                {provide: FormBuilder, useValue: fakeFormBuilder},
                {provide: SnackService, useValue: fakeSnackService},
                {provide: MatDialog, useValue: fakeMatDialog},
                {provide: FilterService, useValue: fakeFilterService},
                {provide: Bitrix24Service, useValue: fakeBitrix24Service},
                {provide: StorageService, useValue: fakeStorageService},
            ]
        })
            .compileComponents();
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(FormConstructorComponent);
        component = fixture.componentInstance;

        fakeModelService.loadById.and.returnValue(fakeData);


        const entity = new SitebillEntity();
        entity.set_table_name('data');
        entity.set_app_name('data');
        entity.set_primary_key('id');
        entity.set_title('Data test');
        component._data = entity;
        // console.log(component);
        console.log('xxx', fakeData);
        console.log('yyy', val);
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
