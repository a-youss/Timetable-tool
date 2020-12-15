import { Component, Inject, OnInit } from '@angular/core';
import { TimetableService } from '../services/timetable.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-review-confirm',
  templateUrl: './review-confirm.component.html',
  styleUrls: ['./review-confirm.component.css']
})
export class ReviewConfirmComponent implements OnInit {

  revErrorMsg='';
  revSuccessMsg='';
  constructor(@Inject(MAT_DIALOG_DATA) public data: {subject:string, course:string, review:string, user:any}, private timetableService: TimetableService) { }

  ngOnInit(): void {
  }
  postReview(subject: string, course: string, review: string, user:any){
    this.timetableService.addReview(subject,course,review, user.name)
    .subscribe((res)=>{
      if(res.msg){
        location.reload()
      }
    },(error: ErrorEvent) => {
      this.revErrorMsg =error.error.msg;
    });
  }
}
