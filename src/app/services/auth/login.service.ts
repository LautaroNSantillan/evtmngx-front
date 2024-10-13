import { Injectable } from '@angular/core';
import { LoginRequest } from './interfaces/login-request';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError, Observable, throwError, BehaviorSubject, tap, map, switchMap, of } from 'rxjs';
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
  isAdminSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isOrganizerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  loggedInIdSubject: BehaviorSubject<String> = new BehaviorSubject<String>("");
  currentUserData: BehaviorSubject<String> = new BehaviorSubject<String>("");
  currentUserObject: BehaviorSubject<User> = new BehaviorSubject<User>({
    id: '',
    firstname: '',
    lastname: '',
    username: '',
    signupDate: '',
    authoredComments: [],  
    attendedEvents: [],    
    roles: []
  });

  constructor(private http: HttpClient, private tokenService: TokenService, private userService: UserService) {
    
    const savedUser = sessionStorage.getItem('currentUser');
    const savedToken = sessionStorage.getItem('TOKEN');
    const savedId = sessionStorage.getItem('id');

    
    if (savedUser && savedToken) {
      this.fetchUpdatedUser();
      this.isLoggedInBool.next(true);
      this.currentUserData.next(savedToken);
      this.currentUserObject.next(JSON.parse(savedUser));
      this.loggedInIdSubject.next(savedId!);

      
      this.checkRoles();
    } else {
      this.isLoggedInBool.next(false);
    }
  }

  fetchUpdatedUser(): Observable<string> {
    return this.id.pipe(
      switchMap((id) => {
        console.log("Fetching user with ID: " + id);
        return this.userService.getUser(id as string);
      }),
      tap((updatedUser) => {
        console.log("Updated user: ", updatedUser);
        this.currentUserObject.next(updatedUser);
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.checkRoles(); 
      }),
      map(() => 'updated'),
      catchError((error) => {
        console.error("Error fetching user:", error);
        return of('error');
      })
    );
  }

  private checkRoles() {
    const user = this.currentUserObject.value;
    console.log("User roles: ", user.roles);
    this.isAdminSubject.next(user.roles.includes('ADMIN'));
    this.isOrganizerSubject.next(user.roles.includes('ORGANIZER'));
    console.log("Is Admin: ", this.isAdminSubject.value);  
    console.log("Is Organizer: ", this.isOrganizerSubject.value);  
  }

  get isAdmin(): Observable<boolean> {
    return this.isAdminSubject.asObservable();
  }

  get isOrganizer(): Observable<boolean> {
    return this.isOrganizerSubject.asObservable();
  }

  get userData(): Observable<String> {
    return this.currentUserData.asObservable();
  }

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInBool.asObservable();
  }

  get userObject(): Observable<User> {
    return this.currentUserObject.asObservable();
  }

  get id(): Observable<String> {
    return this.loggedInIdSubject.asObservable();
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
            sessionStorage.setItem('id', userData.user.id);
            this.loggedInIdSubject.next(userData.user.id);

            this.userService.getUser(userData.user.id).subscribe({
              next: (fullUser) => {
                console.log("Full User Object: ", fullUser);
                this.currentUserObject.next(fullUser);
                sessionStorage.setItem('currentUser', JSON.stringify(fullUser));

                
                this.checkRoles();  
              },
              error: (error) => {
                console.error("Error fetching user:", error);
              }
            });
          } else {
            console.error("Invalid user data:", userData);
          }
        }),
        map((userData) => userData.jwtToken),
        catchError(this.handleError)
      );
  }

  logout(): void {
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
      attendedEvents: [],
      roles: []
    });
  }

  setIsLoggedIn(str: string): void {
    sessionStorage.setItem('isLoggedIn', str);
    const isLoggedIn = (str === 'true');
    this.isLoggedInBool.next(isLoggedIn);
  }

  private handleError(error: HttpErrorResponse) {
    console.error("Full error object:", error);
    if (error.status === 0) {
      console.error("Network error:", error.error);
    } else {
      console.error("Backend error:", error.status, error.error);
    }
    return throwError(() => new Error("Something went wrong. Try again."));
  }
}
