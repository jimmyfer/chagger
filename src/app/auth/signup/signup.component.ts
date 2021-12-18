import {Component, OnInit} from '@angular/core';

import {FormGroup, FormControl, Validators, ValidationErrors, AsyncValidatorFn, AbstractControl} from '@angular/forms';
import {Observable} from 'rxjs/internal/Observable';
import {AuthService} from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    email = new FormControl('', [ Validators.required, Validators.email ], [ this.checkUserExist() ]);
    password = new FormControl('', [ Validators.required ]);
    passwordConfirm = new FormControl('', [ Validators.required ]);

    signUpForm = new FormGroup({
        email: this.email,
        password: this.password,
        passwordConfirm: this.passwordConfirm
      }, {
          asyncValidators: this.passwordMatch()
      })
    signUpState: boolean = true;

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

  async onSignUp(): Promise<void> {
    this.signUpState = true;
    const {email, password} = this.signUpForm.value;
    this.signUpState = await this.authService.signUpEmail(email, password);
  }

}