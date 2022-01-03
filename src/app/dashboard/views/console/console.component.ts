import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DocumentReference } from '@angular/fire/compat/firestore';
import {
    faCoffee,
    faFolder,
    faPlay,
    faPlus,
    faRocket,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { WorkspaceService } from 'src/app/services/workspace.service';

import { FormGroup, FormControl } from '@angular/forms';

import { Action } from 'src/app/models/action';

@Component({
    selector: 'app-console',
    templateUrl: './console.component.html',
    styleUrls: ['./console.component.scss'],
})

/**
 * Console Component
 */
export class ConsoleComponent implements OnInit {

    addActionIsVisible = false;
    releaseAction: Partial<Action> = {};

    releaseBarActive = false;
    featureBoardActive = false;

    activeRelease: { doc: DocumentReference; index: number } = {
        doc: {} as DocumentReference,
        index: 0,
    };

    @ViewChild('addWorkspaceInput', { static: false })
    addWorkspaceInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    workspaceName = new FormControl('');

    createWorkspace = new FormGroup({
        workspace: this.workspaceName,
    });

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

    addWorkspace = false;
    addWorkspaceWorking = false;
    workspacesWatcher: Subscription | undefined;

    activeWorkspace: DocumentReference = {} as DocumentReference;

    /**
     *
     * @param authService Service to handle auth conections.
     * @param userService Service to handle user collection in database.
     * @param workspaceService Service to handle user workspaces collection in database.
     */
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private workspaceService: WorkspaceService
    ) {}

    /**
     * ngOnInit that suscripbe to the user workspaces.
     */
    ngOnInit(): void {
        this.workspaceWatch();
    }

    /**
     * Show the release bar.
     * @param e Click event.
     */
    showReleaseBar(e: Event): void {
        e.preventDefault();
        this.releaseBarActive = true;
    }

    /**
     * Show the feature board.
     * @param activeRelease The active release.
     */
    showFeatureBoard(activeRelease: {
        doc: DocumentReference;
        index: number;
    }): void {
        this.featureBoardActive = false;
        setTimeout(() => {
            this.activeRelease = activeRelease;
            this.featureBoardActive = true;
        });
    }

    /**
     * Start watching the workspaces from user collection on database.
     */
    workspaceWatch(): void {
        this.workspacesWatcher = this.userService.getUserWorkspaces().subscribe(
            (resp) => {
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
            }
        );
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
        this.releaseBarActive = false;
        this.featureBoardActive = false;
        e.preventDefault();
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
     * Add a new workspace in Database.
     * @param workspaceName workspace name.
     */
    addNewWorkspace(workspaceName: string): void {
        const workspaces = this.consoleWorkspaces.slice();
        workspaces.forEach((workspace) => {
            delete workspace.toggle;
        });
        this.workspaceService.addNewWorkspace(
            { name: workspaceName, releases: [] },
            { workspaces: workspaces }
        );
    }

    /**
     * Create a new workspace in Database.
     * @param workspaceName workspace name.
     */
    async createNewWorkspace(workspaceName: string) {
        if (
            await this.workspaceService.createNewWorkspace({
                name: workspaceName,
                releases: [],
            })
        ) {
            this.workspacesWatcher?.unsubscribe();
            this.workspaceWatch();
            this.webLoading = false;
            this.workspaceExist = true;
        }
    }

    /**
     * Get the action object from add-action component.
     * @param data Action Object
     */
    getAction(data: Action): void {
        this.releaseAction = data;
        this.addActionIsVisible = false;
    }

    /**
     * Open the add-action component.
     */
    addAction(): void {
        this.addActionIsVisible = true;
    }

    /**
     * ngOnDestroy unsuscribe from currents suscriptions.
     */
    ngOnDestroy(): void {
        this.workspacesWatcher?.unsubscribe();
    }
}
