import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-regis',
  templateUrl: './regis.component.html',
  styleUrls: ['./regis.component.css']
})
export class RegisComponent implements OnInit {
  
  errorMsg = '';
  regSuccessful= false;
  successMsg ='';
  validated= false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }
  register(name: string, email: string, password: string, passwordConf: string){
    var pattern1 = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if(!email){
      this.errorMsg = 'Please enter an e-mail';
    }else if(!password){
      this.errorMsg = 'Please enter a password';
    }else{
      if(pattern1.test(email)){
        this.authService.register(name, email, password, passwordConf).subscribe(
          data => {
            this.regSuccessful= true;
            this.successMsg= ''+window.location.href+'/'+data.accessToken;
          },err => {
            this.errorMsg = err.error.msg;
            console.log(err.error.msg)
          }
        );
      }else{
        this.errorMsg = 'Please enter a valid email';
      }
    }
  }

  verifyEmail(email:string){
    this.authService.verifyEmail(email)
    .subscribe(()=>{
      this.validated=true;
    }, err=>{
      this.validated=false;
    })

  }
}
