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
  }
}
