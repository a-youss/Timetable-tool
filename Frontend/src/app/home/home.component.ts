import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser:any;
  constructor(private token: TokenService) { }
  isLoggedIn=false;
  ngOnInit(): void {
    this.currentUser=this.token.getUser();
    console.log(this.currentUser.name)
    if(this.currentUser.name){
      this.isLoggedIn=true;
    }else{
      this.isLoggedIn=false;
    }
  }
  logOut(){
    this.token.signOut()
    location.reload()
  }
}
