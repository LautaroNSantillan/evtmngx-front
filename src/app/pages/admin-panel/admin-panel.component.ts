import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService , private loginService: LoginService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  
  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users; 
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  
  toggleAdmin(user: any): void {
    
    this.userService.toggleAdmin(user.id).subscribe({
      next: () => {
        
        console.log('User admin status updated');
        this.loadUsers();  
      },
      error: (err) => {
        console.error('Error toggling admin role:', err);
        this.loadUsers();
      }
    });
  }
}
