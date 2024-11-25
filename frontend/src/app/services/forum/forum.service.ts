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
  private readonly apiUrl = `${environment.apiUrl}/forum`;
  private readonly pythonApiUrl = 'http://127.0.0.1:5000/check-content';

  private readonly forumTypesSubject = new BehaviorSubject<ForumResponse[]>([]);
  forumTypes$ = this.forumTypesSubject.asObservable();

  // Cache for forum threads, using a Map to store by forum name
  private readonly forumThreadsCache = new Map<string, any[]>();
  private readonly forumThreadsSubject = new BehaviorSubject<
    Map<string, any[]>
  >(this.forumThreadsCache);
  forumThreads$ = this.forumThreadsSubject.asObservable();

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
    description: string
  ): Observable<ContentCheckResult> {
    // Prepare the content object to send to the backend
    const content = { title, description };
    return this.http
      .post<ContentCheckResult>(this.pythonApiUrl, content, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((error: Error) => {
          console.error('Error checking content:', error);
          return throwError(() => new Error('Error checking content'));
        })
      );
  }

  createThread(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/thread`, data).pipe(
      catchError((error: any) => {
        console.error('Error creating thread:', error);
        return throwError(() => new Error('Error creating thread'));
      })
    );
  }

  getAllThreadByForumName(
    forumName: string,
    societyId: string
  ): Observable<any> {
    // Check if data is cached for the selected forum type
    const cachedThreads = this.forumThreadsCache.get(forumName);
    if (cachedThreads) {
      // If data is cached, return it as an Observable
      return of({ data: cachedThreads });
    }

    // If data is not cached, fetch it from the API
    return this.http
      .post<any>(`${this.apiUrl}/thread/societyThread`, {
        forumName,
        societyId,
      })
      .pipe(
        tap((data) => {
          // Cache the fetched data
          this.forumThreadsCache.set(forumName, data.data);
          // Emit the updated cache to the subject
          this.forumThreadsSubject.next(this.forumThreadsCache);
        }),
        catchError((error) => {
          console.error('Error fetching threads:', error);
          return throwError(() => new Error('Error fetching threads'));
        })
      );
  }

  getThreadById(threadId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/thread/${threadId}`).pipe(
      catchError((error) => {
        console.error('Error fetching threads:', error);
        return throwError(() => new Error('Error fetching thread'));
      })
    );
  }
}
