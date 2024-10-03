import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:7500/api/v1/society/checkAdmin/isAdmin';

  // BehaviorSubject to emit true/false based on the presence of society details
  private isAdminSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public isAdmin$: Observable<boolean> = this.isAdminSubject.asObservable();

  constructor(private http: HttpClient) {}

  societydetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      map((response) => {
        console.log("response soccc", response);
        
        if (response && response.isAdmin !== null) {
          this.isAdminSubject.next(true); // Emit true if society details are present
        } else {
          this.isAdminSubject.next(false); // Emit false if no society details
        }
        return response.isAdmin; // Return the response in case other parts of the app need it
      })
    );
  }
}
