import { Injectable } from '@angular/core';
import { LoginRequest } from './interfaces/login-request';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError, Observable, throwError, BehaviorSubject, tap, map } from 'rxjs';
import { LoginResponse } from './interfaces/login-response';
import { User } from '../../interfaces/user';
import { TokenService } from './token.service';
import { Comment } from '@angular/compiler';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isLoggedInBool: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<String> = new BehaviorSubject<String>("");
  currentUserObject: BehaviorSubject<User> = new BehaviorSubject<User>({
    id: '',
    firstname: '',
    lastname: '',
    username: '',
    signupDate: '',
    authoredComments: [],  
    attendedEvents: [],    
    role: ''
  });
  constructor(private http:HttpClient, private tokenService:TokenService, private userService:UserService) { 
    this.isLoggedInBool = new BehaviorSubject<boolean>(sessionStorage
      .getItem('isLoggedIn')!=null);
    this.currentUserData = new BehaviorSubject<String>(sessionStorage
      .getItem('TOKEN')|| "");
      const savedUser = sessionStorage.getItem('currentUser');
      const savedToken = sessionStorage.getItem('TOKEN');
      
      if (savedUser && savedToken) {
        this.isLoggedInBool.next(true);
        this.currentUserData.next(savedToken);
        this.currentUserObject.next(JSON.parse(savedUser)); 
      } else {
        this.isLoggedInBool.next(false);
      }
  }
  fetchUpdatedUser(): Observable<any> {
    const currentUserId = this.currentUserObject.value.id;
    console.log("User ID in fetchUpdatedUser: " + currentUserId); // Debug the user ID
  
    return this.userService.getUser(currentUserId)
    .pipe(
      tap(
         (updatedUser) => {
          console.log("Fetched updated user: ", updatedUser); // Debug the fetched data
          this.currentUserObject.next(updatedUser); // Update the BehaviorSubject
          sessionStorage.setItem('currentUser', JSON.stringify(updatedUser)); // Save to session storage
        },
      ),
      catchError(this.handleError)
    );
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
            this.tokenService.setToken(userData.jwtToken);
            this.setIsLoggedIn('true');
            
            sessionStorage.setItem('currentUser', JSON.stringify(userData.user));
            this.currentUserData.next(userData.jwtToken);
            this.isLoggedInBool.next(true);
            
            
            this.userService.getUser(userData.user.id).subscribe({
              next:(fullUser)=>{
                this.currentUserObject.next(fullUser);
                sessionStorage.setItem('currentUser', JSON.stringify(fullUser));
              }
            }     
            );
          } else {
            console.error("Invalid user data:", userData);
          }
        }),
        map((userData) => userData.jwtToken),
        catchError(this.handleError)
      );
  }


  logout():void{
    this.tokenService.logout();
    this.setIsLoggedIn('false');
    this.isLoggedInBool.next(false);

    sessionStorage.removeItem('currentUser');
    this.currentUserObject.next({
      id: '',
      firstname: '',
      lastname: '',
      username: '',
      signupDate: '',
      authoredComments: [],
    attendedEvents:[],
      role: ''
    });
  }

  setIsLoggedIn(str: string): void {
    sessionStorage.setItem('isLoggedIn', str);
    const isLoggedIn = (str === 'true');
    this.isLoggedInBool.next(isLoggedIn);
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
