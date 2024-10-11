import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RegisterService } from '../../services/register.service';
import { RegisterRequest } from '../../services/auth/interfaces/register-request';
import { Subscription } from 'rxjs';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [MessageService]
})
export class RegisterComponent {
    regSub?:Subscription;


  get getUsername(){
    return this.registerForm.get('username')//getter
  }
  get getPassword(){
    return this.registerForm.controls.password;//form controls
  }


  register(): void {
    if (this.registerForm.valid){
     this.regSub = this.registerService.register(this.registerForm.value as RegisterRequest).subscribe({
      next:(createdUser: User) => {
        console.log(createdUser)
      },
      error:(error)=> console.log(error),
      complete: () => {
        this.registerForm.reset();
        this.messageService.add({severity:'success', summary:'User Registered', detail:'You may now log in.'})
      }
     });
    }
    else {
      this.registerForm.markAllAsTouched();
    }
  }

  registerForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],  // Group the validators into an array
    password: ['', Validators.required],
    firstname: ['', [Validators.required, Validators.minLength(3)]], 
    lastname: ['', [Validators.required, Validators.minLength(3)]], 
  });
  
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private registerService: RegisterService
  ){}
}
