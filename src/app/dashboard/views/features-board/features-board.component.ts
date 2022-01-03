import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
    faPlay,
    faPlus,
    faRocket,
    faEdit,
} from '@fortawesome/free-solid-svg-icons';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { ReleasesService } from 'src/app/services/releases.service';
import { Releases } from 'src/app/models/releases.interface';
import { Subscription } from 'rxjs';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Action } from 'src/app/models/action';

@Component({
    selector: 'app-features-board',
    templateUrl: './features-board.component.html',
    styleUrls: ['./features-board.component.scss'],
})

/**
 *
 */
export class FeaturesBoardComponent implements OnInit {

    @Output() callAddAction = new EventEmitter<boolean>();

    @Input() activeWorkspace: DocumentReference = {} as DocumentReference;

    @Input() releaseAction: Partial<Action> = {};

    @ViewChild('editReleaseVersionInput', { static: false })
    editReleaseVersionInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    actionPlay = faPlay;
    releasesVersion = faRocket;
    addCommit = faPlus;
    editReleaseVersionTitle = faEdit;

    checkEditReleaseVersion = false;
    editReleaseWorking = false;

    @Input() activeRelease: { doc: DocumentReference; index: number } = {
        doc: {} as DocumentReference,
        index: 0,
    };
    consoleReleases: { version: string; id: DocumentReference }[] = [];
    releaseWatcher: Subscription | undefined;

    release: Releases = { version: '', description: '', action: {} };
    oldReleaseVersion = '';

    textareaCharacter = '';

    /**
     * Constructor.
     */
    constructor(
        private releaseService: ReleasesService,
        private workspaceService: WorkspaceService
    ) {}

    /**
     * Angular NgOnInit.
     */
    ngOnInit(): void {
        this.releaseWatcher?.unsubscribe();
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

        this.release.version =
            this.consoleReleases[this.activeRelease.index].version;

        this.releaseService
            .getRelease(this.activeRelease.doc)
            .then((release) => {
                this.release.description = release.description;
                this.textareaCharacter = release.description;
            });
    }

    /**
     * Release title toggler from text to input and edit the release version.
     * @param e Click, Focus and Enter Key event handler.
     */
    editReleaseVersion(e: Event): void {
        e.preventDefault();
        switch (e.type) {
            case 'click':
                this.checkEditReleaseVersion = true;
                setTimeout(() => {
                    this.editReleaseVersionInput.nativeElement.focus();
                });
                break;
            case 'blur':
                if (!this.editReleaseWorking) {
                    this.checkEditReleaseVersion = false;
                    this.oldReleaseVersion = this.release.version;
                    this.release.version =
                        this.editReleaseVersionInput.nativeElement.value;
                }
                this.editReleaseWorking = false;
                break;
            case 'keyup':
                this.checkEditReleaseVersion = false;
                this.editReleaseWorking = true;
                this.oldReleaseVersion = this.release.version;
                this.release.version =
                    this.editReleaseVersionInput.nativeElement.value;
                break;
        }
    }

    /**
     * Update the release.
     */
    updateRelease(): void {
        this.releaseService.updateRelease(
            this.release.version,
            this.activeRelease.doc.path,
            this.activeWorkspace.id,
            this.oldReleaseVersion,
            { releases: this.consoleReleases },
            this.textareaCharacter,
            this.releaseAction
        );
    }

    /**
     * Update the release on the feature board.
     */
    updateFeaturesBoard(): void {
        this.release.version =
            this.consoleReleases[this.activeRelease.index].version;
    }

    /**
     * Call add-action component.
     * @param e Click event.
     */
    addAction( e: Event ): void {
        e.preventDefault();
        this.callAddAction.emit(true);
    }
}
