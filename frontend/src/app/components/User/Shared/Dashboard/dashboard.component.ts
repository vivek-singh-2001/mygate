import { Component } from '@angular/core';
import { CalanderComponent } from "../calander/calander.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CalanderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
