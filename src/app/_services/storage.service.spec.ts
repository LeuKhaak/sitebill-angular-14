import {TestBed} from '@angular/core/testing';
import {StorageService} from './storage.service';
import {Bitrix24Service} from '../integrations/bitrix24/bitrix24.service';


describe('StorageService', () => {

    const fakeBitrix24Service = jasmine.createSpyObj('fakeBitrix24Service',
        ['init_input_parameters', 'is_bitrix24_inited']);
    let storageService: any = '';
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                StorageService,
                {provide: Bitrix24Service, useValue: fakeBitrix24Service},
            ],
        });
        storageService = TestBed.inject(StorageService);
        storageService.setItem('testItem', 'testValue');
    });

    it('should create', () => {
        expect(storageService).toBeDefined();
    });

    it('getItem() should have been called', () => {
        const getItem = spyOn(storageService, 'getItem').and.callThrough();
        storageService.getItem('testItem');
        expect(getItem).toHaveBeenCalledWith('testItem');
    });

    it('getItem() should return value', () => {
        const getItem = spyOn(storageService, 'getItem').and.callThrough();
        const val = storageService.getItem('testItem');
        expect(getItem).toHaveBeenCalledTimes(1);
        expect(val).toBe('testValue');
    });

    it('setItem() should have been called', () => {
        const setItem = spyOn(storageService, 'setItem').and.callThrough();
        storageService.setItem('testItem', 'testValue');
        expect(setItem).toHaveBeenCalledWith('testItem', 'testValue');
    });
});
