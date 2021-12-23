import { DocumentReference } from '@angular/fire/compat/firestore';
import { FieldValue } from 'firebase/firestore';


export interface User {
    email: string
    workspaces: {name: string, id: DocumentReference}[]
}