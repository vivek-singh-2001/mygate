import { TestBed } from '@angular/core/testing';
import { SocietyService } from './society.Service';
import { HttpClient } from '@angular/common/http';

describe('SocietyService', () => {
    let service: SocietyService;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;


    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SocietyService,
                { provide: HttpClient, useValue: httpClientSpy },
            ]
        });

        service = TestBed.inject(SocietyService);
    });


    it('should be created', () => {
        expect(service).toBeTruthy();
    });




});