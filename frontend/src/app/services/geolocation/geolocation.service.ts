import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

declare let google: any;

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private readonly apiUrl = `${environment.apiUrl}/mapapikey`;

  constructor(private readonly http: HttpClient) {}

  getCoordinatesByPincode(
    pincode: string
  ): Observable<{ lat: number; lng: number }> {
    const geocoder = new google.maps.Geocoder();

    return new Observable<{ lat: number; lng: number }>((observer) => {
      geocoder.geocode({ address: pincode }, (results: any, status: any) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          observer.next({ lat: location.lat(), lng: location.lng() });
          observer.complete();
        } else {
          observer.error('Pincode not found');
        }
      });
    }).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error('Error fetching location data'));
      })
    );
  }

  getMapApiKey(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
}
