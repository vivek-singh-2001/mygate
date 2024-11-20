import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ForumService } from '../../../../../services/forum/forum.service';
import { CommonModule } from '@angular/common';

interface ForumType {
    id: number;
    name: string;
  }
  

@Component({
  selector: 'app-thread',
  standalone:true,
  imports:[CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl:'./thread.component.html',
  styleUrls: ['./thread.component.css'],
  providers:[]
})
export class ThreadComponent implements OnInit {
  threadForm!: FormGroup;
  forumTypes$!: Observable<ForumType[]>; 
  selectedFile: File | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly forumService: ForumService
  ) {}

  ngOnInit(): void {
   
    this.threadForm = this.fb.group({
      forumType: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      attachment: [null], // Optional file field
    });

    // const societyId = 'some-society-id'; 
    // this.forumTypes$ = this.forumService.getForumTypes(societyId);
  }

  // File input change handler
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Submit the form
//   onSubmit(): void {
//     if (this.threadForm.valid) {
//       const formData = new FormData();
//       formData.append('forumType', this.threadForm.get('forumType')?.value);
//       formData.append('title', this.threadForm.get('title')?.value);
//       formData.append('description', this.threadForm.get('description')?.value);

//       if (this.selectedFile) {
//         formData.append('attachment', this.selectedFile, this.selectedFile.name);
//       }

//       // Call backend service to create thread (Implement the method in ForumService)
//       this.forumService.createThread(formData).subscribe(
//         (response) => {
//           console.log('Thread created successfully:', response);
//           // Reset the form on success
//           this.threadForm.reset();
//         },
//         (error) => {
//           console.error('Error creating thread:', error);
//         }
//       );
//     }
//   }
}
