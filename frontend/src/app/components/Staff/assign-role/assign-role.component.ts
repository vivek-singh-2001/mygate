import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { StaffService } from '../../../services/staff/staff.service';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { ResponseOutput } from '../../../interfaces/response.interface';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-assign-role',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule],
  templateUrl: './assign-role.component.html',
  styleUrl: './assign-role.component.css',
})
export class AssignRoleComponent implements OnInit {
  staffs: string[] = [];
  noStaffFound: boolean = false;

  constructor(
    private readonly staffService: StaffService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.userSocietyId$.subscribe({
      next: (societyId) => {
        this.staffService.getAllStaff(societyId).subscribe({
          next: (res: ResponseOutput) => {
            this.staffs = res.data;
          },
          error: (err) => {
            this.noStaffFound = true;
            console.error(err);
          },
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
