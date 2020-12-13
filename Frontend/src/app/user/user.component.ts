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
  pairs: any;
  currentUser:any;
  constructor(private timetableService: TimetableService, private token: TokenService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }
  addtoList(){
    var target = document.getElementById('AddToList');
    var subl = document.createElement('label');
    var corl = document.createElement('label');
    var subi = document.createElement('input');
    var cori = document.createElement('input');
    subi.setAttribute("type", "text");
    cori.setAttribute("type", "text");
    subi.setAttribute("class", "addSubject");
    cori.setAttribute("class", "addCourse");
    var sub = document.createTextNode('Subject ');
    var cor = document.createTextNode(' Course ');
    subl.appendChild(sub);
    corl.appendChild(cor);
    if(target?.parentNode){
      target.parentNode.insertBefore(document.createElement('br'), target);
      target.parentNode.insertBefore(subl, target);
      target.parentNode.insertBefore(subi, target);
      target.parentNode.insertBefore(corl, target);
      target.parentNode.insertBefore(cori, target);
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
      this.pairs = [];
  
      subjects.forEach((object, i) =>{
        var x = new Object({"Subject":(<HTMLInputElement>object).value, "Course":(<HTMLInputElement>courses[i]).value});
        var pattern1 = /^[A-Z]{2,8}$/;
        var pattern2 =/^\d{4}[A-Z]{0,1}$/;
        if(pattern1.test((<HTMLInputElement>object).value)&&pattern2.test((<HTMLInputElement>courses[i]).value)){
            this.pairs.push(x);
        }else{
            this.addErrorMsg ='Subject must contain 2 to 8 letters (All uppercase) and Course Code must be empty or contain 4 numbers followed by an optional capital letter'
        }
      });
      if(!this.addErrorMsg){
        this.timetableService.createSchedule(this.currentUser.name, name, this.pairs, desc, visibility)
        .subscribe((res)=>{
          this.successMsg=res.msg;
        },(error: ErrorEvent) => {
          this.errorMsg =error.error.msg;
        });
      }
    }else{
      this.errorMsg = 'Schedule Name must be between 1 and 10 characters (letters from any language) followed by a number between 1-99';
    }
  }
}
