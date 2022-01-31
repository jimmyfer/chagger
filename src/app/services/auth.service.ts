import {Injectable} from '@angular/core';
import {first} from 'rxjs/operators';
import firebase from 'firebase/compat/app';

import {Router} from '@angular/router';

import {AngularFireAuth} from '@angular/fire/compat/auth';
import auth = firebase.auth;
import {WorkspaceService} from './workspace.service';
import {UserService} from './user.service';
import {AngularFirestore, DocumentReference} from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})

/**
 * This is the service that handle auth conections.
 */
export class AuthService {


    user$ = this.afAuth.authState;

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
    ) {
    }

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
            let workspace: DocumentReference;
            try {
                workspace = await this.workspaceService.create({
                    name: result.user.email as string,
                    releases: [],
                    tags: [],
                    features: []
                });
            } catch (e) {
                throw new Error('Error triying to create a workspace.');
            }
            try {
                await this.userService.createUser({
                    email: result.user.email as string,
                    workspaces: [{
                        name: 'default',
                        ref: this.af.doc(`workspaces/${workspace.id}`).ref as DocumentReference
                    }]
                });
            } catch (e) {
                throw new Error('Error triying to create a user account.');
            }
        }

        return await this.finishLogin(result);
    }

    /**
     * Login with an email given.
     * @param email User email account.
     * @param password User password.
     * @returns Return boolean if success or not.
     */
    async signInEmail(email: string, password: string): Promise<boolean> {
        try {
            return await this.afAuth.signInWithEmailAndPassword(email, password).then(state => {
                return this.finishLogin(state);
            });
        } catch {
            return false;
        }
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

        await this.goToUserHome();
        return true;
    }

    /**
     * Redirect the user to dashboard.
     */
    async goToUserHome(): Promise<void> {
        try {
            await this.router.navigate(['/workspaces']);
        } catch {
            throw new Error('No se ha podido alcanzar el dashboard, intentalo de nuevo.');
        }
    }

    /**
     * Check if user is logged in.
     * @returns Return boolean if user is logged in or not.
     */
    async isLoggedIn(): Promise<boolean> {
        const authStateResp = await this.afAuth.authState.pipe(first()).toPromise();
        const isLogged = !!authStateResp;
        return isLogged;
    }

    /**
     * Check if user exist.
     * @param email User email.
     * @returns Return a boolean if email exist or not.
     */
    async checkUserExist(email: string): Promise<boolean> {
        return await this.afAuth.fetchSignInMethodsForEmail(email).then(resp => {
            if(resp.length) {
                return true;
            } else {
                return false;
            }
        });
    }
}
