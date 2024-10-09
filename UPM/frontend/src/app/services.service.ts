import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private loginurl = "http://localhost:3000/api/login";
  
  constructor(private http: HttpClient) { }
  
  login(username: string, password: string): Observable<any> {
    console.log("User is:",{username, password});
    return this.http.post<any>(this.loginurl, { username, password });
  }
}
