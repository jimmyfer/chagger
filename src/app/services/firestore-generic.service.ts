import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument,
    DocumentReference,
    QueryFn,
} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import FieldValue = firebase.firestore.FieldValue;
import firestore = firebase.firestore;
import { Observable } from 'rxjs';
import { finalize, map, shareReplay } from 'rxjs/operators';
import { DateTime } from 'luxon';
import { MaybeModeled, Modeled, Uploaded } from '../models/models';

const REST_TIME = 2000;
const REST_GRACE_TIME = 1000;

interface CachedConnection<T> {
    connection$: Observable<Modeled<T>>;
    timestamp: number;
}

@Injectable({
    providedIn: 'root',
})
export abstract class FirestoreGenericService<T> {
    constructor(protected af: AngularFirestore) {}

    protected CACHE_MAX_SIZE = 3;
    private queryIndex = 0;

    private readonly cache: Record<string, CachedConnection<T>> = {};

    lastUpdate: Record<string, number> = {};

    getFirestoreDocument(
        ...paths: string[]
    ): AngularFirestoreDocument<Uploaded<T>> {
        console.log(...paths, 'paths!!!');
        if (paths.length % 2 === 1) {
            throw 'Document reference must have an even number of paths';
        }
        return this.af.doc<Uploaded<T>>(paths.join('/'));
    }

    protected getFirestoreCollection(
        queryFn?: QueryFn<Uploaded<T>>,
        ...paths: string[]
    ): AngularFirestoreCollection<Uploaded<T>> {
        return this.getFirestoreCollectionQuery(queryFn, ...paths);
    }

    protected getFirestoreCollectionQuery(
        queryFn?: QueryFn<Uploaded<T>>,
        ...paths: string[]
    ): AngularFirestoreCollection<Uploaded<T>> {
        console.log(paths, paths.length, 'paths!!!-!')
        if (paths.length % 2 === 0) {
            console.log('yup! what u fear!')
            throw 'Document reference must have an odd number of paths';
        }
        return this.af.collection(
            paths.join('/'),
            queryFn as QueryFn | undefined
        );
    }

    private prepareDocForUpload<TM>(d: MaybeModeled<TM>): Uploaded<TM> {
        const partial: any = { ...d };
        let creation: any = partial._creationTime;
        if (
            !creation ||
            (typeof creation !== 'number' && !(creation instanceof FieldValue))
        ) {
            creation = FieldValue.serverTimestamp();
        }
        partial._creationTime = creation;
        partial._lastUpdate = FieldValue.serverTimestamp();
        delete partial._docId;

        // const undefinedKey = this.assertNotUndefined(d);
        // if (undefinedKey) {
        //     throw new AppError(`Key with name ${undefinedKey} has undefined value`);
        // }
        return partial as Uploaded<TM>;
    }

    private prepareCacheForNewData(): boolean {
        const entries = Object.entries(this.cache);
        if (entries.length < this.CACHE_MAX_SIZE) {
            return false;
        }

        const oldLength = entries.length;
        entries
            .sort((a, b) => a[1].timestamp - b[1].timestamp)
            .slice(this.CACHE_MAX_SIZE - 1)
            .map((entry) => entry[0])
            .forEach((key) => {
                delete this.cache[key];
            });
        console.log(
            'DB:CACHE',
            `reduced cache from ${oldLength} to ${Object.entries(this.cache)}`
        );
        return true;
    }
    protected createDocumentMerge(
        data: MaybeModeled<T>,
        id?: string,
        ...collectionPath: string[]
    ): Promise<DocumentReference<Uploaded<T>>> {
        console.log('DB', 'create-merge', collectionPath, id);
        const ready = this.prepareDocForUpload(data);
        if (id) {
            const doc = this.getFirestoreDocument(...collectionPath, id);
            return doc
                .set(ready, { merge: true })
                .then(() => doc.ref as DocumentReference<Uploaded<T>>)
                .catch((e) => {
                    console.log('DB', 'create-merge', [...collectionPath, id]);
                    throw e;
                });
        } else {
            return this.getFirestoreCollection(undefined, ...collectionPath)
                .add(ready)
                .then((doc) => doc as DocumentReference<Uploaded<T>>)
                .catch((e) => {
                    console.log('DB', 'create-merge', [...collectionPath, id]);
                    throw e;
                });
        }
    }
    createDocument(
        data: MaybeModeled<T>,
        id: string,
        ...collectionPath: string[]
    ) {
        console.log('DB', 'Create', [...collectionPath, id], data);
        const ready = this.prepareDocForUpload(data);
        delete data._docId;
        if (id) {
            const doc = this.getFirestoreDocument(...collectionPath, id);
            return doc
                .set(ready, { merge: false })
                .then(() => doc.ref)
                .catch((e) => {
                    console.log('DB', 'create-merge', [...collectionPath, id]);
                    throw e;
                });
        } else {
            return this.getFirestoreCollection(undefined, ...collectionPath)
                .add(ready)
                .then((doc) => doc)
                .catch((e) => {
                    console.log('DB', 'create-merge', [...collectionPath, id]);
                    throw e;
                });
        }
    }

