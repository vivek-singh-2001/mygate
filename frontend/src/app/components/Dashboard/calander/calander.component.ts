import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { EventService } from '../../../services/events/event.service';

@Component({
  selector: 'app-calander',
  standalone: true,
  imports: [CommonModule, ButtonModule,TooltipModule],
  templateUrl: './calander.component.html',
  styleUrl: './calander.component.css',
})
export class CalanderComponent implements OnInit {
  currentMonth: Date = new Date();
  daysOfWeek: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  weeks: any[] = [];
  events:any[] = [];
  tooltipVisible = false;
  tooltipContent: string = '';
  tooltipPosition = { top: '0px', left: '0px' };

  constructor(private eventService:EventService){}

  ngOnInit() {
    this.eventService.getEvents().subscribe((events) => {
      this.events = events; // Fetch events from the backend
      this.generateCalendar(this.currentMonth);
    });
  }

  generateCalendar(date: Date) {
    const startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  

    const lastDate = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();


    let days = [];
    for (let i = 1 - startDay; i <= lastDate; i++) {
      let day = new Date(date.getFullYear(), date.getMonth(), i);

      // Find any event(s) on this day
      const dayEvents = this.events
      .filter(event => new Date(event.start_date).toDateString() === day.toDateString())
      .map(event => ({
        ...event,
        color: 'var(--gray-500)' 
      }));

     days.push({
        date: day,
        isDisabled: i < 1,
        events: dayEvents  // Attach events to the day
      });
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


  showTooltip(event: MouseEvent, eventData: any){
    this.tooltipContent = `Title: ${eventData.title} \n Description: ${eventData.description}`;
    this.tooltipPosition = { top: `${event.clientY + 10}px`, left: `${event.clientX + 10}px` };
    this.tooltipVisible = true;
  }

  hideTooltip(){
    this.tooltipVisible = false;
  }
}
