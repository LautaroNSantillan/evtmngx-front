import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  getUser(id: string): Observable<any> {
    return this.http.get("user/" + id)
  }

  getAllUsers(): Observable<any> {
    return this.http.get("user/all")
  }

  toggleAdmin(userId: string): Observable<String> {
    return this.http.post<String>(`user/updateRole/${userId}`, {});
  }
  

  updateUser(id:string, firstname:string, lastname:string):Observable<string>{
    const params = new HttpParams()
      .set('firstname', firstname)
      .set('lastname', lastname);
    
    
    return this.http.put<string>("user/update/"+id, {params}).pipe(
      catchError(this.handleError)
    )
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
