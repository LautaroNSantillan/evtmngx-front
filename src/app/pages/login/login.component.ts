import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/api';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent {
  get getUsername(){
    return this.loginForm.get('username')//getter
  }
  get getPassword(){
    return this.loginForm.controls.password;//form controls
  }

  login(): void {
    if (this.loginForm.valid) {
      console.log("Login successful");
      this.messageService.add({severity:'Success', summary:'Success', detail:'Success'})
      this.router.navigateByUrl('/home');
      this.loginForm.reset();
      
    } else {
      this.loginForm.markAllAsTouched();
      this.messageService.add({severity:'error', summary:'Check fields', detail:'Check fields'})
    }
  }

  loginForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.email, Validators.minLength(3)]],  // Group the validators into an array
    password: ['', Validators.required]
  });
  
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router){}
}
