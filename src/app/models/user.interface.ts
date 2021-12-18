import { DocumentReference } from "@angular/fire/compat/firestore";


export interface User {
    email: string
    workspaces: {name: string, id: DocumentReference}[]
}