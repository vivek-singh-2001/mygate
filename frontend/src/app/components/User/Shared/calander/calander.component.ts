import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../../services/events/event.service';
import { AppInitializationService } from '../../../../services/AppInitialization';
import { UserService } from '../../../../services/user/user.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-calander',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    InputTextareaModule,
    CalendarModule,
    FormsModule,
    InputTextModule
  ],
  templateUrl: './calander.component.html',
  styleUrl: './calander.component.css',
})
export class CalanderComponent implements OnInit {
  currentMonth: Date = new Date();
  daysOfWeek: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  weeks: any[] = [];
  events: any[] = [];
  tooltipVisible = false;
  today: Date = new Date();
  addEventFlag: boolean = false;
  tooltipContent: string = '';
  tooltipPosition = { top: '0px', left: '0px' };
  isAdmin: boolean = false;
  societyId!: string;

  eventData = {
    title: '',
    description: '',
    start_date: null as Date | null, // Allow both Date and null
    SocietyId: '',
  };

  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
    private readonly appInitializationService: AppInitializationService,
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    this.appInitializationService.isInitialized.subscribe({
      next: (isInitialized) => {
        if (isInitialized || this.authService.isLoggedIn()) {
          this.userService.userSocietyId$.subscribe({
            next: (societyId) => {
              this.societyId = societyId;
              this.eventService.getEvents(societyId).subscribe({
                next: (events) => {
                  this.events = events;
                  this.generateCalendar(this.currentMonth);
                },
                error: (eventError) => {
                  console.error('Failed to fetch events:', eventError);
                },
              });
            },
            error: (societyIdError) => {
              console.error('Failed to fetch society id:', societyIdError);
            },
          });

          this.userService.userRoles$.subscribe({
            next: (roleArray) => {
              if (roleArray.includes('societyAdmin') || roleArray.includes('wingAdmin')) {
                this.isAdmin = true;
              }
            },
            error: (adminError) => {
              console.error('Failed to determine admin status:', adminError);
            },
          });

          this.eventService.events$.subscribe({
            next: (updatedEvents) => {
              this.events = updatedEvents;
              this.generateCalendar(this.currentMonth);
            },
            error: (updateError) => {
              console.error('Failed to fetch updated events:', updateError);
            },
          });
        }
      },
      error: (initError) => {
        console.error('App initialization failed:', initError);
      },
    });
  }

  generateCalendar(date: Date) {
    const startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const lastDate = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    const days = [];
    for (let i = 1 - startDay; i <= lastDate; i++) {
      const day = new Date(date.getFullYear(), date.getMonth(), i);

      if (this.events) {
        // Find any event(s) on this day
        const dayEvents = this.events
          .filter(
            (event) =>
              new Date(event.start_date).toDateString() === day.toDateString()
          )
          .map((event) => ({
            ...event,
            color: 'var(--gray-500)',
          }));

        days.push({
          date: day,
          isDisabled: i < 1,
          events: dayEvents, // Attach events to the day
        });
      }
    }

    this.weeks = [];
    while (days.length) {
      this.weeks.push(days.splice(0, 7));
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  changeMonth(offset: number) {
    // Create a new Date object by adding the offset to the current month
    const newDate = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + offset
    );
    this.currentMonth = newDate;
    this.generateCalendar(this.currentMonth);
  }

  showTooltip(event: MouseEvent, eventData: any) {
    this.tooltipContent = `Title: ${eventData.title} \n Description: ${eventData.description}`;
    this.tooltipPosition = {
      top: `${event.clientY + 10}px`,
      left: `${event.clientX + 10}px`,
    };
    this.tooltipVisible = true;
  }

  hideTooltip() {
    this.tooltipVisible = false;
  }

  addEvent() {
    this.addEventFlag = true;
  }

  onEventSubmit() {
    this.addEventFlag = false;
    this.eventData.SocietyId = this.societyId;
    console.log('eventData', this.eventData);
    this.eventService.addEvent(this.eventData).subscribe({
      next: () => {
        this.eventData.title = '';
        this.eventData.description = '';
        this.eventData.start_date = null;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  eventDay(day: any) {
    const selectedDate = new Date(
      day.date.getFullYear(),
      day.date.getMonth(),
      day.date.getDate()
    );
    const today = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate()
    );

    if (selectedDate.getTime() >= today.getTime() && this.isAdmin) {
      this.addEventFlag = true;
      this.eventData.start_date = selectedDate;
    }
  }
}
