import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:3000/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers():Observable<any>{
    return this.http.get<any>(BASE_URL+'open/Users')
  }
  updateUser(email:string, admin:string, deactivated:string):Observable<any>{
    return this.http.post<any>(BASE_URL+'admin/UpdateUser',{
      email,
      admin,
      deactivated
    }, httpOptions)
  }
}
