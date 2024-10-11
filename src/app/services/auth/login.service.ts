import { Injectable } from '@angular/core';
import { LoginRequest } from './interfaces/login-request';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError, Observable, throwError, BehaviorSubject, tap, map } from 'rxjs';
import { LoginResponse } from './interfaces/login-response';
import { User } from '../../interfaces/user';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isLoggedInBool: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<String> = new BehaviorSubject<String>("")/* ({
    id: '',
    firstName: '',
    lastName: '',
    username: '',
    signupDate: '',
    authoredComments: new Set<Comment>(),
    role: ''
  }); */
  constructor(private http:HttpClient, private tokenService:TokenService) { 
    this.isLoggedInBool = new BehaviorSubject<boolean>(sessionStorage
      .getItem('isLoggedIn')!=null);
    this.currentUserData = new BehaviorSubject<String>(sessionStorage
      .getItem('token')|| "");
    
  }

  get userData():Observable<String> {
    return this.currentUserData.asObservable();
  }
  get isLoggedIn():Observable<boolean> {
    return this.isLoggedInBool.asObservable();
  }

  login(credentials: LoginRequest): Observable<string> {
    return this.http.post<LoginResponse>('auth/login', credentials)
      .pipe(
        tap(userData => {
          if (userData && userData.user) {
            this.tokenService.setToken(userData.jwtToken)
            this.currentUserData.next(userData.jwtToken);
            this.isLoggedInBool.next(true);
          } else {
            console.error("Invalid user data:", userData);
          }
        }),
        map((userData)=> userData.jwtToken),
        catchError(this.handleError)
      );
  }

  logout():void{
    this.tokenService.logout();
    this.isLoggedInBool.next(false);
  }
  

  private handleError(error: HttpErrorResponse){
    console.error("Full error object:", error);
    if(error.status === 0){
      console.error("Network error:", error.error);
    }else{
      console.error("Backend error:", error.status, error.error);
    }
    return throwError(() => new Error("Something went wrong. Try again."));
  }
}
