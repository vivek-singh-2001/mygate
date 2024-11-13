import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

declare let google: any;


@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  getCoordinatesByPincode(pincode: string): Observable<{ lat: number; lng: number }> {
    const geocoder = new google.maps.Geocoder();

    return new Observable<{ lat: number; lng: number }>((observer) => {
      geocoder.geocode({ address: pincode }, (results:any, status:any) => {
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
}
