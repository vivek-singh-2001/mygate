import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocietyStaffService {
  private readonly ApiUrl = `${environment.apiUrl}/society`;

  constructor(private readonly http: HttpClient) {}

  staffDetails(userId:string):Observable<any>{
    return this.http.get<any>(`${this.ApiUrl}/getStaffDetails/${userId}`)
  }
}
