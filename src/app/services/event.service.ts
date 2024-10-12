import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { EventLocation } from '../interfaces/eventLocation';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  public getEvents(page = 0, size = 10): Observable<any>{
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get("event/all", { params });
  }

  public searchEvents(page = 0, size = 10, keyword:string): Observable<any>{
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('keyword', keyword);

    return this.http.get("event/search", { params });
  }
  public sortedEvents(page = 0, size = 10, ascending:boolean): Observable<any>{
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('ascending', ascending);

    return this.http.get("event/sort", { params });
  }

  public attendEvent(attendeeId: string, eventLocationId: string): Observable<any> {
    const params = new HttpParams()
      .set('attendeeId', attendeeId)
      .set('eventLocationId', eventLocationId);
  
    return this.http.post("event/attend", null, { params })
  }
  
  public unattendEvent(attendeeId: string, eventLocationId: string): Observable<any> {
    const params = new HttpParams()
      .set('attendeeId', attendeeId)
      .set('eventLocationId', eventLocationId);
  
    return this.http.post("event/unattend", null, { params })
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
