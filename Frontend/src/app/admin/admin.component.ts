import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private userService: UserService, private tokenStorage: TokenService) { }
  users:any;
  ngOnInit(): void {
    this.userService.getUsers().subscribe(data=>{this.users=data
    console.log(data)})
  }
  updateUser(email:string, admin:string, deactivated:string){
    this.userService.updateUser(email, admin, deactivated).subscribe(data=>{
      console.log(data)
    });
  }
}
