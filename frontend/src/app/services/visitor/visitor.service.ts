import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private readonly visitorApiUrl = `${environment.apiUrl}/visitors`;

  constructor(private readonly http: HttpClient) {}

  addVisitor(visitorData: any): Observable<any>  {
    return this.http.post(`${this.visitorApiUrl}/add`, visitorData)
    .pipe(
      tap((response) => {
        console.log('Visitor added successfully:', response);
      }),
      catchError((error) => {
        console.error('Failed to add visitor', error);
        return of(null);
      })
    );
  }
}
