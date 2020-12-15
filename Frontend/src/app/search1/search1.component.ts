import { Component, OnInit } from '@angular/core';
import { TimetableService } from '../services/timetable.service'

@Component({
  selector: 'app-search1',
  templateUrl: './search1.component.html',
  styleUrls: ['./search1.component.css']
})
export class Search1Component implements OnInit {
  errorMsg ='';
  subjects: any;
  reviews:any;
  constructor(private timetableService: TimetableService) { }
  ngOnInit(): void {
  }
  viewTimetable(subject: string, course: string): void {
    subject = subject.trim();
    course = course.trim();
    this.errorMsg ='';
    var i=0;
    var pattern1 = /^[A-Z]{2,8}$/;
    var pattern2 =/^\d{4}[A-Z]{0,1}$/
    if(course===""){
        course = 'NA';
    }
    if(pattern1.test(subject) && course=='NA'|| pattern1.test(subject)&&pattern2.test(course)){
      this.timetableService.getTimetable(subject,course)
      .subscribe((data)=>{
        this.subjects = data;
      },
      (error: ErrorEvent)=>{
        this.errorMsg = error.error.message;
      });
    }else{
      this.errorMsg = 'Subject must contain 2 to 8 letters (All uppercase) and Course Code must be empty or contain 4 numbers followed by an optional capital letter';
    }
  }
  viewTimetableKey(keyword: string){
    keyword=keyword.trim();
    this.errorMsg ='';
    var i=0;
    var pattern = /^.{5,}$/;
    if(pattern.test(keyword)){
      this.timetableService.getTimetableKey(keyword)
      .subscribe((data)=>{
        this.subjects = data;
      },
      (error: ErrorEvent)=>{
        this.errorMsg = error.error.message;
      });
    }else{
      this.errorMsg="Keyword must be at least 5 characters";
    }
  }

  // async viewReviews(subject: string, course:string){
  //   await this.timetableService.getReviews(subject, course).then(data=>{console.log(data)})
  // }
}
