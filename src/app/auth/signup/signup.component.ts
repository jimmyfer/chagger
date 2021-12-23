import { Component, OnInit } from '@angular/core';

import {
    FormGroup,
    FormControl,
    Validators,
    ValidationErrors,
    AsyncValidatorFn,
    AbstractControl,
    ValidatorFn,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})

/**
 * Users signup component.
 */
export class SignupComponent {
    email = new FormControl(
        '',
        [Validators.required, Validators.email],
        [this.checkUserExist()]
    );
    password = new FormControl('', [Validators.required]);
    passwordConfirm = new FormControl('', [Validators.required]);

    signUpForm = new FormGroup(
        {
            email: this.email,
            password: this.password,
            passwordConfirm: this.passwordConfirm,
        },
        this.passwordMatch()
    );
    signUpState = true;

    /**
     * 
     * @param authService The service to handle auth conections.
     */
    constructor(private authService: AuthService) {}

    /**
     * Check if password and confirm password match.
     * @returns return true or false if passwords match or not.
     */
    passwordMatch(): ValidatorFn {
        return (): ValidationErrors | null => {
            if(this.password.value == this.passwordConfirm.value) {
                return { dontMatch: true };
            }
            return null;
        };
    }

    /**
     * Check if user exist.
     * @returns Return true or false if user exist or not.
     */
    checkUserExist(): AsyncValidatorFn {
        return (control: AbstractControl): Promise<ValidationErrors | null> => {
            return this.authService
                .checkUserExist(this.email.value)
                .then((resp) => {
                    if (resp.length) {
                        return { emailExist: true };
                    }
                    return null;
                });
        };
    }

    /**
     * Call the auth service to create a new user account with email given.
     */
    async onSignUp(): Promise<void> {
        this.signUpState = true;
        const { email, password } = this.signUpForm.value;
        this.signUpState = await this.authService.signUpEmail(email, password);
    }
}
