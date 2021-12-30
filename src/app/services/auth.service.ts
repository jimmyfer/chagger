import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
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

/**
 * This is the service that handle auth conections.
 */
export class AuthService {

    /**
     * Constructor.
     * @param router Angular Router.
     * @param afAuth Angular helper of FireAuth.
     * @param af Angular helper of Firestore.
     * @param workspaceService Service to handle user workspaces collection in database.
     * @param userService Service to handle user collection in database.
     */
    constructor(
        private router: Router,
        public afAuth: AngularFireAuth,
        private af: AngularFirestore,
        private workspaceService: WorkspaceService,
        private userService: UserService
    ) { }

    /**
     * Create a new user with an email given.
     * @param email New user email.
     * @param password  New user password.
     * @returns Return boolean if singup is sucess or not.
     */
    async signUpEmail(email: string, password: string): Promise<boolean> {
        let result;
        try {
            result = await this.afAuth.createUserWithEmailAndPassword(email, password);
        } catch (e) {
            return false;
        }

        if (result.user) {
            let workspace;
            try {
                workspace = this.workspaceService.create({
                    name: result.user.email as string,
                    releases: []
                });
            } catch (e) {
                throw console.log(e);
            }
            try {
                this.userService.createUser({
                    email: result.user.email as string,
                    workspaces: [{ name: 'default', id: this.af.doc(`workspace/${(await workspace).id}`).ref as DocumentReference }]
                });
            } catch (e) {
                throw console.log(e);
            }
        }

        return await this.finishLogin(result);
    }

    /**
     * Login with an email given.
     * @param email User email account.
     * @param password User password.
     * @returns Return boolan if sucess or not.
     */
    async signInEmail(email: string, password: string): Promise<boolean> {
        let result;
        try {
            result = await this.afAuth.signInWithEmailAndPassword(email, password);
        } catch (e) {
            return false;
        }
        return await this.finishLogin(result);
    }

    /**
     * Signout of the aplication.
     * @returns Return boolean if sucess or not.
     */
    async signOut(): Promise<boolean> {
        await this.afAuth.signOut();
        return await this.router.navigate(['auth/login']);
    }

    /**
     * An function to validate if user signup or signin correctly.
     * @param credentials User credentials.
     * @returns Return boolean if sucess or not.
     */
    async finishLogin(credentials: auth.UserCredential): Promise<boolean> {

        if (!credentials.user) {
            return false;
        }

        this.goToUserHome();
        return true;
    }

    /**
     * Redirect the user to dashboard.
     */
    async goToUserHome(): Promise<void> {
        try {
            await this.router.navigate(['/dashboard']);
        } catch {
            throw('No se ha podido alcanzar el dashboard, intentalo de nuevo.');
        }
    }

    /**
     * Check if user is logged in.
     * @returns Return boolean if user is logged in or not.
     */
    async isLoggedIn(): Promise<boolean> {
        const authStateResp = await this.afAuth.authState.pipe(first()).toPromise();
        if(authStateResp) {
            this.userService.userUid = authStateResp.uid;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.userService.email = authStateResp.email!;
        }
        const isLogged =  authStateResp ? true : false;
        return  isLogged;
    }

    /**
     * Check if user exist.
     * @param email User email.
     * @returns Return an array with text data that validate if user exist.
     */
    async checkUserExist(email: string): Promise<string[]> {
        return await this.afAuth.fetchSignInMethodsForEmail(email);
    }
}