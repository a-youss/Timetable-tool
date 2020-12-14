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
    this.timetableService.getPublicSchedules()
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
  logOut(){
    this.token.signOut()
    location.reload()
  }
}
