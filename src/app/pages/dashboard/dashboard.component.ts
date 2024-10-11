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
  private isLoggedInSubscription?: Subscription;
  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.isLoggedInSubscription = this.loginService.isLoggedIn.subscribe({
      next: (userLoggedIn) => {
        this.isUserLoggedIn = userLoggedIn;
      },
    });

  }

  ngOnDestroy(): void {
    this.isLoggedInSubscription?.unsubscribe();
  }
}
