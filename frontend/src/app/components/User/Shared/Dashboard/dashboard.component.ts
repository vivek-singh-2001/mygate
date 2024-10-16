import { Component } from '@angular/core';
import { CalanderComponent } from "../calander/calander.component";
import { NoticeComponent } from "../notice/notice.component";
import { AvatarModule } from 'primeng/avatar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CalanderComponent, NoticeComponent,AvatarModule,RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
