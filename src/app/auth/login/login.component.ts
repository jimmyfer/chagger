import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = new FormControl('');
  password = new FormControl('');
  logInForm = new FormGroup({
      email: this.email,
      password: this.password
  })
  signInState = true;

  constructor( private authService: AuthService) { }

  ngOnInit(): void {
  }

  async onLogIn() {
      this.signInState = true;
      const { email, password } = this.logInForm.value;
      this.signInState = await this.authService.signInEmail(email, password);
      // FIXME: missing navigation maybe?
  }

}
