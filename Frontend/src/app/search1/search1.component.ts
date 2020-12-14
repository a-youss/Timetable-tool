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
        console.log(data)
      },
      (error: ErrorEvent)=>{
        this.errorMsg = error.error.message;
      });
    }else{
      this.errorMsg = 'Subject must contain 2 to 8 letters (All uppercase) and Course Code must be empty or contain 4 numbers followed by an optional capital letter';
    }
  }
  viewReviews(subject: string, course:string){
    this.reviews=[];
    this.timetableService.getReviews(subject, course)
    .subscribe(data=>{
      this.reviews=data;
      console.log(data)
    })
  }
}
