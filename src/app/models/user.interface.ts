import { DocumentReference } from '@angular/fire/compat/firestore';
import { FieldValue } from 'firebase/firestore';


export interface User {
    email: string;
    workspaces: UserWorkspaces[];
}

export interface UserWorkspaces {
    name: string;
    ref: DocumentReference;
}