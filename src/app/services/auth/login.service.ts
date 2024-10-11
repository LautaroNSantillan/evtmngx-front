import { Injectable } from '@angular/core';
import { LoginRequest } from './interfaces/login-request';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError, Observable, throwError, BehaviorSubject, tap } from 'rxjs';
import { LoginResponse } from './interfaces/login-response';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isLoggedInBool: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<User> = new BehaviorSubject<User>({
    id: '',
    firstName: '',
    lastName: '',
    username: '',
    signupDate: '',
    authoredComments: new Set<Comment>(),
    role: ''
  });
  constructor(private http:HttpClient) { }

  get userData():Observable<User> {
    return this.currentUserData.asObservable();
  }
  get isLoggedIn():Observable<boolean> {
    return this.isLoggedInBool.asObservable();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('auth/login', credentials)
      .pipe(
        tap(userData => {
          if (userData && userData.user) {
            this.currentUserData.next(userData.user); // Ensure `userData.user` is defined
            this.isLoggedInBool.next(true);
          } else {
            console.error("Invalid user data:", userData);
          }
        }),
        catchError(this.handleError)
      );
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
