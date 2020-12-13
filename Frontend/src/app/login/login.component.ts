import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; 
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  errorMsg = '';
  isLoggedIn = false;
  loginSuccessful= false;
  admin=false;
  constructor(private authService: AuthService, private tokenStorage: TokenService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.admin = this.tokenStorage.getUser().admin;
    }
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
            this.tokenStorage.saveToken(data.accessToken);
            this.tokenStorage.saveUser(data);
            this.admin = this.tokenStorage.getUser().admin;
            this.loginSuccessful= true;
            this.isLoggedIn = true;
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
