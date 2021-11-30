import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  logInForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  constructor( private authService: AuthService) { }

  ngOnInit(): void {
  }

  onLogIn() {
    const { email, password } = this.logInForm.value;
    this.authService.signInEmail(email, password);
  }

  get email() {
    return this.logInForm.get('email')!;
  }

  get password() {
    return this.logInForm.get('password')!;
  }

}
