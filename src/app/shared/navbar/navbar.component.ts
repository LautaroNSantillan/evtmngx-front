import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { LoginService } from '../../services/auth/login.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [MessageService]
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] = [];
  isUserLoggedIn: boolean = false;
  loggedInId: string = "";
  userRoles: string[] = [];
  isAdmin: boolean = false;
  isOrganizer: boolean = false;

  constructor(private loginService: LoginService, 
              private router: Router,
              private messageService: MessageService) {}

  ngOnInit() {
    this.loginService.isLoggedIn.subscribe({
      next: (userLoggedIn) => {
        this.isUserLoggedIn = userLoggedIn;
        this.updateMenuItems();
      },
    });

    this.loginService.userObject.subscribe({
      next: (user) => {
        this.loggedInId = user.id;
        this.userRoles = user.roles || [];
        this.updateMenuItems();
      }
    });

    this.loginService.isAdmin.subscribe({
      next: (isAdmin) => {
        this.isAdmin = isAdmin;
        this.updateMenuItems();  
      }
    });
  
    this.loginService.isOrganizer.subscribe({
      next: (isOrganizer) => {
        this.isOrganizer = isOrganizer;
        this.updateMenuItems();  
      }
    });
  
    
    this.updateMenuItems();
  }

  private updateMenuItems() {
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
              command: () => this.logout(),
            },
            {
              label: 'Profile',
              icon: 'pi pi-user',
              routerLink: '/user/' + this.loggedInId,
            },
            
            ...(this.isAdmin
              ? [
                  {
                    label: 'Admin Panel',
                    icon: 'pi pi-shield',
                    routerLink: '/admin-panel',
                  }
                ]
              : []),
            
            ...(this.isOrganizer
              ? [
                  {
                    label: 'Organizer Panel',
                    icon: 'pi pi-calendar',
                    routerLink: '/organizer-panel',
                  }
                ]
              : []),
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
    ];
  }
  

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/home']);
    this.messageService.add({
      severity: 'info',
      summary: 'Logout Successful',
      detail: 'You have successfully logged out.',
      life: 3000
    });
    this.updateMenuItems();
  }
}
