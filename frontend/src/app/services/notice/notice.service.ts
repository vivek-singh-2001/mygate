import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ResponseOutput } from '../../interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class NoticeService {
  private readonly apiUrl = `${environment.apiUrl}/notice`;

  private readonly noticeSubject = new BehaviorSubject<any>([]);
  notices$ = this.noticeSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

    getNotices(societyId: string): Observable<any> {
    if (this.noticeSubject.getValue().noticeList?.length > 0) {
      return this.notices$;
    } else {
      return this.fetchNotices(societyId).pipe(
        map((response) => {
          return response.data;
        })
      );
    }
  }

  fetchNotices(societyId: string): Observable<ResponseOutput> {
    return this.http.get<ResponseOutput>(`${this.apiUrl}/getAllNotice/${societyId}`).pipe(
      tap((response: ResponseOutput) => {
        this.noticeSubject.next(response.data);
      })
    );
  }

  createNotice(noticeData: FormData): Observable<ResponseOutput> {
    return this.http.post<ResponseOutput>(this.apiUrl, noticeData);
  }

  clearNotices() {
    this.noticeSubject.next([]);
  }
  
}
