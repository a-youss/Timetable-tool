import { Component, OnInit } from '@angular/core';
import { TimetableService } from '../services/timetable.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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
  scheduleCourses:any;
  description='';
  constructor(private token: TokenService, private timetableService:TimetableService) { }
  isLoggedIn=false;

  ngOnInit(): void {
    this.currentUser=this.token.getUser();
    console.log(this.currentUser.admin)
    if(this.currentUser.name){
      this.isLoggedIn=true;
    }else{
      this.isLoggedIn=false;
    }
    this.viewSchedules()
  }

  viewSchedules(){
    this.schedules=[];
    this.timetableService.getPublicSchedules()
    .subscribe((schedules) =>{
      this.schedules=schedules;
    }, err=>{
      this.schedulesMsg=err.error.msg
    })
  }

  viewCourses(name: string){
    this.schedule = name;
    this.scheduleTimetable = [];
    this.scheduleCourses=[];
    this.description='';
    this.timetableService.getPublicSchedules()
    .subscribe((schedules) =>{
      schedules.forEach((schedule: any) => {
        if(schedule.schedule.name==name){
          this.scheduleCourses=schedule.schedule.courses;
          if(schedule.schedule.description){
            this.description=schedule.schedule.description;
          }
          schedule.schedule.courses.forEach((course: any) => {
            this.timetableService.getTimetable(course.Subject, course.Course)
            .subscribe((courses: object[])=>{
              courses.push(course.Year)
              this.scheduleTimetable.push(courses);
            }, (error: ErrorEvent) =>{
              this.schErrorMsg = error.error.message;
            });
          });
        }
      });
    }, err=>{
      this.schedulesMsg=err.error.msg
    })
    console.log(this.scheduleCourses)
  }

  logOut(){
    this.token.signOut()
    location.reload()
  }
}
