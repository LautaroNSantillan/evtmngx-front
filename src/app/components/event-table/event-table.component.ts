import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { LoginService } from '../../services/auth/login.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-event-table',
  templateUrl: './event-table.component.html',
  styleUrl: './event-table.component.css',
  providers: [MessageService]

})
export class EventTableComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  totalEvents: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  private searchSubject = new Subject<string>(); 
  searchKeyword: string = '';
  ascending: boolean = true;
  loading?: boolean;
  isLoggedIn: boolean = false;
  isLoggedInSubscription?: Subscription;
  isErrorDisplayed = false;

  selectedEvent: any;
  displayEventDetails: boolean = false;



  constructor(private eventService: EventService, private loginService:LoginService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.searchSubject
    .pipe(
      debounceTime(300),
      switchMap((searchTerm) => this.eventService.searchEvents(this.currentPage, this.pageSize, searchTerm))//only the results of the latest search are used, while previous search requests are canceled
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
  }

  ngOnDestroy(): void {
    this.isLoggedInSubscription?.unsubscribe();
  }

  loadEvents(event: TableLazyLoadEvent): void {
    this.loading = true;
    this.pageSize = event.rows ? event.rows : this.pageSize;
    this.currentPage = event.first ? Math.floor(event.first / this.pageSize) : 0;

    let sort = event.sortOrder === 1 ? true : false;

    this.eventService.sortedEvents(this.currentPage, this.pageSize, sort).subscribe((response) => {
      this.events = response.content;
      this.totalEvents = response.totalElements;
      this.loading=false;
    });
  }

  toggleAttendance(event: any) {
    event.isAttending = !event.isAttending; // Toggle attendance status
    console.log(`${event.isAttending ? 'Attending' : 'Not Attending'}: ${event.name}`);
  }
  onSearchChange(value: string) {
    console.log(this.searchKeyword);
    this.searchSubject.next(value);
  }

  setIsloggedIn(isLoggedIn: boolean) {
    this.isLoggedInSubscription = this.loginService.isLoggedIn.subscribe({
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
