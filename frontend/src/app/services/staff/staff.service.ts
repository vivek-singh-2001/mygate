import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseOutput } from '../../interfaces/response.interface';

export interface Role {
  id: string;
  name: string;
}

export interface response {
  status: string;
  roles: Role[];
}

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private readonly staffApiUrl = `${environment.apiUrl}`;
  private readonly staffRolesSubject = new BehaviorSubject<Role[]>([]);
  staffRoles$ = this.staffRolesSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  fetchRoles(): Observable<response> {
    return this.http.get<response>(`${this.staffApiUrl}/users/roles`).pipe(
      tap((response: response) => {
        this.staffRolesSubject.next(response.roles);
      })
    );
  }

  registerStaff(data:any):Observable<ResponseOutput>{
    return this.http.post<ResponseOutput>(`${this.staffApiUrl}/staff/createStaff`,data)
  }

  getAllStaff(societyId:string):Observable<ResponseOutput>{
    return this.http.get<ResponseOutput>(`${this.staffApiUrl}/staff/getAllStaff/${societyId}`)
  }
}
