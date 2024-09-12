// event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:7500/api/v1/events/'; 

  constructor(private http: HttpClient) {}

  getEvents(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addEvents(eventData:any):Observable<any>
{
  console.log(eventData);
  
  return this.http.post(this.apiUrl, eventData);
}}
