import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  items: { label?: string; icon?: string; separator?: boolean }[] = [];

  ngOnInit() {
      this.items = [
          {
              label: 'Refresh',
              icon: 'pi pi-refresh'
          },
          {
              label: 'Search',
              icon: 'pi pi-search'
          },
          {
              separator: true
          },
          {
              label: 'Delete',
              icon: 'pi pi-times'
          }
      ];
  }
}
