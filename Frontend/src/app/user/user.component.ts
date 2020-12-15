import { Component, OnInit } from '@angular/core';
import { TimetableService } from '../services/timetable.service';
import { TokenService } from '../services/token.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';
import { EditComponent } from '../edit/edit.component';

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
  schedule:any;
  delErrorMsg='';
  delSuccessMsg='';
  scheduleCourses='';
  constructor(private timetableService: TimetableService, private token: TokenService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.viewSchedules()
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
      console.log(subjects)
      subjects.forEach((object, i) =>{
        var x = new Object({"Subject":(<HTMLInputElement>object).value, "Course":(<HTMLInputElement>courses[i]).value, "Year":(<HTMLInputElement>year[i]).value});
        console.log(x)
        var pattern1 = /^[A-Z]{2,8}$/;
        var pattern2 =/^\d{4}[A-Z]{0,1}$/;
        var pattern3 = /^[123456]?$/;
        if((i>0&&(<HTMLInputElement>object).value=="")){
          return;
        }else if((pattern1.test((<HTMLInputElement>object).value)&&pattern2.test((<HTMLInputElement>courses[i]).value)&&(pattern3.test((<HTMLInputElement>year[i]).value)))){
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
    let name = mySName.trim();
    this.scheduleTimetable = [];
    this.schedule=[];
    var pattern = /^\p{L}{1,10}[1-9]{0,2}$/u
    if(pattern.test(name)){
      this.timetableService.getSchedules()
      .subscribe((schedules) =>{
        schedules.forEach((schedule: any) =>{
          if(schedule.name==name){
            this.schedule=schedule;
            this.timetableService.getScheduleCourses(schedule.name)
            .subscribe((courses)=>{
              courses.forEach((course: any) => {
                this.timetableService.getTimetable(course.Subject, course.Course)
                .subscribe((courses: object[])=>{
                  this.scheduleTimetable.push({courses, year:course.Year});
                }, (error: ErrorEvent) =>{
                  this.schErrorMsg = error.error.message;
                });
              });
            })
          }
        });
      })
      console.log(this.scheduleTimetable)
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
  deleteDialog(name: string){
    this.dialog.open(ConfirmComponent,{data:{name: name}})
  }
  editDialog(schedule:any){
    this.dialog.open(EditComponent,{data:{schedule:schedule}})
  }
}
