import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { ImageModule } from 'primeng/image';
import { DividerModule } from 'primeng/divider';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [  TabViewModule,AvatarModule,ButtonModule,ImageModule,DividerModule,CalendarModule,DropdownModule,InputTextModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent {

  bloodGroups = [
    { name: 'A+', value: 'A+' },
    { name: 'A-', value: 'A-' },
    { name: 'B+', value: 'B+' },
    { name: 'B-', value: 'B-' },
    { name: 'AB+', value: 'AB+' },
    { name: 'AB-', value: 'AB-' },
    { name: 'O+', value: 'O+' },
    { name: 'O-', value: 'O-' }
  ];

  genders = [
    { name: 'Male', value: 'male' },
    { name: 'Female', value: 'female' },
    { name: 'Other', value: 'other' }
  ];
}
