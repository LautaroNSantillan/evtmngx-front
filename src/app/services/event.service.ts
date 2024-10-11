import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
}
