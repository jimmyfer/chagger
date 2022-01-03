import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ReleasesService } from 'src/app/services/releases.service';
import { DocumentReference } from '@angular/fire/compat/firestore';
import {
    faRocket
} from '@fortawesome/free-solid-svg-icons';

import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
    selector: 'app-releases-board',
    templateUrl: './releases-board.component.html',
    styleUrls: ['./releases-board.component.scss'],
})

/**
 *
 */
export class ReleasesBoardComponent implements OnInit {

    @Input() activeWorkspace: DocumentReference = {} as DocumentReference;;

    @ViewChild('addReleaseInput', { static: false })
    addReleaseInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    @ViewChild('editReleaseVersionInput', { static: false })
    editReleaseVersionInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    releasesVersion = faRocket;

    releaseBarActive = false;

    consoleReleases: { version: string; id: DocumentReference }[] = [];
    releaseWatcher: Subscription | undefined;

    editRelease: boolean[] = [];
    editReleaseWorking = false;

    addRelease = false;
    addReleaseWorking = false;

    /**
     * 
     * @param releaseService Service to handle user releases collection in database.
     * @param workspaceService Service to handle user workspaces collection in database.
     * @param confirmationService Service to handle confirmations messages.
     */
    constructor(
        private releaseService: ReleasesService,
        private workspaceService: WorkspaceService,
        private confirmationService: ConfirmationService
    ) {}

    /**
     * 
     */
    ngOnInit(): void {
        this.releaseWatcher?.unsubscribe();
        this.releaseBarActive = true;
        this.releaseWatcher = this.workspaceService
            .getWorkspaceReleases(this.activeWorkspace.id)
            .subscribe((releases) => {
                this.consoleReleases = [];
                releases.releases?.forEach((release) => {
                    this.consoleReleases.push({
                        version: release.version,
                        id: release.id,
                    });
                });
            });
    }

    /**
     * New release interface toggler from link to input and vice versa.
     * @param e Click, Focus and Enter Key event handler.
     */
    newRelease(e: Event): void {
        e.preventDefault();
        switch (e.type) {
            case 'click':
                this.addRelease = true;
                setTimeout(() => {
                    this.addReleaseInput.nativeElement.focus();
                });
                break;
            case 'blur':
                if (!this.addReleaseWorking) {
                    this.addRelease = false;
                    this.addNewRelease(
                        this.addReleaseInput.nativeElement.value
                    );
                }
                this.addReleaseWorking = false;
                break;
            case 'keyup':
                this.addRelease = false;
                this.addReleaseWorking = true;
                this.addNewRelease(this.addReleaseInput.nativeElement.value);
                break;
        }
    }

    /**
     * Add new release to Database.
     * @param releaseVersion relase version.
     */
    addNewRelease(releaseVersion: string): void {
        this.releaseService.addNewRelease(
            { version: releaseVersion, description: '' },
            this.activeWorkspace.id,
            { releases: this.consoleReleases }
        );
    }

    /**
     * Release title toggler from text to input and edit the release version.
     * @param e Click, Focus and Enter Key event handler.
     * @param releaseIndex Release index.
     */
    editReleaseVersion(e: Event, releaseIndex: number): void {
        e.preventDefault();
        switch (e.type) {
            case 'click':
                this.editRelease[releaseIndex] = true;
                setTimeout(() => {
                    this.editReleaseVersionInput.nativeElement.focus();
                });
                break;
            case 'blur':
                if (!this.editReleaseWorking) {
                    this.editRelease[releaseIndex] = false;
                    this.updateReleaseVersion(
                        this.editReleaseVersionInput.nativeElement.value,
                        this.consoleReleases[releaseIndex].id,
                        this.consoleReleases[releaseIndex].version
                    );
                }
                this.editReleaseWorking = false;
                break;
            case 'keyup':
                this.editRelease[releaseIndex] = false;
                this.editReleaseWorking = true;
                this.updateReleaseVersion(
                    this.editReleaseVersionInput.nativeElement.value,
                    this.consoleReleases[releaseIndex].id,
                    this.consoleReleases[releaseIndex].version
                );
                break;
        }
    }

    /**
     * Detele the selected release.
     * @param e Click event handler.
     * @param releaseIndex release index.
     */
    deleteRelease(e: Event, releaseIndex: number) {
        e.preventDefault();
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this release?',
            accept: () => {
                this.releaseService.deleteRelease(
                    this.consoleReleases[releaseIndex].id.path,
                    this.activeWorkspace.id,
                    { releases: this.consoleReleases },
                    this.consoleReleases[releaseIndex].version
                );
            },
        });
    }

    /**
     * Update the selected release.
     * @param newVersion New release version.
     * @param releaseId Release document reference in the database.
     * @param actualVersion Actual release version.
     */
    updateReleaseVersion(
        newVersion: string,
        releaseId: DocumentReference,
        actualVersion: string
    ): void {
        this.releaseService.updateReleaseVersion(
            newVersion,
            releaseId.path,
            this.activeWorkspace.id,
            actualVersion,
            { releases: this.consoleReleases }
        );
    }

    /**
     * ngOnDestroy unsuscribe from currents suscriptions.
     */
    ngOnDestroy(): void {
        this.releaseWatcher?.unsubscribe();
    }
}
