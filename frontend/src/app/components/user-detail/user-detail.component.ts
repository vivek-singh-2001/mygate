import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import {DropdownModule} from 'primeng/dropdown';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CardModule, PanelModule, TabViewModule,AvatarModule,BadgeModule,ButtonModule,DropdownModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent {}
