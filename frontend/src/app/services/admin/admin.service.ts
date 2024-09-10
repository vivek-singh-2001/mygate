// admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:7500/api/v1/society/checkAdmin/isAdmin'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  isUserAdmin(): Observable<boolean> {
    return this.http.get<{ isAdmin: boolean }>(`${this.apiUrl}`).pipe(
      map(response => response.isAdmin)
    );
  }
}