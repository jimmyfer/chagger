import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators, ValidationErrors, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    signUpForm = new FormGroup({
        email: new FormControl('', [
          Validators.required,
          Validators.email
        ], [
          this.checkUserExist()
        ]),
        password: new FormControl('', [
          Validators.required
        ]),
        passwordConfirm: new FormControl('', [
          Validators.required
        ])
      }, {
          asyncValidators: this.passwordMatch()
      })

  constructor( private authService: AuthService ) {}

  ngOnInit(): void {
  }

  passwordMatch(): AsyncValidatorFn {
      return (control: AbstractControl): Observable<ValidationErrors|null> => {
        return new Observable<ValidationErrors>(suscriber => {
            if(!(this.password.value == this.passwordConfirm.value)) {
                suscriber.next({ dontMatch: true});
            }
            suscriber.complete();
        })
      }
  }

  checkUserExist(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
      return this.authService.checkUserExist(this.email.value).then(resp => {
        if(resp.length) {
          return { emailExist: true}
        }
        return null;
      });
    };
  } 

  onSignUp() {
    const { email, password } = this.signUpForm.value;
    this.authService.signUpEmail(email, password);
  }

  get email() {
    return this.signUpForm.get('email')!;
  }

  get password() {
    return this.signUpForm.get('password')!;
  }

  get passwordConfirm() {
    return this.signUpForm.get('passwordConfirm')!;
  }

}