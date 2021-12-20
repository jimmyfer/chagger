import { DocumentReference } from "@angular/fire/compat/firestore";
import { FieldValue } from "@angular/fire/firestore";

export interface Releases {
    releases?: FieldValue | {version: string, id: DocumentReference}[];
    version?: string;
    description?: string;
    id?: DocumentReference;
}