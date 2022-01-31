import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
/**
 * Login Component
 */
export class LoginComponent {
  email = new FormControl('');
  password = new FormControl('');
  logInForm = new FormGroup({
      email: this.email,
      password: this.password
  })
  signInState = false;
  
  /**
   * Constructor.
   * @param authService Auth Service.
   */
  constructor( private authService: AuthService, private router: Router) { }

  /**
   * Login to chagger dashboard.
   */
  onLogIn() {
      this.signInState = false;
      const { email, password } = this.logInForm.value;
      this.authService.signInEmail(email, password).then(state => {
          console.log(state);
          if(!state) {
              this.signInState = true;
          }
      });
  }

}
