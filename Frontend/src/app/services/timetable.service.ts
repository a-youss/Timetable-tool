import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:3000/';
@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  constructor(private http: HttpClient) { }
  getTimetable(subject: string, course:string): Observable<object[]>{
    return this.http.get<object[]>(AUTH_API+'open'+`/Search/${subject}/${course}`)
  }
}
