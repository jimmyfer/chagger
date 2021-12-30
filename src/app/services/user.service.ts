import { Injectable } from '@angular/core';
import { FirestoreGenericService } from './firestore-generic.service';

import { User } from '../models/user.interface';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

const collectionPath = 'users';

@Injectable({
    providedIn: 'root'
})

/**
 * This is the serivice that handle users collection.
 */
export class UserService extends FirestoreGenericService<User>{

  userUid = '';
  email = '';

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
   * @returns Return workspaces of an user in users collection.
   */
  getUserWorkspaces(): Observable<User> {
      return this.getDocument(collectionPath, this.userUid);
  }

  /**
   * Edit a workspace of a user.
   * @param workspaceData New workspace data to update.
   */
  editUsersWorkspaces(workspaceData: Partial<User>): void {
      this.updateDocument(workspaceData, collectionPath, this.userUid);
  }

}