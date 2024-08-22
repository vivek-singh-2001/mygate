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
export class PracticessComponent {

data :any=[]

  myObservalbe = from([1,2,3,4,5,6,7,8,9,9] )
getdata(){
  this.myObservalbe.subscribe({
    next: (data:any)=>{
      this.data.push(data);
      console.log(data);
      
    },
    error:(err:any)=>{console.log(err);
    },
    complete:()=>{
      console.log("operation complete");
      
    }
  })
}
}
