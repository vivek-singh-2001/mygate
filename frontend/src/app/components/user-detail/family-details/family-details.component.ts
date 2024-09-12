import { Component, Input } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { ToastModule} from 'primeng/toast'

@Component({
  selector: 'app-family-details',
  standalone: true,
  imports: [ImageModule, ToastModule],
  templateUrl: './family-details.component.html',
  styleUrls: ['../user-detail.component.css'],
})
export class FamilyDetailsComponent {
  @Input() familyData?: any[];
  @Input() userDetails: any;
}
