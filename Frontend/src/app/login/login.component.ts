import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  errorMsg = '';
  loginSuccessful= false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  login(email: string, password: string){
    var pattern1 = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if(!email){
      this.errorMsg = 'Please enter an e-mail';
    }else if(!password){
      this.errorMsg = 'Please enter a password';
    }else{
      if(pattern1.test(email)){
        this.authService.login(email, password).subscribe(
          data => {
            this.loginSuccessful= true;
            console.log(data);
          },
          err => {
            this.errorMsg = err.error.msg;
            console.log(err.error.msg)
          }
        );
      }else{
        this.errorMsg = 'Please enter a valid email';
      }
    }
  }
}
