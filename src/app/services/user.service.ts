import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  getUser(id:string):Observable<User>{
    return this.http.get<User>("user/"+id).pipe(
      catchError(this.handleError)
    )
  };

  updateUser(id:string, firstname:string, lastname:string):Observable<string>{
    const params = new HttpParams()
      .set('firstname', firstname)
      .set('lastname', lastname);
    
    
    return this.http.put<string>("user/update/"+id, {params})
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
