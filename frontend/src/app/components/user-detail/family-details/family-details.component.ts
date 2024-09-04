import { Component, Input } from '@angular/core';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-family-details',
  standalone: true,
  imports: [ImageModule],
  templateUrl: './family-details.component.html',
  styleUrls: ['../user-detail.component.css'],
})
export class FamilyDetailsComponent {
  @Input() familyData?: any[];
  @Input() userDetails: any;
}
