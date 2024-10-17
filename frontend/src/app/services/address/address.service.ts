import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly baseUrl = 'https://api.postalpincode.in/pincode';

  constructor(private readonly http: HttpClient) {}

  getStateByPincode(pincode: string): Observable<any> {
    console.log(pincode);

    return this.http.get<any>(`${this.baseUrl}/${pincode}`).pipe(
      catchError((err) => {
        console.log(err);
        return of(null)
      })
    );
  }
}
