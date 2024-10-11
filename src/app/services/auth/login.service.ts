import { Injectable } from '@angular/core';
import { LoginRequest } from './interfaces/login-request';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginResponse } from './interfaces/login-response';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  login(credentials:LoginRequest):Observable<LoginResponse>{
    return this.http
    .post<LoginResponse>
    ('/auth/login', credentials)
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse){
    if(error.status===0){
      console.error("error:", error.error);
    }else{
      console.error("backend error:", error.status, error.error);
    }
    return throwError(()=> new Error("Something went wrong. Try again."));
  }
}