    protected getDocument(...paths: string[]): Observable<Modeled<T>> {
        const cacheKey = paths.join('/');
        let cached = this.cache[cacheKey];
        if (!cached) {
            const doc = this.getFirestoreDocument(...paths);
            this.prepareCacheForNewData();

            cached = this.cache[cacheKey] = {
                connection$: doc.snapshotChanges().pipe(
                    map((snap) => {
                        if (!snap.payload.exists) {
                            throw 'NOT FOUND!';
                        }
                        const data: Modeled<T> =
                            snap.payload.data() as Modeled<T>;
                        data._docId = doc.ref.id;
                        console.log('DB:NEW-DATA', 'get', paths.join('/'));
                        return data;
                    }),
                    finalize(() =>
                        console.log('DB:DISCONNECTED', 'get', paths.join('/'))
                    ),
                    shareReplay({ refCount: true })
                ),
                timestamp: DateTime.now().toMillis(),
            };
            console.log('DB:CONNECTED', 'get', paths.join('/'));
        }
        return cached.connection$;
    }

    protected existsDocument(...paths: string[]): Observable<boolean> {
        return this.getFirestoreDocument(...paths)
            .snapshotChanges()
            .pipe(map((snap) => snap.payload.exists));
    }

    protected getAllDocuments(
        queryFn?: QueryFn<Uploaded<T>>,
        ...paths: string[]
    ): Observable<Modeled<T>[]> {
        /**
         * @returns Observable for a list of filtered documents from the referenced collection
         */
        const index = this.queryIndex++;
        console.log(`DB:CONNECTED`, `query:${index}`, paths.join('/'));
        return this.getFirestoreCollection(queryFn, ...paths)
            .valueChanges({ idField: '_docId' })
            .pipe(
                map((s) => s),
                finalize(() =>
                    console.log(
                        'DB:DISCONNECTED',
                        `query:${index}`,
                        paths.join('/')
                    )
                )
            );
    }

    private wait(ms: number): Promise<void> {
        ms = Math.max(ms, 0);
        return new Promise((res) => {
            setTimeout(() => res(), ms);
        });
    }

    private async waitBeforeUpdate(...paths: string[]): Promise<void> {
        const now = DateTime.now().toUTC().toMillis();
        const path = paths.join('/');
        const lastUpdate = this.lastUpdate[path] ?? 0;

        const nextUpdate = lastUpdate + REST_TIME + REST_GRACE_TIME;
        this.lastUpdate[path] = Math.max(nextUpdate, now);

        if (nextUpdate - now > 0) {
            console.log(
                'DB',
                `waiting ${
                    (nextUpdate - now) / 1000
                } [s] before updating ${path}`
            );
        }
        await this.wait(nextUpdate - now);
    }

    protected async updateDocument(
        data: Partial<T>,
        ...paths: string[]
    ): Promise<void> {
        const ready: Uploaded<T> = this.prepareDocForUpload(data) as any;

        await this.waitBeforeUpdate(...paths);
        console.log('DB', 'update', paths.join('/'), data);
        return await this.getFirestoreDocument(...paths)
            .update(ready)
            .catch((e) => {
                console.log('DB', 'create-merge', paths.join('/'));
                throw e;
            });
    }
}
