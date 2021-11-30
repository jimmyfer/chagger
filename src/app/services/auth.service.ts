import {Injectable} from '@angular/core';
import {first} from 'rxjs/operators'
import firebase from 'firebase/compat/app';

import {Router} from '@angular/router';

import {AngularFireAuth} from '@angular/fire/compat/auth';
import auth = firebase.auth;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
      private router: Router,
      public af: AngularFireAuth
      ) { }

  async signUpEmail( email: string, password: string ):  Promise<boolean> {
    let result
    try {
      result = await this.af.createUserWithEmailAndPassword(email, password);
    } catch (e: any) {
      // FIXME: Remove all console.logs before pushing to master, main or develop.
      // FIXME: try to only catch those errors that are related to bad credentials. If another error occurs, it should be thrown to be caught outside and handle it properly from the view
      console.log(e.code);
      return false;
    }

    return await this.finishLogin(result);
  }

  async signInEmail( email: string, password: string ):  Promise<boolean> {
    let result;
    try {
      result = await this.af.signInWithEmailAndPassword(email, password);
    } catch (e) {
      // FIXME: Remove all console.logs before pushing to master, main or develop.
      console.log(e);
      return false;
    }
    return await this.finishLogin(result);
  }

  async signOut(): Promise<void> {
    await this.af.signOut();
    await this.router.navigate(['auth/login']);
  }

  async finishLogin( credentials: auth.UserCredential): Promise<boolean> {

    if (!credentials.user) {
      // FIXME: Remove all console.logs before pushing to master, main or develop.
      console.log('Sign in failed');
      return false;
    }

    this.goToUserHome();
    return true;
  }

  goToUserHome(): void {
    // FIXME: The promise returned from navigate must be handled, in case of error and success
    this.router.navigate(['/dashboard']);
  }

  // FIXME: Should have return type
  async isLoggedIn() {
    return this.af.authState.pipe(first()).toPromise();
  }

  // FIXME: Should have return type
  async checkUserExist(email: string) {
    // FIXME: Outer parenthesis are not required
    return (await this.af.fetchSignInMethodsForEmail(email));
  }
}
