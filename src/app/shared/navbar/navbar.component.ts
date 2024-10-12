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
  loggedInId: string="";
 
  constructor(private loginService: LoginService, 
    private router: Router,
  private messageService:MessageService) {}


  ngOnInit() {
  this.loginService.isLoggedIn.subscribe({
      next: (userLoggedIn) => {
        this.isUserLoggedIn = userLoggedIn;
        this.updateMenuItems(); 
      },
    });
    this.loginService.currentUserObject.subscribe({
      next:(user)=>{
        this.loggedInId = user.id;
        this.updateMenuItems();;
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
                routerLink: '/user/'+ this.loggedInId ,
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
  logout():void{
    this.loginService.logout();
    this.router.navigate(["/home"]);
    this.messageService.add({
      severity: 'info',
      summary: 'Logout Successful',
      detail: 'You have successfully logged out.',
      life: 3000 
    });
    this.updateMenuItems();
  }

}
