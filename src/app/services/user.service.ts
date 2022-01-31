import {Injectable} from '@angular/core';
import {FirestoreGenericService} from './firestore-generic.service';

import {User, UserWorkspaces} from '../models/user.interface';
import {
    AngularFirestore,
    DocumentReference,
} from '@angular/fire/compat/firestore';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

const collectionPath = 'users';

@Injectable({
    providedIn: 'root',
})

/**
 * This is the serivice that handle users collection.
 */
export class UserService extends FirestoreGenericService<User> {
    //This variable is set when the workspaces$ observer is get at the workspace service.
    // TODO: Handle this with an observable
    email = '';

    //This variable is set when the workspaces$ observer is get at the workspace service.
    // TODO: Handle this with an observable
    userUid = '';

    user$ = this.afAuth.authState;

    /**
     * Constructor.
     * @param af  Angular helper of Firestore.
     * @param afAuth Service that handle auth conections.
     */
    constructor(af: AngularFirestore, private afAuth: AngularFireAuth) {
        super(af);
    }

    /**
     * Creates new users document in users collections.
     * @param data User Data.
     * @param id User uid.
     * @returns Return a document reference of the user in users collection.
     */
    async createUser(data: User): Promise<DocumentReference<User>> {
        return await this.createDocument(data, this.userUid, collectionPath);
    }

    /**
     * Get user wokrspaces.
     * @param userUid User UID.
     * @returns Return workspaces of an user in users collection.
     */
    getUserWorkspaces(userUid: string): Observable<UserWorkspaces[]> {
        console.log(this.userUid);
        return this.getDocument(collectionPath, userUid).pipe(
            map((user) => user.workspaces)
        );
    }

    /**
     * Get user workspaces one time.
     * @returns Return workspaces of an user in users collection.
     */
    async getUserWorkspacesOnce(): Promise<UserWorkspaces[]> {
        return await this.getFirestoreDocument(collectionPath, this.userUid)
            .get()
            .pipe(map((user) => user.get('workspaces')))
            .toPromise();
    }

    /**
     * Edit a workspace of a user.
     * @param workspaceData New workspace data to update.
     */
    async editUsersWorkspaces(workspaceData: Partial<User>): Promise<void> {
        await this.updateDocument(workspaceData, collectionPath, this.userUid);
    }
}
