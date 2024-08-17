import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userApiUrl = 'http://localhost:7500/api/v1/users/getUser';
  private societyApiUrl = 'http://localhost:7500/api/v1/society';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.userApiUrl}/me`, { withCredentials: true });
  }

 
  // Function to get the society by the current user's ID
  getSocietyByUserId(): Observable<any> {
    return this.http.get(`${this.societyApiUrl}/societyDetails/details`, { withCredentials: true });
  }

  getUsersBySocietyId(societyId:string): Observable<any>{
    return this.http.get(`${this.societyApiUrl}/${societyId}`,{withCredentials:true} );
  }
}
