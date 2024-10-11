import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginService } from '../../services/auth/login.service';
import { LoginRequest } from '../../services/auth/interfaces/login-request';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent {
  loginError:string="";

  get getUsername(){
    return this.loginForm.get('username')//getter
  }
  get getPassword(){
    return this.loginForm.controls.password;//form controls
  }

  login(): void {
    if (this.loginForm.valid) {   
                                         //casting?
      this.loginService.login(this.loginForm.value as LoginRequest).subscribe({
        next:(user)=>{
          console.log(user);
        },
        error:(error)=>{
          console.log(error);
          this.loginError=error;
          this.messageService.add({severity:'error', summary:'Login error', detail:error})
        },
        complete:()=>{
          this.messageService.add({severity:'Success', summary:'Success', detail:'Success'})
          this.router.navigateByUrl('/home');
          this.loginForm.reset();
        }
      }) 

    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  loginForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],  // Group the validators into an array
    password: ['', Validators.required]
  });
  
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private loginService: LoginService
  ){}
}
