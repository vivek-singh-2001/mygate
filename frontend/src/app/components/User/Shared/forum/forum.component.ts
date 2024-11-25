import { CommonModule } from '@angular/common';
import { Component, OnInit,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChipModule } from 'primeng/chip';
import { ForumService } from '../../../../services/forum/forum.service';
import { ThreadComponent } from './create-thread/thread.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { UserService } from '../../../../services/user/user.service';
import { Observable } from 'rxjs';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { Router } from '@angular/router';

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
    AvatarGroupModule,
    AvatarModule,

  ],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class ForumComponent implements OnInit {
  forumSections: any[] = [];
  societyId: string = '';
  createThreaddialogue: boolean = false;

  selectedSection = '';
  forumPosts$!: Observable<any[]>; 

  forumPosts: any[] = [];

  constructor(
    private readonly forumService: ForumService,
    private readonly userService: UserService,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.userService.userSocietyId$.subscribe({
      next: (societyId) => {
        this.societyId = societyId;
        this.forumService.fetchAllForumTypes(societyId).subscribe({
          next: (forumData: any) => {
            console.log(forumData);
            this.forumSections = forumData.data;
            this.selectedSection = forumData.data[0].name;
            this.FetchThreads(forumData.data[0].name);
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
    this.forumPosts = [];

    this.FetchThreads(section.name);
  }

  FetchThreads(section: string) {
    this.forumService
      .getAllThreadByForumName(section, this.societyId)
      .subscribe({
        next: (data) => {
          console.log(data.data);
          
          data.data.forEach((thread: any) => {
            this.forumPosts.push(thread);
          });
        },
        error: (err) => {
          console.log('bbbbbbbbb', err);
        },
      });
  }

  showCreateThreadForm() {
    this.createThreaddialogue = true;
  }

  onThreadCreated(event: { isCreated: boolean; newThread: any }): void {
    if (event.isCreated) {
      this.createThreaddialogue = false;
      this.forumPosts.push(event.newThread);
    } else {
      this.createThreaddialogue = true;
    }
  }

  goToThreadDetailComponent(post:any){
    this.router.navigate(['home/forums', post.id]);
  }
}
