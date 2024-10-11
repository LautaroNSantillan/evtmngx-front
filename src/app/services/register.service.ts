import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterRequest } from './auth/interfaces/register-request';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  public register( newUser: RegisterRequest): Observable<any>{
    return this.http.post("auth/register", newUser);
  }

}
