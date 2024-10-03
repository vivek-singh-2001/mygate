import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { EventService } from '../../../services/events/event.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin/admin.service';
import { UserService } from '../../../services/user/user.service';
import { Event } from '../../../interfaces/event.interface';

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
  addEventFlag: boolean = false;
  tooltipContent: string = '';
  tooltipPosition = { top: '0px', left: '0px' };
  isAdmin: boolean = false;
  societyId!: number;

  eventData = {
    title: '',
    description: '',
    start_date: null,
    SocietyId: 0,
  };

  constructor(
    private eventService: EventService,
    private adminService: AdminService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getUserData().subscribe((userData) => {
      this.societyId = userData?.Houses?.[0]?.Floor?.Wing?.societyId;

      if (!this.societyId) {
        throw new Error('User data is incomplete or societyId is missing');
      }

      this.eventService.getEvents(this.societyId).subscribe((events) => {
        this.events = events;
        this.generateCalendar(this.currentMonth);
      });
    });

    this.adminService.isAdmin$.subscribe((isAdmin) => {
      if (isAdmin) {
        this.isAdmin = isAdmin;
      }
    });

    this.eventService.events$.subscribe((updatedEvents) => {
      this.events = updatedEvents;
      this.generateCalendar(this.currentMonth); // Regenerate calendar with new events
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

  showTooltip(event: MouseEvent, eventData: Event) {
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
    this.eventService.addEvent(this.eventData).subscribe();
    this.eventData.title = '';
    this.eventData.description = '';
    this.eventData.start_date = null;
  }
}
