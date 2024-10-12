import { Component,  OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginService } from '../../services/auth/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers:[MessageService]
})
export class ProfileComponent implements OnInit {
  isLoggedIn: boolean = false;
  display: boolean = false;
  user!: User;
  loading: boolean = true;
  toEditUser:User={...this.user};
  loggedInId?:string = "";
  

  constructor(private userService: UserService, 
    private route: ActivatedRoute, 
    private messageService: MessageService,
    private loginService:LoginService) {
    this.loginService.isLoggedIn.subscribe({
      next:(bool)=>{
        this.isLoggedIn=bool;
      }
    });this.loginService.userObject.subscribe({
      next:(user)=>{
        this.loggedInId = user.id;
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const userId = params['id'];
      if (userId) {
        this.fetchUser(userId);
      }
    });
    this.loginService.userObject.subscribe({
      next:(user)=>{
        this.loggedInId = user.id;
      }
    })
  }


  fetchUser(id: string): void {
    this.loading = true;
    this.userService.getUser(id).subscribe({
      next: (user: User) => {
        this.user = user;
        console.log(user);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching user', err);
        this.loading = false;
      },
    });
  }
  showModal() {
    this.display = true;
  }
  hideModal() {
    this.display = false;
  }

  saveChanges() {
    if(this.isLoggedIn){
      console.log('Saving changes:', this.user);
    this.userService.updateUser(this.user.id, this.toEditUser.firstname, this.toEditUser.lastname).subscribe({
      next:(res)=>{
        console.log(res)
      },
      error:(err)=>{
        console.log(err)
      },
      complete:()=>{
        this.messageService.add({severity:'success', summary:'Success', detail:"Updated"})
      }
    });
    this.hideModal();
    }
    
  }

  formValid() {
    return this.user.firstname.trim() !== '' && this.user.lastname.trim() !== '';
  }

}
