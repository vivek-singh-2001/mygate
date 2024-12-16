import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { environment } from '../../../environments/environment';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService],
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve society details and update isAdminSubject', () => {
    const mockResponse = { isAdmin: true };

    service.societydetails().subscribe((isAdmin) => {
      expect(isAdmin).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/society/checkAdmin/isAdmin`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    service.isAdmin$.subscribe((isAdmin) => {
      expect(isAdmin).toBe(true);
    });
  });

  it('should handle cases where isAdmin is null and update isAdminSubject', () => {
    const mockResponse = { isAdmin: null };

    service.societydetails().subscribe((isAdmin) => {
      expect(isAdmin).toBe(null);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/society/checkAdmin/isAdmin`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    service.isAdmin$.subscribe((isAdmin) => {
      expect(isAdmin).toBe(false);
    });
  });
});