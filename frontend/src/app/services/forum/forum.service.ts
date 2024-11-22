import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface ForumType {
  id: number;
  name: string;
}

interface ForumResponse {
  status: string;
  data: ForumType[];
}

interface ContentCheckResult {
  status: 'appropriate' | 'inappropriate' | 'error';
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  private readonly apiUrl = `${environment.apiUrl}/forums`;
  private readonly pythonApiUrl = 'http://127.0.0.1:5000/check-content';

  private readonly forumTypesSubject = new BehaviorSubject<ForumResponse[]>([]);
  forumTypes$ = this.forumTypesSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

 

  fetchAllForumTypes(societyId: string): Observable<ForumResponse[]> {
    return this.forumTypes$.pipe(
      switchMap((forumTypes: any) => {
        if (forumTypes.data) {
          return of(forumTypes); // Return cached data if available
        } else {
          // Fetch the forum types from API if not cached
          return this.http
            .get<ForumResponse[]>(`${this.apiUrl}/getAllForum/${societyId}`)
            .pipe(
              tap((forumTypes) => {
                this.forumTypesSubject.next(forumTypes);
              }),
              catchError((error) => {
                console.error('Error fetching forum types:', error);
                return throwError(
                  () => new Error('Error fetching forum types')
                ); // Handle error
              })
            );
        }
      })
    );
  }

  checkContent(
    title: string,
    description: string,
    image_url: any
  ): Observable<ContentCheckResult> {
    // Prepare the content object to send to the backend

    const content = { title, description, image_url };

    return this.http
      .post<ContentCheckResult>(this.pythonApiUrl, content, {
        headers: { 'Content-Type': 'application/json' },
    
       // This is important for sending credentials
      })
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
