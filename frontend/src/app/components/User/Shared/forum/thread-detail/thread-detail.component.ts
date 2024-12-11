import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
// PrimeNG modules
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChipsModule } from 'primeng/chips';
import { ToolbarModule } from 'primeng/toolbar';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CarouselModule } from 'primeng/carousel';
import { ActivatedRoute } from '@angular/router';
import { ForumService } from '../../../../../services/forum/forum.service';
import { GalleriaModule } from 'primeng/galleria';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { ImageModule } from 'primeng/image';
import { UserService } from '../../../../../services/user/user.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-thread-detail',
  standalone: true,
  imports: [
    CardModule,
    AvatarModule,
    AvatarGroupModule,
    ButtonModule,
    InputTextareaModule,
    ChipsModule,
    ToolbarModule,
    BadgeModule,
    DividerModule,
    ScrollPanelModule,
    CarouselModule,
    GalleriaModule,
    FormsModule,
    ImageModule,
    ToastModule,
  ],
  templateUrl: './thread-detail.component.html',
  styleUrl: './thread-detail.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MessageService],
})
export class ThreadDetailComponent implements OnInit {
  threadId!: string;
  threadDetails: any;
  posts: any[] = []; // Array to store posts
  newPostContent = ''; // For storing the new post content
  uploadedImage: File | null = null;
  uploadedImageName: string | null = null;
  userData: any = null;
  activeReplyIndex: number | null = null; // Tracks the index of the active reply box
  replyContent: string = ''; // Tracks the reply content
  showComments: { [key: number]: boolean } = {};
  comments: { [key: number]: any[] } = {};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly forumService: ForumService,
    private readonly userService: UserService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.threadId = this.route.snapshot.paramMap.get('id')!;
    this.userService.userData$.subscribe((user) => {
      this.userData = user;
    });
    this.fetchThreadDetails();
    this.fetchPosts();
  }

  fetchThreadDetails() {
    this.forumService.getThreadById(this.threadId).subscribe({
      next: (data) => {
        this.threadDetails = data.data;
      },
      error: (err) => {
        console.error('Error fetching thread details:', err);
      },
    });
  }

  fetchPosts() {
    this.forumService.getPostsByThreadId(this.threadId).subscribe({
      next: (data) => {
        this.posts = data.data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
      },
    });
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      // Allow only one image
      const file = input.files[0];

      if (file.type.startsWith('image/')) {
        this.uploadedImage = file;
        this.uploadedImageName = file.name; // Display the name of the uploaded image
      } else {
        console.error('Selected file is not an image.');
        this.uploadedImage = null;
        this.uploadedImageName = null;
      }
    }
  }

  getImageUrl(imagePath: any): string {
    if (!imagePath) {
      console.error('Image path not found');
      return '';
    }

    const filename = imagePath.split('/').pop() ?? '';

    return `${environment.apiUrl}/visitors/image/${filename}`;
  }

  addPost(): void {
    const formData = new FormData();
    formData.append('content', this.newPostContent);
    formData.append('threadId', this.threadId);
    formData.append('userId', this.userData.id);
    if (this.uploadedImage) {
      formData.append('attachment', this.uploadedImage);
    }

    this.forumService.createThreadPost(formData).subscribe({
      next: (response) => {
        this.posts.unshift(response.data);
        this.newPostContent = '';
        this.uploadedImage = null;

        this.messageService.add({
          severity: 'success',
          summary: 'Post Added',
          detail: 'Your post was added successfully.',
        });
      },
      error: (err) => {
        console.error('Error adding post:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Post Failed',
          detail: 'There was an error adding your post. Please try again.',
        });
      },
    });
  }

  toggleReplyInput(index: number): void {
    // Toggle reply input visibility
    this.activeReplyIndex = this.activeReplyIndex === index ? null : index;
    this.replyContent = ''; // Clear the input when switching
  }

  submitReply(postId: any): void {
    const formData = new FormData();
    formData.append('content', this.replyContent);
    formData.append('postId', postId);
    formData.append('userId', this.userData.id);

    this.forumService.createPostComment(formData).subscribe({
      next: (data) => {
        console.log(data);
        this.replyContent = '';
        this.toggleComments(postId);
      },
    });
  }
  toggleComments(postId: any): void {
    // Toggle the visibility of comments for a specific post
    this.showComments[postId] = !this.showComments[postId];

    // If comments are not already fetched, fetch them from the backend
    if (this.showComments[postId] && !this.comments[postId]) {
      this.forumService.getCommentsByPostId(postId).subscribe(
        (fetchedComments: any) => {
          console.log('pppppppp', fetchedComments);
          this.comments[postId] = fetchedComments.data; // Save comments in the map
        },
        (error) => {
          console.error(
            `Error fetching comments for post ID ${postId}:`,
            error
          );
        }
      );
    }
  }

  goBack(): void {
    window.history.back(); // Navigate to the previous page
  }

  fetchComments(postId: string) {
    this.forumService.getCommentsByPostId(postId).subscribe({
      next: (cooment) => {
        console.log(cooment);
      },
    });
  }

  likePost(postId: string) {
    this.forumService.likePost(postId, this.userData.id).subscribe({
      next: (data) => {
        console.log(data);
      },
    });
  }
}
