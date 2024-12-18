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
import { SidebarModule } from 'primeng/sidebar';

interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

@Component({
  selector: 'app-society-users',
  standalone: true,
  imports: [TableModule, PaginatorModule, CommonModule, SidebarModule],
  templateUrl: './society-users.component.html',
  styleUrls: ['./society-users.component.css'],
})
export class SocietyUsersComponent implements OnInit {
  users: User[] = [];
  first: number = 0;
  rows: number = 20;
  societyId!: string;
  totalRecords: number = 0;
  searchQuery: string = '';
  selectedUser: any = null;
  isSidebarVisible: boolean = false;

  private readonly searchSubject = new Subject<string>();

  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {
    this.userService.userSocietyId$
      .pipe(
        switchMap((societyId) => {
          if (!societyId) {
            return of([]);
          }
          console.log(societyId);

          this.societyId = societyId;
          return this.searchSubject.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap((searchQuery) =>
              this.loadUsers(societyId, this.rows, this.first, searchQuery)
            ),
            catchError((error) => {
              console.log('Error during user fetch', error);
              this.users = [];
              this.totalRecords = 0;
              return of([]);
            })
          );
        })
      )
      .subscribe();
    this.searchSubject.next(this.searchQuery);
  }

  loadUsers(
    societyId: string,
    limit: number,
    offset: number,
    search: string = ''
  ) {
    return this.userService
      .getUsersBySocietyId(societyId, limit, offset, search)
      .pipe(
        tap((data) => {
          this.users = data.data.users;
          this.totalRecords = data.totalRecords;
        }),
        catchError((error) => {
          console.log('Error loading users:', error);
          this.users = [];
          this.totalRecords = 0;
          return of({ data: { users: [] }, totalRecords: 0 });
        })
      );
  }

  viewUserDetails(user: User) {
    console.log('Viewing details of:', user);
    this.selectedUser = user;
    this.isSidebarVisible = true;
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  onPageChange(event: PageEvent): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 20;
    console.log(this.rows, this.first);

    this.searchSubject.next(this.searchQuery);
    this.loadUsers(
      this.societyId,
      this.rows,
      this.first,
      this.searchQuery
    ).subscribe();
  }
}
