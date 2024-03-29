import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = '/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class TimetableService {

  constructor(private http: HttpClient) { }
  getTimetable(subject: string, course:string): Observable<object[]>{
    return this.http.get<object[]>(BASE_URL+`open/Search/${subject}/${course}`)
  }
  getTimetableKey(keyword: string): Observable<object[]>{
    return this.http.get<object[]>(BASE_URL+`open/SearchKey/${keyword}`)
  }
  createSchedule(owner:string, name:string, pairs:object[], desc:string, visibility: string): Observable<any>{
    return this.http.put<any>(BASE_URL+`secure/Schedule/Create`,{
      owner,
      name,
      pairs,
      desc,
      visibility
    }, httpOptions)
  }
  
  getSchedules(): Observable<object[]>{
    return this.http.get<object[]>(BASE_URL+`secure/Schedules`)
  }

  modifySchedule(name:string, pairs:object[], desc:string, visibility: string): Observable<any>{
    return this.http.post<any>(BASE_URL+`secure/Schedule/Modify`,{
      name,
      pairs,
      desc,
      visibility
    }, httpOptions)
  }

  addReview(subject: string, course: string, review: string, reviewer:string): Observable<any>{
    return this.http.post<any>(BASE_URL+'secure/Review/add',{
      reviewer,
      subject,
      course,
      review
    })
  }
  getReviews(subject:string, course:string):Observable<any>{
    return this.http.get<any>(BASE_URL+`open/Review/${course}/${subject}`)
  }
  getAllReviews():Observable<any>{
    return this.http.get<any>(BASE_URL+`admin/Reviews`)
  }
  updateReview(id:string, visible:boolean):Observable<any>{
    return this.http.post<any>(BASE_URL+'admin/Review/update',{
      id,
      visible
    }, httpOptions)
  }
  getPublicSchedules(): Observable<object[]>{
    return this.http.get<object[]>(BASE_URL+`open/Schedules`)
  }
  deleteSchedule(schedule:string):Observable<any>{
    return this.http.delete<any>(BASE_URL+`secure/Delete/${schedule}`)
  }
  getScheduleCourses(schedule:string):Observable<any>{
    return this.http.get<any>(BASE_URL+`secure/Schedule/${schedule}`)
  }
  editSchedule(name:string, desc:string, pairs:object[], visibility:string):Observable<any>{
    return this.http.post<any>(BASE_URL+'secure/Schedule/Modify',{
      name,
      desc,
      pairs,
      visibility
    }, httpOptions)
  }
}
