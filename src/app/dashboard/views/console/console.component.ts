import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DocumentReference } from '@angular/fire/compat/firestore';
import {
    faCoffee,
    faFolder,
    faPlay,
    faPlus,
    faRocket
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ReleasesService } from 'src/app/services/releases.service';
import { UserService } from 'src/app/services/user.service';
import { WorkspaceService } from 'src/app/services/workspace.service';

import { FormGroup, FormControl } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';
import { hasLifecycleHook } from '@angular/compiler/src/lifecycle_reflector';

@Component({
    selector: 'app-console',
    templateUrl: './console.component.html',
    styleUrls: ['./console.component.scss'],
})


/**
 * Console Component
 */
export class ConsoleComponent implements OnInit {
    @ViewChild('addWorkspaceInput', { static: false })
    addWorkspaceInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    @ViewChild('addReleaseInput', { static: false })
    addReleaseInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    @ViewChild('editReleaseVersionInput', {static: false})
    editReleaseVersionInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    addActionIsVisible = false;

    workspaceName = new FormControl('');

    createWorkspace = new FormGroup({
        workspace: this.workspaceName
    })

    workspaceExist = false;
    webLoading = true;

    testIcon = faCoffee;
    releaseFolder = faFolder;
    actionPlay = faPlay;
    releasesVersion = faRocket;
    addCommit = faPlus;

    consoleWorkspaces: {
        name: string;
        id: DocumentReference;
        toggle?: boolean;
    }[] = [];
    consoleReleases: { version: string; id: DocumentReference; }[] = [];
    releaseWatcher: Subscription | undefined;

    editRelease: boolean[] = [];
    editReleaseWorking = false;

    addWorkspace = false;
    addWorkspaceWorking = false;
    workspacesWatcher: Subscription | undefined;

    addRelease = false;
    addReleaseWorking = false;
    releaseBarActive = false;
    activeWorkspace: DocumentReference = {} as DocumentReference;

    /**
     * 
     * @param authService Service to handle auth conections.
     * @param userService Service to handle user collection in database.
     * @param workspaceService Service to handle user workspaces collection in database.
     * @param releaseService Service to handle user releases collection in database.
     * @param confirmationService Service to handle confirmations messages.
     */
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private workspaceService: WorkspaceService,
        private releaseService: ReleasesService,
        private confirmationService: ConfirmationService
    ) {}

    /**
     * ngOnInit that suscripbe to the user workspaces.
     */
    ngOnInit(): void {
        this.workspaceWatch();
    }

    /**
     * Start watching the workspaces from user collection on database.
     */
    workspaceWatch(): void {
        this.workspacesWatcher = this.userService
            .getUserWorkspaces()
            .subscribe((resp) => {
                this.webLoading = false;
                this.workspaceExist = true;
                this.consoleWorkspaces = [];
                resp.workspaces.forEach((workspace) => {
                    this.consoleWorkspaces.push({
                        name: workspace.name,
                        id: workspace.id,
                        toggle: false,
                    });
                });
            },
            (err) => {
                switch (err) {
                    case 'NOT FOUND!':
                        this.webLoading = false;
                        this.workspaceExist = false;
                        break;
                
                    default:
                        throw err;
                }
            });
    }

    /**
     * Close account session.
     */
    onLogOut(): void {
        try {
            this.authService.signOut();
        } catch {
            throw 'Failed navigating to login page';
        }
    }

    /**
     * Workspaces bar toggler
     * @param workspaceIndex workspace index.
     * @param e Click event handler.
     */
    workspaceClick(workspaceIndex: number, e: Event): void {
        e.preventDefault();
        this.releaseBarActive = false;
        this.consoleWorkspaces.forEach((workspaces, index) => {
            if (index != workspaceIndex) workspaces.toggle = false;
        });
        this.consoleWorkspaces[workspaceIndex].toggle =
            !this.consoleWorkspaces[workspaceIndex].toggle;
        this.activeWorkspace = this.consoleWorkspaces[workspaceIndex].id;
    }

    /**
     * New workspace interface toggler from link to input and vice versa.
     * @param e Click, Focus and Enter Key handler.
     */
    newWorkspace(e: Event): void {
        e.preventDefault();
        switch (e.type) {
            case 'click':
                this.addWorkspace = true;
                setTimeout(() => {
                    this.addWorkspaceInput.nativeElement.focus();
                });
                break;
            case 'blur':
                if (!this.addWorkspaceWorking) {
                    this.addWorkspace = false;
                    this.addNewWorkspace(
                        this.addWorkspaceInput.nativeElement.value
                    );
                }
                this.addWorkspaceWorking = false;
                break;
            case 'keyup':
                this.addWorkspace = false;
                this.addWorkspaceWorking = true;
                this.addNewWorkspace(
                    this.addWorkspaceInput.nativeElement.value
                );
                break;
        }
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
     * Add a new workspace in Database.
     * @param workspaceName workspace name.
     */
    addNewWorkspace(workspaceName: string): void {
        const workspaces = this.consoleWorkspaces.slice();
        workspaces.forEach(workspace => {
            delete workspace.toggle;
        });
        this.workspaceService.addNewWorkspace(
            { name: workspaceName, releases: [] },
            {workspaces: workspaces}
        );
    }

    /**
     * Create a new workspace in Database.
     * @param workspaceName workspace name.
     */
    async createNewWorkspace(workspaceName: string) {
        if(await this.workspaceService.createNewWorkspace({ name: workspaceName, releases: [] })) {
            this.workspacesWatcher?.unsubscribe();
            this.workspaceWatch();
            this.webLoading = false;
            this.workspaceExist = true;
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
            {releases: this.consoleReleases}
        );
    }

    /**
     * Active the release bar for the current workspace and suscribe to those relases.
     * @param e Click event handler.
     */
    releaseBar(e: Event): void {
        e.preventDefault();
        this.releaseWatcher?.unsubscribe();
        this.releaseBarActive = true;
        this.releaseWatcher = this.workspaceService
            .getWorkspaceReleases(this.activeWorkspace.id)
            .subscribe((releases) => {
                this.consoleReleases = [];
                releases.releases?.forEach((release) => {
                    this.consoleReleases.push({ version: release.version, id: release.id });
                });
            });
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
                this.updateReleaseVersion(this.editReleaseVersionInput.nativeElement.value, this.consoleReleases[releaseIndex].id, this.consoleReleases[releaseIndex].version);
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
                this.releaseService.deleteRelease(this.consoleReleases[releaseIndex].id.path, this.activeWorkspace.id, {releases: this.consoleReleases}, this.consoleReleases[releaseIndex].version);
            }
        });
    }

    /**
     * Update the selected release.
     * @param newVersion New release version.
     * @param releaseId Release document reference in the database.
     * @param actualVersion Actual release version.
     */
    updateReleaseVersion(newVersion: string, releaseId: DocumentReference, actualVersion: string): void {
        this.releaseService.updateReleaseVersion(newVersion, releaseId.path, this.activeWorkspace.id, actualVersion, {releases: this.consoleReleases});
    }

    /**
     * Check if the user logged has any workspace.
     */
    checkIfExistUserWorkspace() {
    }

    /**
     * Open the add-action component.
     */
    addAction(): void {
        this.addActionIsVisible = true;
    }

    getAction(data: any): void {
        console.log(data);
        this.addActionIsVisible = false;
    }

    /**
     * ngOnDestroy unsuscribe from currents suscriptions.
     */
    ngOnDestroy(): void {
        this.workspacesWatcher?.unsubscribe();
        this.releaseWatcher?.unsubscribe();
    }
}