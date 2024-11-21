import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface ForumType {
  id: number;
  name: string;
}

interface ContentCheckResult {
  status: 'appropriate' | 'inappropriate' | 'error';
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  private readonly apiUrl = `${environment.apiUrl}/forum`;
  private readonly pythonApiUrl = 'http://localhost:5000/check-content'

  private readonly forumTypesSubject = new BehaviorSubject<ForumType[]>([]);
  forumTypes$ = this.forumTypesSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  getAllForumTypes(societyId: string): Observable<ForumType[]> {
    if (this.forumTypesSubject.value.length > 0) {
      return this.forumTypesSubject.asObservable();
    }
    return this.fetchAllForumTypes(societyId);
  }

  private fetchAllForumTypes(societyId: string): Observable<ForumType[]> {
    return this.http.get<ForumType[]>(`${this.apiUrl}/getAllForum/${societyId}`).pipe(
      switchMap((forumTypes) => {
        this.forumTypesSubject.next(forumTypes);
        return this.forumTypesSubject.asObservable();
      }),
      catchError((error) => {
        console.error('Error fetching forum types:', error);
        return throwError(() => new Error('Error fetching forum types'));
      })
    );
  }

  checkContent(
    title: string,
    description: string,
    image_url:string,
  ): Observable<ContentCheckResult> {
    // Prepare the content object to send to the backend
    const content = { title, description,image_url };

    return this.http
      .post<ContentCheckResult>(this.pythonApiUrl, content)
      .pipe(
        catchError((error: Error) => {
          console.error('Error checking content:', error);
          return throwError(() => new Error('Error checking content'));
        })
      );
  }

  createThread(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, formData).pipe(
      catchError((error: any) => {
        console.error('Error creating thread:', error);
        return throwError(() => new Error('Error creating thread'));
      })
    );
  }

  
}
