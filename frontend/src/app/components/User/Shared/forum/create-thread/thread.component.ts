import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ForumService } from '../../../../../services/forum/forum.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../../services/user/user.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface ForumType {
  id: number;
  name: string;
}

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,ToastModule],
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css'],
  providers: [MessageService],
})
export class ThreadComponent implements OnInit {
  @Output() threadCreated = new EventEmitter<{isCreated:boolean;newThread:any}>();
  threadForm!: FormGroup;
  isCreated:boolean = false
  selectedFiles: File[] = [];
  forumSections: any[] = [];
  societyId: string = '';
  userId: string = '';
  formData!: FormData;
  attachmentError: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly forumService: ForumService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.threadForm = this.fb.group({
      forumType: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      attachment: [null],
    });

    this.userService.getUserData().subscribe({
      next: (user) => {
        this.userId = user.id;
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
      },
    });
  }

  // File input change handler
  onFileChange(event: Event): void {
    this.attachmentError = false;
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);
    }

    if (input.files && input.files.length > 3) {
      this.attachmentError = true;
    }
  }

  // Submit the form
  onSubmit(): void {
    if (this.threadForm.valid && !this.attachmentError) {
      this.formData = new FormData();
      const forumType = this.threadForm.get('forumType')?.value;
      const title = this.threadForm.get('title')?.value;
      const description = this.threadForm.get('description')?.value;

      // Append multiple files
      if (this.selectedFiles && this.selectedFiles.length > 0) {
        for (const element of this.selectedFiles) {
          this.formData.append('files', element);
        }
      }

      this.formData.append('title', title);
      this.formData.append('content', description);
      this.formData.append('forumType', forumType);
      this.formData.append('userId', this.userId);
      this.formData.append('societyId', this.societyId);

      this.forumService.createThread(this.formData).subscribe({
        next: (data) => {
          console.log(data.data);
          
          this.messageService.add({
            severity: 'success',
            detail: 'Your Thread is live now ',
          });
          this.threadCreated.emit({ isCreated:true, newThread:data.data });
          this.threadForm.reset()
        },
        error: (err) => {
          this.messageService.add({
            severity: 'success',
            detail: err.message,
          });
          this.threadCreated.emit({isCreated:false,newThread:{}});
        },
      });
      //  check for inappropirate contents
      // this.forumService.checkContent(title,description).subscribe({
      //   next: (response) => {
      //     if(response.status == 'appropriate'){
      //       this.forumService.createThread(this.formData).subscribe({
      //   next: (data) => {
      //     console.log(data);
      //   },
      //   error: (e) => {
      //     console.log(e);
      //   },
      // });
      //     }

      //   },
      //   error: (error) => {
      //     console.error('Error creating thread:', error);
      //   },
      // });
    }
  }
}
