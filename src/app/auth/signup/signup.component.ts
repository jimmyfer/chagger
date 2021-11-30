import {Component, OnInit} from '@angular/core';

import {FormGroup, FormControl, Validators, ValidationErrors, AsyncValidatorFn, AbstractControl} from '@angular/forms';
import {timer} from 'rxjs'; // FIXME: Unnecessary import
import {Observable} from 'rxjs/internal/Observable';
import {switchMap} from 'rxjs/operators'; // FIXME: Unnecessary import
import {AuthService} from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  // +10: very complete form validation 👍
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

  // this could be just an attribute instead of a function that returns a function
  // try to only surround it when it requires argument(s)
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

  // FIXME: Needs return type
  onSignUp() {
    const {email, password} = this.signUpForm.value;
    // FIXME: this promise is not being handled. It should be handled in case of error and in case of success
    // At least errors related to invalid credentials or weak password should be handled with a short and explicative message
    // Other types of errors should be handled with a generic message like "Woah! Something bad happened. Try again later"
    this.authService.signUpEmail(email, password);
  }

  /**
   Recommendation: To avoid using getters (as this gives the code a chance of error because of the falsy assertion: !), it's better to save the
   reference to the form control in the component
   i.e.

   ```typescript
   email = new FormControl('', [Validators.required, Validators.email], [this.checkUserExist()]);
   password = new FormControl('', [Validators.required]);
   passwordConfirm = new FormControl('', [Validators.required]);

   signUpForm = new FormGroup({
      email: this.email,
      password: this.password,
      passwordConfirm: this.passwordConfirm
   }, {
      asyncValidators: this.passwordMatch()
   })
   ```
   **/

  // FIXME: Needs return type
  get email() {
    return this.signUpForm.get('email')!;
  }

  // FIXME: Needs return type
  get password() {
    return this.signUpForm.get('password')!;
  }

  // FIXME: Needs return type
  get passwordConfirm() {
    return this.signUpForm.get('passwordConfirm')!;
  }

}
