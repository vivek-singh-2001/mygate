import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { UserService } from '../../../../services/user/user.service';
import { PaginatorModule } from 'primeng/paginator';
import { of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { User } from '../../../../interfaces/user.interface';

interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

@Component({
  selector: 'app-society-users',
  standalone: true,
  imports: [TableModule, PaginatorModule, CommonModule],
  templateUrl: './society-users.component.html',
  styleUrls: ['./society-users.component.css'],
})
export class SocietyUsersComponent implements OnInit {
  users: User[] = [];
  first: number = 0; //offset
  rows: number = 20; //limit
  totalRecords: number = 0; //total records fetched
  searchQuery: string = '';
  noUsersFound: boolean = false;

  private readonly searchSubject = new Subject<string>();

  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {
 
    this.userService.userSocietyId$.pipe(
      switchMap((societyId) => {
        if (!societyId) {
          this.noUsersFound = true;
          return of([]);
        }

     
        return this.searchSubject.pipe(
          debounceTime(500), 
          distinctUntilChanged(), 
          switchMap((searchQuery) =>
            this.loadUsers(societyId, this.first, this.rows, searchQuery)
          ),
          catchError((error) => {
            console.log('Error during user fetch', error);
            this.users = [];
            this.totalRecords = 0;
            this.noUsersFound = true;
            return of([]); 
          })
        );
      })
    ).subscribe();

    this.searchSubject.next(this.searchQuery);
  }


  loadUsers(societyId: string, offset: number, limit: number, search: string = '') {
    return this.userService.getUsersBySocietyId(societyId, limit, offset, search).pipe(
      tap((data) => {
        this.users = data.data.users; 
        this.totalRecords = data.totalRecords; 
        this.noUsersFound = this.users.length === 0; 
      }),
      catchError((error) => {
        console.log('Error loading users:', error);
        this.users = [];
        this.totalRecords = 0;
        this.noUsersFound = true;
        return of({ data: { users: [] }, totalRecords: 0 }); 
      })
    );
  }

  viewUserDetails(user: User) {
    console.log('Viewing details of:', user);
  }

 
  onSearch(query: string): void {
    this.searchQuery = query; 
    this.searchSubject.next(query); 
  }

  onPageChange(event: PageEvent): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 20;
    this.searchSubject.next(this.searchQuery); 
  }
}
