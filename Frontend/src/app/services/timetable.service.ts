import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { promise } from 'protractor';

const BASE_URL = 'http://localhost:3000/';
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
  // async getReviews(subject:string, course:string):Promise<any>{
  //   let promise= await this.http.get<any>(BASE_URL+`/open/Review/${course}/${subject}`).toPromise()
  //   console.log(promise.json())
  //   return promise
  // }
  getPublicSchedules(): Observable<object[]>{
    return this.http.get<object[]>(BASE_URL+`open/Schedules`)
  }
  deleteSchedule(schedule:string):Observable<any>{
    return this.http.delete<any>(BASE_URL+`secure/Delete/${schedule}`)
  }
  getScheduleCourses(schedule:string):Observable<any>{
    return this.http.get<any>(BASE_URL+`secure/Schedule/${schedule}`)
  }
}
