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
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }
  register(name: string, email: string, password: string, passwordConf: string){
    this.authService.register(name, email, password, passwordConf).subscribe(
      data => {
        this.regSuccessful= true;
        console.log(data);
      },
      err => {
        this.errorMsg = err.error.msg;
        console.log(err.error.msg)
      }
    );
  }
}
