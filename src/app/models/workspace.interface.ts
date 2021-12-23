import { DocumentReference } from '@angular/fire/compat/firestore';
import { FieldValue } from 'firebase/firestore';

export interface Workspace {
    name: string;
    releases: {version: string; id: DocumentReference}[]
}