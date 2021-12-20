import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DocumentReference } from '@angular/fire/compat/firestore';
import {
    faCoffee,
    faFolder,
    faPlay,
    faPlus,
    faRocket,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ReleasesService } from 'src/app/services/releases.service';
import { UserService } from 'src/app/services/user.service';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
    selector: 'app-console',
    templateUrl: './console.component.html',
    styleUrls: ['./console.component.scss'],
})
export class ConsoleComponent implements OnInit {
    @ViewChild('addWorkspaceInput', { static: false })
    addWorkspaceInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    @ViewChild('addReleaseInput', { static: false })
    addReleaseInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    @ViewChild('editReleaseVersionInput', {static: false})
    editReleaseVersionInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    // FIXME: Should be removed
    public isLogged = false;

    // FIXME: Should be removed (and "any" types should be avoided at all costs)
    user: any;

    // For the icons, the variables could be named by
    // their usage in the logic, and not what their "shape" is. This way,
    // we split the "logic" of the icons from the "visual" part.
    faCoffee = faCoffee;
    faUser = faUser;
    faFolder = faFolder;
    faPlay = faPlay;
    faRocket = faRocket;
    faPlus = faPlus;

    consoleWorkspaces: {
        name: string;
        id: DocumentReference;
        toggle: boolean;
    }[] = [];
    consoleReleases: { version: string; id: DocumentReference; }[] = [];
    releaseWatcher: Subscription | undefined;

    editRelease: boolean[] = [];
    editReleaseWorking: boolean = false;

    addWorkspace: boolean = false;
    addWorkspaceWorking: boolean = false;
    workspacesWatcher: Subscription | undefined;

    addRelease: boolean = false;
    addReleaseWorking: boolean = false;
    releaseBarActive: boolean = false;
    activeWorkspace: DocumentReference = {} as DocumentReference;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private workspaceService: WorkspaceService,
        private releaseService: ReleasesService
    ) {}

    ngOnInit(): void {
        this.workspacesWatcher = this.userService
            .getUserWorkspaces()
            .subscribe((resp) => {
                this.consoleWorkspaces = [];
                resp.workspaces.forEach((workspace) => {
                    this.consoleWorkspaces.push({
                        name: workspace.name,
                        id: workspace.id,
                        toggle: false,
                    });
                });
            });
    }

    onLogOut(): void {
        try {
            this.authService.signOut();
        } catch {
            throw 'Failed navigating to login page';
        }
    }

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

    addNewWorkspace(workspaceName: string): void {
        this.workspaceService.addNewWorkspace(
            { name: workspaceName },
            this.userService.userUid
        );
    }

    addNewRelease(releaseVersion: string): void {
        this.releaseService.addNewRelease(
            { version: releaseVersion },
            this.activeWorkspace.id
        );
    }

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

    editReleaseVersion(e: Event, i: number): void {
        e.preventDefault();
        switch (e.type) {
            case 'click':
                this.editRelease[i] = true;
                setTimeout(() => {
                    this.editReleaseVersionInput.nativeElement.focus();
                });
                break;
            case 'blur':
                if (!this.editReleaseWorking) {
                    this.editRelease[i] = false;
                    this.updateReleaseVersion(
                        this.editReleaseVersionInput.nativeElement.value,
                        this.consoleReleases[i].id,
                        this.consoleReleases[i].version
                    );
                }
                this.editReleaseWorking = false;
                break;
            case 'keyup':
                this.editRelease[i] = false;
                this.editReleaseWorking = true;
                this.updateReleaseVersion(this.editReleaseVersionInput.nativeElement.value, this.consoleReleases[i].id, this.consoleReleases[i].version);
                break;
        }
    }

    updateReleaseVersion(newVersion: string, releaseId: DocumentReference, actualVersion: string): void {
        this.releaseService.updateRelease(newVersion, releaseId.path, this.activeWorkspace.id, actualVersion, this.consoleReleases);
    }

    ngOnDestroy(): void {
        this.workspacesWatcher?.unsubscribe();
        this.releaseWatcher?.unsubscribe();
    }
}
