import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../../services/auth/login.service';
import { User } from '../../interfaces/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy{
  isUserLoggedIn: boolean = false;
  userData?: User = undefined;
  private isLoggedInSubscription?: Subscription;
  private currentUserDataSubscription?: Subscription;
  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.isLoggedInSubscription = this.loginService.isLoggedIn.subscribe({
      next: (userLoggedIn) => {
        this.isUserLoggedIn = userLoggedIn;
      },
    });

    this.currentUserDataSubscription = this.loginService.currentUserData.subscribe({
      next: (userData) => {
        this.userData = userData;
      },
    });
  }

  ngOnDestroy(): void {
    this.isLoggedInSubscription?.unsubscribe();
    this.currentUserDataSubscription?.unsubscribe();
  }
}
