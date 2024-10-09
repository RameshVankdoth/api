import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private service:ServicesService, private router: Router){}
  async onSubmit(form: any): Promise<void> {
    if (form.valid) {
      console.log('Form Submitted!', form.value);
      this.username = form.value.username;
      this.password = form.value.password;
      console.log("The username from form is:", this.username);
      this.service.login(this.username, this.password).pipe(
        catchError(error => {
          console.error('An error occured:', error);
          return of (null);
        })
      ).subscribe(result => {
        if (result){
          console.log("Login successful", result);
          this.router.navigate(['/dashboard']);
        }else{
          console.log("Login failed", result);
        }
      })
        
    }
  }
}
