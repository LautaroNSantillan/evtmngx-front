import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
    items: MenuItem[] = [];
    isUserLoggedIn: boolean = false;
  
    ngOnInit() {
      this.items = [
        {
          label: 'Home',
          icon: 'pi pi-home',
          routerLink: '/home',
        },
        ...(this.isUserLoggedIn
          ? [
              {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                routerLink: '/logout',
              },
            ]
          : [
              {
                label: 'Login',
                icon: 'pi pi-sign-in',
                routerLink: '/login',
              },
              {
                label: 'Register',
                icon: 'pi pi-user-plus',
                routerLink: '/register',
              },
            ]),
        {
          label: 'Projects',
          icon: 'pi pi-search',
          items: [
            {
              label: 'Components',
              icon: 'pi pi-bolt',
            },
            {
              label: 'Blocks',
              icon: 'pi pi-server',
            },
            {
              label: 'UI Kit',
              icon: 'pi pi-pencil',
            },
            {
              label: 'Templates',
              icon: 'pi pi-palette',
              items: [
                {
                  label: 'Apollo',
                  icon: 'pi pi-palette',
                },
                {
                  label: 'Ultima',
                  icon: 'pi pi-palette',
                },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          icon: 'pi pi-envelope',
        },
      ];
    }
}
