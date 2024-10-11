import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent {
    @Input() event: any; 
    @Input() display: boolean = false;
    @Output() closeModal = new EventEmitter<void>(); 

    onClose() {
      this.display = false;
      this.closeModal.emit(); 
    }
}
