import { DocumentReference } from "@angular/fire/compat/firestore";
import { FieldValue } from "firebase/firestore";

export interface Workspace {
    name?: string;
    workspaces?: userWorkspaces[] | FieldValue
    releases?: {version: string; id: DocumentReference}[]
}

interface version {
    version?: string
}

export interface userWorkspaces {
    id: DocumentReference;
    name: string;
}[]