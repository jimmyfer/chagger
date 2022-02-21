import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { WorkspaceService } from 'src/app/services/workspace.service';

import { FormGroup, FormControl } from '@angular/forms';

import { Action } from 'src/app/models/action';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddActionService } from 'src/app/services/add-action.service';
import { VideoPlayerService } from 'src/app/services/video-player.service';
import { AddFeatureService } from '../../services/add-feature.service';

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

    @ViewChild('addWorkspaceInput', { static: false })
    addWorkspaceInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    workspaceExist = false;
    webLoading = true;

    workspaces = this.workspaceService.workspaces$;

    activeWorkspaceIndex: number | null = null;
    activeWorkspace = false;

    addWorkspace = false;
    addWorkspaceWorking = false;

    workspaceName = new FormControl('');

    createWorkspace = new FormGroup({
        workspace: this.workspaceName,
    });

    workspaceExistChecker: Subscription = {} as Subscription;

    releaseFolder = faFolder;

    /**
     * Get the actual workspaceId
     */
    get workspaceId(): string | null {
        if (this.route.firstChild) {
            const workspaceId =
                this.route.firstChild.snapshot.paramMap.get('workspaceId');
            if (workspaceId) {
                // FIXME - Hay que remplazar este metodo de guardar el workspaceId por uno mas decente.
                this.workspaceService.workspaceId = workspaceId;
                return workspaceId;
            }
        }
        return null;
    }

    /**
     * Get the addActionService state - Visible or Not.
     */
    get isAddActionVisible(): boolean {
        return this.addActionService.isAddActionVisible;
    }

    /**
     * Get the addActionService state - Visible or Not.
     */
    get isVideoPlayerVisible(): boolean {
        return this.videoPlayerService.isVideoPlayerVisible;
    }

    /**
     * Get the addFeatureService state - Visible or Not.
     */
    get isAddFeatureVisible(): boolean {
        return this.addFeatureService.isAddFeatureVisible;
    }

    /**
     * Get the actual workspaceId
     */
    get code(): string | null {
        const code = this.route.snapshot.queryParamMap.get('code');
        if (code) {
            return code;
        }
        return null;
    }

    /**
     *
     * @param authService Service to handle auth conections.
     * @param userService Service to handle user collection in database.
     * @param workspaceService Service to handle user workspaces collection in database.
     * @param messageService A toast service provided by PrimeNG.
     */
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private workspaceService: WorkspaceService,
        private messageService: MessageService,
        private addActionService: AddActionService,
        private videoPlayerService: VideoPlayerService,
        private addFeatureService: AddFeatureService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    /**
     * ngOnInit - Load the dashboard if there is any workspace.
     */
    ngOnInit(): void {
        if (localStorage.getItem('lastWorkspace') && this.code) {
            this.router.navigate([
                '../workspaces',
                localStorage.getItem('lastWorkspace'),
                'integrations',
                'vimeo'
            ], {queryParams: { code: this.code }});
        }
        this.workspaceExistChecker = this.workspaces.subscribe(
            (workspaces) => {
                if (workspaces) {
                    this.workspaceExist = true;
                    this.webLoading = false;
                    workspaces.forEach((workspace, index) => {
                        if (workspace.ref.id == this.workspaceId) {
                            this.activeWorkspaceIndex = index;
                            this.activeWorkspace = true;
                        }
                    });
                } else {
                    this.webLoading = false;
                }
            },
            (err) => {
                console.warn(err);
                if (err == 'NOT FOUND!') {
                    this.webLoading = false;
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
     * @param workspaceIndex Workspace index.
     * @param e Click event handler.
     */
    workspaceClick(workspaceIndex: number, e: Event): void {
        e.preventDefault();
        if (this.activeWorkspaceIndex == workspaceIndex) {
            this.activeWorkspaceIndex = null;
            this.activeWorkspace = false;
            this.router.navigate(['/workspaces']);
        } else {
            if (this.activeWorkspace) {
                this.router.navigate(['/workspaces']);
            }
            this.activeWorkspaceIndex = workspaceIndex;
            this.activeWorkspace = true;
        }
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
     * @param workspaceName Workspace name.
     */
    addNewWorkspace(workspaceName: string): void {
        this.userService.getUserWorkspacesOnce().then((workspaces) => {
            console.log(workspaces);
            this.workspaceService.addNewWorkspace(
                { name: workspaceName, releases: [], tags: [], features: [] },
                { workspaces: workspaces }
            );
        });
    }

    /**
     * Create a new workspace in Database.
     * @param workspaceName Workspace name.
     */
    async createNewWorkspace(workspaceName: string) {
        const workspaceSucess = await this.workspaceService.createNewWorkspace({
            name: workspaceName,
            releases: [],
            tags: [],
            features: [],
        });
        if (workspaceSucess) {
            this.webLoading = false;
            this.workspaceExist = true;
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error creating the workspace, please try again.',
            });
        }
    }

    /**
     * Get the action object from add-action component.
     * @param data Action Object
     */
    getAction(data: Action): void {
        this.addActionIsVisible = false;
    }

    /**
     * Open the add-action component.
     */
    addAction(): void {
        this.addActionIsVisible = true;
    }

    /**
     * ngOnDestroy
     */
    ngOnDestroy(): void {
        this.workspaceExistChecker.unsubscribe();
    }
}
