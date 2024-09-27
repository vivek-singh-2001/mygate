import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private baseUrl = 'https://api.postalpincode.in/pincode/';

  constructor(private http: HttpClient) {}

  getStateByPincode(pincode: string): Observable<any> {
    console.log(pincode);
    
    return this.http.get<any>(`${this.baseUrl}${pincode}`);
  }
}
