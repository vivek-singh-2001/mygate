import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { UserService } from '../../../services/user/user.service';
import { AdminService } from '../../../services/admin/admin.service';
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
  styleUrls: ['./society-users.component.css'], // corrected `styleUrls`
})
export class SocietyUsersComponent implements OnInit {
  users: any[] = [];
  first: number = 0; //offset
  rows: number = 20; //limit
  totalRecords: number = 0; //total records fetched
  searchQuery: string = '';
  noUsersFound: boolean = false;

  private searchSubject = new Subject<string>();

  constructor(
    private userService: UserService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    // Trigger search query after debounce time
    this.searchSubject
      .pipe(
        debounceTime(500), // 500ms debounce time
        distinctUntilChanged(), // Only trigger if search query is different from the last one
        switchMap((searchQuery) => {
          return this.loadUsers(this.first, this.rows, searchQuery);
        }),
        catchError((error) => {
          console.log('Error during user fetch', error);
          this.users = [];
          this.totalRecords = 0;
          this.noUsersFound = true;
          return of([]); // Return an empty array in case of error
        })
      )
      .subscribe();

    // Trigger initial load
    this.searchSubject.next(this.searchQuery);
  }

  // Fetch users with pagination
  loadUsers(offset: number, limit: number, search: string = '') {
    return this.adminService.societydetails().pipe(
      switchMap(society =>
        this.userService.getUsersBySocietyId(society.id, limit, offset, search).pipe(
          tap(data => {
            this.users = data.data.users; // Update users array
            this.totalRecords = data.totalRecords; // Set total records for paginator
            this.noUsersFound = this.users.length === 0; // Update "No users found" state
          }),
          catchError((error) => {
            this.users = [];
            this.totalRecords = 0;
            this.noUsersFound = true;
            return of({ data: { users: [] }, totalRecords: 0 }); // Return default values in case of error
          })
        )
      )
    );
  }

  viewUserDetails(user: any) {
    console.log('Viewing details of:', user);
  }

  // Handle search input with debounce
  onSearch(query: string): void {
    this.searchQuery = query; // Update local search query
    this.searchSubject.next(query); // Emit the search query to the subject
  }

  onPageChange(event: PageEvent): void {
    this.first = event.first ?? 0; 
    this.rows = event.rows ?? 20; 
    this.searchSubject.next(this.searchQuery); 
    this.loadUsers(this.first,this.rows,this.searchQuery).subscribe()
  }
}
