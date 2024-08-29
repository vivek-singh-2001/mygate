import { Component } from '@angular/core';
import { UserDetailComponent } from "../user-detail/user-detail.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [UserDetailComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
