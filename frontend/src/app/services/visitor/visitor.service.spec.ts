import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { VisitorService } from './visitor.service';
import { Visitor } from '../../interfaces/visitor.interface';

describe('VisitorService', () => {
  let service: VisitorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VisitorService, { provide: Socket, useClass: MockSocket }],
    });
    service = TestBed.inject(VisitorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a visitor', () => {
    const mockVisitor: Partial<Visitor> = {
      name: 'John Doe',
      purpose: 'Meeting',
    };
    const mockResponse = {
      data: {
        id: 'cfa0d3e3-5081-4093-a8d6-a31061fffaa0',
        name: 'John Doe',
        number: '9898545485',
        purpose: 'Visit',
        startDate: '2024-10-24T10:06:59.927Z',
        endDate: '2024-10-24T10:06:59.927Z',
        visitTime: '16:00:00',
        passcode: '706423',
        type: 'Invited',
        status: 'Pending',
        createdAt: '2024-10-24T10:07:17.428Z',
        updatedAt: '2024-10-24T10:07:17.428Z',
        houseId: 'ea8758bc-413a-4268-aa55-8c191ff934a2',
        responsibleUser: '1404fe56-aed7-4630-bf2c-a3a3ab8a66a2',
      },
    };
  });
});
