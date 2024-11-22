import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChipModule } from 'primeng/chip';
import { ForumService } from '../../../../services/forum/forum.service';
import { ThreadComponent } from './create-thread/thread.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChipModule,
    ThreadComponent,
    ButtonModule,
    DialogModule,
  ],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
  providers: [],
})
export class ForumComponent implements OnInit {
  forumSections: any[] = [];
  societyId: string = '';
  createThreaddialogue: boolean = false;

  selectedSection = '';

  forumPosts = [
    {
      title: 'Leaking Tap Issue',
      description: 'There’s a leaking tap on the 3rd floor.',
      author: 'John',
    },
    {
      title: 'Event Scheduling',
      description: 'Can we move the event to next week?',
      author: 'Mary',
    },
    {
      title: 'Cleaning Staff',
      description: 'The cleaning staff did not come today.',
      author: 'Ali',
    },
  ];

  constructor(
    private readonly forumService: ForumService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
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

  selectSection(section: any) {
    this.selectedSection = section.name;
    this.forumPosts = this.mockFetchPosts(section.name);
  }

  mockFetchPosts(section: string) {
    return [
      {
        title: `${section} Post 1`,
        description: `Description of ${section} issue 1`,
        author: 'User A',
      },
      {
        title: `${section} Post 2`,
        description: `Description of ${section} issue 2`,
        author: 'User B',
      },
      {
        title: `${section} Post 3`,
        description: `Description of ${section} issue 3`,
        author: 'User C',
      },
      {
        title: `${section} Post 3`,
        description: `Description of ${section} issue 3`,
        author: 'User C',
      },
      {
        title: `${section} Post 3`,
        description: `Description of ${section} issue 3`,
        author: 'User C',
      },
      {
        title: `${section} Post 3`,
        description: `Description of ${section} issue 3`,
        author: 'User C',
      },
      {
        title: `${section} Post 3`,
        description: `Description of ${section} issue 3`,
        author: 'User C',
      },
      {
        title: `${section} Post 3`,
        description: `Description of ${section} issue 3`,
        author: 'User C',
      },
      {
        title: `${section} Post 3`,
        description: `Description of ${section} issue 3`,
        author: 'User C',
      },
      {
        title: `${section} Post 3`,
        description: `Description of ${section} issue 3`,
        author: 'User C',
      },
    ];
  }

  showCreateThreadForm() {
    this.createThreaddialogue = true;
  }
}
