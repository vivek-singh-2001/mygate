import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
  ],
  templateUrl: './thread-detail.component.html',
  styleUrl: './thread-detail.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ThreadDetailComponent implements OnInit {
  threadId!: string;
  threadDetails: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly forumService: ForumService
  ) {}

  // Comments
  comments = [
    {
      id: 1,
      content: 'You should use lazy loading for modules!',
      createdBy: {
        firstname: 'Jane',
        lastname: 'Smith',
        photo: 'https://via.placeholder.com/150',
      },
      createdAt: new Date('2024-11-01T12:30:00'),
      likes: 5,
    },
    {
      id: 2,
      content: 'Make sure to use OnPush change detection strategy.',
      createdBy: {
        firstname: 'Mike',
        lastname: 'Williams',
        photo: 'https://via.placeholder.com/150',
      },
      createdAt: new Date('2024-11-01T13:00:00'),
      likes: 8,
    },
    {
      id: 2,
      content: 'Make sure to use OnPush change detection strategy.',
      createdBy: {
        firstname: 'Mike',
        lastname: 'Williams',
        photo: 'https://via.placeholder.com/150',
      },
      createdAt: new Date('2024-11-01T13:00:00'),
      likes: 8,
    },
    {
      id: 2,
      content: 'Make sure to use OnPush change detection strategy.',
      createdBy: {
        firstname: 'Mike',
        lastname: 'Williams',
        photo: 'https://via.placeholder.com/150',
      },
      createdAt: new Date('2024-11-01T13:00:00'),
      likes: 8,
    },
    {
      id: 2,
      content: 'Make sure to use OnPush change detection strategy.',
      createdBy: {
        firstname: 'Mike',
        lastname: 'Williams',
        photo: 'https://via.placeholder.com/150',
      },
      createdAt: new Date('2024-11-01T13:00:00'),
      likes: 8,
    },
  ];

  // New comment model for the input field
  newComment = {
    content: '',
  };

  addComment() {
    if (this.newComment.content.trim()) {
      this.comments.push({
        id: this.comments.length + 1,
        content: this.newComment.content,
        createdBy: {
          firstname: 'Current',
          lastname: 'User',
          photo: 'https://via.placeholder.com/150', // Replace with actual user's photo
        },
        createdAt: new Date(),
        likes: 0,
      });
      this.newComment.content = ''; // Clear the input field
    }
  }

  postComment() {
    console.log('comment');
  }

  ngOnInit(): void {
    // this.route.paramMap.subscribe((params) => {
    //   this.threadId = params.get('id')!;
    //   console.log(params.get('forum')!);

    //   console.log('Updated Thread ID:', this.threadId);
    // });
    this.threadId = this.route.snapshot.paramMap.get('id')!; // Get thread ID from route
    this.forumService.getThreadById(this.threadId).subscribe({
      next: (data) => {
        console.log(data.data);
        
        this.threadDetails = data.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  goBack(): void {
    window.history.back(); // Navigate to the previous page
  }
}
