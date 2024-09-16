import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { TabViewModule } from 'primeng/tabview';
import { ApartmentComponent } from "../apartment/apartment.component";
import { SocietyUsersComponent } from "./society-users/society-users.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [TabViewModule, AvatarModule, BadgeModule, ApartmentComponent, SocietyUsersComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
