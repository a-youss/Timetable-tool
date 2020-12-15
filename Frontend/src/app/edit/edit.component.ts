import { Component, Inject, OnInit } from '@angular/core';
import { TimetableService } from '../services/timetable.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {schedule: any}, private timetableService: TimetableService) { }
  courses=this.data.schedule.courses;
  addErrorMsg="";
  errorMsg='';
  ngOnInit(): void {
  }
  removeCourse(subject:string, course:string){
    this.courses.forEach((c:any,i:number)=>{
      if(c.Subject==subject && course==c.Course){
        this.courses.splice(i, 1)
      }
    })
  }
  addCourses(subject:string, course:string, year:string){
    this.addErrorMsg =''
    var pattern1 = /^[A-Z]{2,8}$/;
    var pattern2 =/^\d{4}[A-Z]{0,1}$/;
    var pattern3 = /^[123456]?$/;
    if(pattern1.test(subject)&&pattern2.test(course)&&pattern3.test(year)){
      this.courses.push({Subject:subject,Course:course,Year:year})
    }else{
      this.addErrorMsg ='Subject must contain 2 to 8 letters (All uppercase), Course Code must be empty or contain 4 numbers followed by an optional capital letter, year must be left empty or be a number between 1-6'
    }
  }
  saveChanges(description:string, visibility:string){
    this.errorMsg =''
    this.timetableService.editSchedule(this.data.schedule.name, description, this.courses, visibility)
    .subscribe((res)=>{
      if(res.msg){
        location.reload()
      }
    },(error: ErrorEvent) => {
      this.errorMsg =error.error.msg;
    });
  }
}
