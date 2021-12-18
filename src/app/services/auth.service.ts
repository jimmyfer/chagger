import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators'
import firebase from 'firebase/compat/app';

import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import auth = firebase.auth;
import { WorkspaceService } from './workspace.service';
import { UserService } from './user.service';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private router: Router,
        public afAuth: AngularFireAuth,
        private af: AngularFirestore,
        private workspaceService: WorkspaceService,
        private userService: UserService
    ) { }

    async signUpEmail(email: string, password: string): Promise<boolean> {
        let result
        try {
            result = await this.afAuth.createUserWithEmailAndPassword(email, password);
        } catch (e) {
            return false;
        }

        if (result.user) {
            let workspace;
            try {
                workspace = this.workspaceService.create({
                    name: result.user.email as string
                })
            } catch (e) {
                throw console.log(e)
            }
            try {
                this.userService.createUser({
                    email: result.user.email as string,
                    workspaces: [{ name: 'default', id: this.af.doc(`workspace/${(await workspace).id}`).ref as DocumentReference }]
                }, result.user.uid);
            } catch (e) {
                throw console.log(e)
            }
        }

        return await this.finishLogin(result);
    }

    async signInEmail(email: string, password: string): Promise<boolean> {
        let result;
        try {
            result = await this.afAuth.signInWithEmailAndPassword(email, password);
        } catch (e) {
            return false;
        }
        return await this.finishLogin(result);
    }

    async signOut(): Promise<void> {
        await this.afAuth.signOut();
        await this.router.navigate(['auth/login']);
    }

    async finishLogin(credentials: auth.UserCredential): Promise<boolean> {

        if (!credentials.user) {
            return false;
        }

        this.goToUserHome();
        return true;
    }

    async goToUserHome(): Promise<void> {
        // FIXME: The promise returned from navigate must be handled, in case of error and success
        await this.router.navigate(['/dashboard']);
    }

    async isLoggedIn(): Promise<boolean> {
        let isLogged;
        let authStateResp = await this.afAuth.authState.pipe(first()).toPromise();
        if(authStateResp) this.userService.userUid = authStateResp.uid;
        isLogged =  authStateResp ? true : false;
        return  isLogged;
    }

    async checkUserExist(email: string): Promise<string[]> {
        return await this.afAuth.fetchSignInMethodsForEmail(email);
    }
}