import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { ForumService } from '../../../../../services/forum/forum.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../../services/user/user.service';

interface ForumType {
  id: number;
  name: string;
}

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css'],
  providers: [],
})
export class ThreadComponent implements OnInit {
  threadForm!: FormGroup;
  selectedFile: File | null = null;
  forumSections: any[] = [];
  societyId: string = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly forumService: ForumService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.threadForm = this.fb.group({
      forumType: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      attachment: [null], // Optional file field
    });

    this.userService.userSocietyId$.subscribe({
      next: (societyId) => {
        this.societyId = societyId;
        this.forumService.fetchAllForumTypes(societyId).subscribe({
          next: (forumData: any) => {
            this.forumSections = forumData.data;
          },
          error: (err) => {
            console.log(err);
          },
        });
      },
    });
  }

  // File input change handler
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Submit the form
  onSubmit(): void {
    if (this.threadForm.valid) {
      const forumType =  this.threadForm.get('forumType')?.value
      const title =  this.threadForm.get('title')?.value
      const description =  this.threadForm.get('description')?.value
      let imagefile = '';
      if (this.selectedFile) {
        imagefile = this.selectedFile.name
      }
//  check for inappropirate contents
      this.forumService.checkContent(title,description,imagefile).subscribe({
        next: (response) => {
          console.log('Thread created successfully:', response);
          console.log('Thread created successfully:', forumType);
          console.log('Thread created successfully:', title);
          console.log('Thread created successfully:', description);
        },
        error: (error) => {
          console.error('Error creating thread:', error);
        },
      });
    }
  }
}
