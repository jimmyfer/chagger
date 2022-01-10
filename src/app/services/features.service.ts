import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { first } from 'rxjs/operators';
import { Feature } from '../models/feature.interface';
import { Workspace, WorkspaceFeatures } from '../models/workspace.interface';
import { FirestoreGenericService } from './firestore-generic.service';
import { ReleasesService } from './releases.service';
import { WorkspaceService } from './workspace.service';

const collectionPath = 'features';

@Injectable({
    providedIn: 'root',
})




/**
 * Service that handle features conections in the database.
 */
export class FeaturesService extends FirestoreGenericService<Feature> {

    /**
     * Constructor.
     * @param af  Angular helper of Firestore.
     * @param workspaceService Service to handle user workspaces collection in database.
     */
    constructor(af: AngularFirestore, private workspaceService: WorkspaceService, private releasesService: ReleasesService) {
        super(af);
    }

    /**
     * Create a new feature in the database.
     * @param worksapceId Workspace ID.
     * @param releaseId Release ID.
     * @param features Features array from a workspace document.
     */
    async addNewFeature(worksapceId: string, releaseId: string, features: Partial<Workspace>): Promise<void> {

        const feature = await this.createDocument({
            tag: 'Feauture',
            description: 'Features are important part of an aplication!',
            action: { type: '', link: '', options: { title: '', autoplay: false, muted: false, startOn: { hour: 0, minute: 0, second: 0 } } }
        }, '', `workspaces/${worksapceId}/${collectionPath}`  );
        features.features?.push({
            tag: 'Feauture',
            description: 'Features are important part of an aplication!',
            ref: this.af.doc(`workspaces/${worksapceId}/features/${feature.id}`).ref as DocumentReference
        });
        this.workspaceService.editWorkspaceFeature(worksapceId, features);
        this.releasesService.editReleaseFeature(worksapceId, releaseId, features);
    }

    /**
     * 
     */
    getFeature(featureRef: DocumentReference ): Promise<Feature> {
        const featurePath = `workspaces/${featureRef.path.split('/')[1]}/features`;
        return this.getDocument(featurePath, featureRef.id).pipe(
            first()
        ).toPromise();
    }
}
