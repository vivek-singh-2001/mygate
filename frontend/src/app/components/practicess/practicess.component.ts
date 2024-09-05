import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable ,of,from} from 'rxjs';

@Component({
  selector: 'app-practicess',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './practicess.component.html',
  styleUrl: './practicess.component.css'
})
export class PracticessComponent {}

