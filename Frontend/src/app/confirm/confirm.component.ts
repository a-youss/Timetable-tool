import { Component, Inject, OnInit } from '@angular/core';
import { TimetableService } from '../services/timetable.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  delErrorMsg='';
  delSuccessMsg='';
  constructor(@Inject(MAT_DIALOG_DATA) public data: {name: string}, private timetableService: TimetableService) { }

  ngOnInit(): void {
  }
  deleteSchedule(schedule:string){
    var schedule = schedule.trim();
    this.delErrorMsg='';
    this.delSuccessMsg='';
    var pattern = /^\p{L}{1,10}[1-9]{0,2}$/u
    if(pattern.test(schedule)){
      this.timetableService.deleteSchedule(schedule)
      .subscribe(()=>{
        location.reload()
      }, (error:ErrorEvent)=>{
        this.delErrorMsg = error.error.message;
      });
    }else{
      this.delErrorMsg='Schedule Name must be between 1 and 10 characters (letters from any language) followed by a number between 1-99'
    }
  }
}
