import { Component, OnInit } from '@angular/core';
import { TimetableService } from '../services/timetable.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  successMsg= '';
  errorMsg='';
  addErrorMsg =''
  schedulesMsg='';
  schErrorMsg='';
  revErrorMsg='';
  pairs: any;
  currentUser:any;
  schedules: any;
  scheduleTimetable : any;
  schedule='';
  constructor(private timetableService: TimetableService, private token: TokenService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.viewSchedules()
  }

  addtoList(){
    var target = document.getElementById('AddToList');
    var subl = document.createElement('label');
    var corl = document.createElement('label');
    var subi = document.createElement('input');
    var cori = document.createElement('input');
    var yrl = document.createElement('label');
    var yri = document.createElement('input');
    subi.setAttribute("type", "text");
    cori.setAttribute("type", "text");
    subi.setAttribute("class", "addSubject");
    cori.setAttribute("class", "addCourse");
    cori.setAttribute("type", "text");
    subi.setAttribute("class", "year");
    var sub = document.createTextNode('Subject ');
    var cor = document.createTextNode(' Course ');
    var yr = document.createTextNode(' Year Taken ');
    subl.appendChild(sub);
    corl.appendChild(cor);
    yrl.appendChild(yr);
    if(target?.parentNode){
      target.parentNode.insertBefore(document.createElement('br'), target);
      target.parentNode.insertBefore(subl, target);
      target.parentNode.insertBefore(subi, target);
      target.parentNode.insertBefore(corl, target);
      target.parentNode.insertBefore(cori, target);
      target.parentNode.insertBefore(yrl, target);
      target.parentNode.insertBefore(yri, target);
    }
  }

  createSchedule(name: string, desc: string, visibility:string){
    name = name.trim();
    desc = desc.trim();
    visibility = visibility.trim();
    this.successMsg ='';
    this.errorMsg ='';
    this.addErrorMsg ='';
    var pattern = /^\p{L}{1,10}[1-9]{0,2}$/u
    if(pattern.test(name)){
      var subjects = document.querySelectorAll('.addSubject');
      var courses = document.querySelectorAll('.addCourse');
      var year = document.querySelectorAll('.year');
      this.pairs = [];
  
      subjects.forEach((object, i) =>{
        var x = new Object({"Subject":(<HTMLInputElement>object).value, "Course":(<HTMLInputElement>courses[i]).value, "Year":(<HTMLInputElement>year[i]).value});
        var pattern1 = /^[A-Z]{2,8}$/;
        var pattern2 =/^\d{4}[A-Z]{0,1}$/;
        var pattern3 = /^[123456]?$/;
        if(pattern1.test((<HTMLInputElement>object).value)&&pattern2.test((<HTMLInputElement>courses[i]).value)&&(pattern3.test((<HTMLInputElement>year[i]).value))){
            this.pairs.push(x);
        }else{
            this.addErrorMsg ='Subject must contain 2 to 8 letters (All uppercase), Course Code must be empty or contain 4 numbers followed by an optional capital letter, year must be left empty or be a number between 1-6'
        }
      });
      if(!this.addErrorMsg){
        this.timetableService.createSchedule(this.currentUser.name, name, this.pairs, desc, visibility)
        .subscribe((res)=>{
          if(res.msg){
            location.reload()
          }
        },(error: ErrorEvent) => {
          this.errorMsg =error.error.msg;
        });
      }
    }else{
      this.errorMsg = 'Schedule Name must be between 1 and 10 characters (letters from any language) followed by a number between 1-99';
    }
  }

  viewSchedules(){
    this.timetableService.getSchedules()
    .subscribe((schedules) =>{
      this.schedules=schedules;
    }, err=>{
      this.schedulesMsg=err.error.msg
    })
  }

  viewScheduleTimetable(mySName: string){
    this.schedule = mySName.trim();
    this.scheduleTimetable = [];
    var pattern = /^\p{L}{1,10}[1-9]{0,2}$/u
    if(pattern.test(this.schedule)){
      this.schedules.forEach((schedule: any) =>{
        schedule.courses.forEach((course: any) => {
          this.timetableService.getTimetable(course.Subject, course.Course)
          .subscribe((courses: object[])=>{
            courses.push(course.Year)
            this.scheduleTimetable.push(courses);
          }, (error: ErrorEvent) =>{
            this.schErrorMsg = error.error.message;
          });
        });
      });
    }
  }

  postReview(subject: string, course: string, review: string){
    subject=subject.trim()
    course=course.trim()
    review=review.trim()
    var pattern1 = /^[A-Z]{2,8}$/;
    var pattern2 =/^\d{4}[A-Z]{0,1}$/;
    var pattern3 = /^.{3,150}$/u;
    if(pattern1.test(subject)&&pattern2.test(course)&&pattern3.test(review)){
      this.timetableService.addReview(subject,course,review, this.currentUser.name)
      .subscribe((res)=>{
        if(res.msg){
          console.log(res)
        }
      },(error: ErrorEvent) => {
        this.revErrorMsg =error.error.msg;
      });
    }else{
      this.revErrorMsg = 'Subject must contain 2 to 8 letters (All uppercase), Course Code must be empty or contain 4 numbers followed by an optional capital letter, and the review must be between 3 and 150 characters';
    }
  }
}
