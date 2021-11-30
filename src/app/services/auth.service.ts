import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators'
import firebase from 'firebase/compat/app';

import {Router} from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
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
    }
    catch (e: any) {
        console.log(e.code);
        return false;
    }

    return await this.finishLogin(result);
  }

  async signInEmail( email: string, password: string ):  Promise<boolean> {
    let result;
    try {
        result = await this.af.signInWithEmailAndPassword(email, password);
      }
      catch (e) {
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
        console.log('Sign in failed');
        return false;
    }

    this.goToUserHome();
    return true;
  }

  goToUserHome(): void {
      this.router.navigate(['/dashboard']);
  }

  async isLoggedIn() {
    return this.af.authState.pipe(first()).toPromise();
  }

  async checkUserExist(email: string) {
    return (await this.af.fetchSignInMethodsForEmail(email));
  }
}