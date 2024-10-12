import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { LoginService } from '../../services/auth/login.service';
import { MessageService } from 'primeng/api';
import { EventLocation } from '../../interfaces/eventLocation';

@Component({
  selector: 'app-event-table',
  templateUrl: './event-table.component.html',
  styleUrl: './event-table.component.css',
  providers: [MessageService]

})
export class EventTableComponent implements OnInit {
  eventLocations: EventLocation[] = [];
  events: Event[] = [];
  totalEvents: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  private searchSubject = new Subject<string>(); 
  searchKeyword: string = '';
  ascending: boolean = true;
  loading?: boolean;
  isLoggedIn: boolean = false;
  loggedInId:string="";
  isErrorDisplayed = false;

  selectedEvent: any;
  displayEventDetails: boolean = false;



  constructor(private eventService: EventService, private loginService:LoginService, private messageService: MessageService) {
    this.eventService.sortedEvents(this.currentPage, this.pageSize, true).subscribe({
      next:(event)=>{
        this.eventLocations = event.eventLocations
        this.events = event;
      }
    })
  }

  ngOnInit(): void {
    this.searchSubject
    .pipe(
      debounceTime(300),
      switchMap((searchTerm) => this.eventService.searchEvents(this.currentPage, this.pageSize, searchTerm))
    )
    .subscribe({
      next:(data)=>{
          this.events = data.content;
          if(this.events.length===0 && !this.isErrorDisplayed){
            this.messageService.add({severity:'error', summary:'No events found', detail:"Try again"});
            this.isErrorDisplayed=true;
          }else if(this.events.length>0 && this.isErrorDisplayed === true){
            this.messageService.clear();
            this.isErrorDisplayed=false;
          }
        }
        
      });   

    this.loginService.isLoggedIn.subscribe({
      next:(bool)=>{
        this.isLoggedIn=bool;
      }
    });

    this.loginService.currentUserObject.subscribe({
      next: (user) => {
        this.loggedInId = user.id;
      }
    });
    
  }


  loadEvents(event: TableLazyLoadEvent): void {
    this.loading = true;
    this.pageSize = event.rows ? event.rows : this.pageSize;
    this.currentPage = event.first ? Math.floor(event.first / this.pageSize) : 0;

    let sort = event.sortOrder === 1 ? true : false;

    this.eventService.sortedEvents(this.currentPage, this.pageSize, sort).subscribe((response) => {
      console.log(response);
      this.events = response.content;
      this.totalEvents = response.totalElements;
      this.loading=false;
    });
  }

  toggleAttendance(event: any) {
    if (!event.isAttending) {
      this.eventService.attendEvent(this.loggedInId, event.eventLocations[0].id).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Attendance Confirmed',
            detail: `You are now attending ${event.name}`,
            life: 3000
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Could not attend ${event.name}. Please try again.`,
            life: 3000
          });
          console.error(err);
        }
      });
    } else {
      this.eventService.unattendEvent(this.loggedInId, event.eventLocations[0].id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Unattended Event',
            detail: `You have opted out of attending ${event.name}`,
            life: 3000
          });
        },
      });
    }
    this.loginService.fetchUpdatedUser();
    event.isAttending = !event.isAttending;
    console.log(`${event.isAttending ? 'Attending' : 'Not Attending'}: ${event.name}`);
  }
  
  onSearchChange(value: string) {
    console.log(this.searchKeyword);
    this.searchSubject.next(value);
  }

  setIsloggedIn(isLoggedIn: boolean) {
    this.loginService.isLoggedIn.subscribe({
      next: (userLoggedIn) => {
        this.isLoggedIn = userLoggedIn;
      },
    });
  }

  truncateDescription(description: string, maxLength: number = 25): string {
    if (!description) return 'No description available';
    return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
  }


  viewDetails(event: any) {
    this.selectedEvent = event; 
    this.displayEventDetails = true; 
    console.log('Viewing details for:', event);

  }

  onCloseDetails() {
    this.displayEventDetails = false; 
    this.selectedEvent = null; 
  }
}
