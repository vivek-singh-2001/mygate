import { Component,OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { ImageModule } from 'primeng/image';
import { DividerModule } from 'primeng/divider';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextareaModule } from 'primeng/inputtextarea';


interface Gender {
  label: string;
  value: string;
}

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    TabViewModule,
    AvatarModule,
    ButtonModule,
    InputMaskModule,
    InputNumberModule,
    ImageModule,
    DividerModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    AutoCompleteModule,
    InputTextareaModule
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent  {
  today: Date = new Date();
  genders: Gender[] = [];

  constructor(){
  this.genders = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];
}
}
