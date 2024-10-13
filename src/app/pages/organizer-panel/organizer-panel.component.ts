import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-organizer-panel',
  templateUrl: './organizer-panel.component.html',
  styleUrl: './organizer-panel.component.css',
  providers: [MessageService]
})
export class OrganizerPanelComponent {
  event = {
    name: '',
    date: null,
    time: null,
    description: ''
  };

  timeOptions = [
    { label: 'Morning (8:00 - 12:00)', value: 'morning' },
    { label: 'Afternoon (12:00 - 17:00)', value: 'afternoon' },
    { label: 'Evening (17:00 - 19:00)', value: 'evening' },
    { label: 'Night (19:00 - 22:00)', value: 'night' }
  ];

  constructor(private messageService:MessageService) { }

  ngOnInit(): void {}

  onSubmit(form: any) {
    this.messageService.add({
      severity: 'success',
      summary: 'Event Submitted',
      detail: `Event ${form.eventName} has been successfully submitted!`,
      life: 3000  
    });

    form.reset();
  }
  
}
