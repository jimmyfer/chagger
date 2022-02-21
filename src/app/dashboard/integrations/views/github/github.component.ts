import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { GitHubRepoList, GitHubToken, GitHubUser } from 'src/app/models/github';
import { Observable } from 'rxjs';
import { Workspace } from 'src/app/models/workspace.interface';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-github',
    templateUrl: './github.component.html',
    styleUrls: ['./github.component.scss'],
    host: {
        class: 'flex-grow-1',
    },
})

/**
 * Github integration component.
 */
export class GithubComponent implements OnInit {

    workspace$: Observable<Workspace> = {} as Observable<Workspace>

    tokenExist = false;

    activeRepoId: number | null = null;

    userName = '';
    userProfileURL = '';

    githubUserRepos: GitHubRepoList[] = [];

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
     * Get workspaceId from Workspace Service.
     */
    get workspaceId(): string | null {
        return this.workspaceService.workspaceId;
    }

    acessTokenURL =
        'https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token';

    githubApiAuthURL = `https://github.com/login/oauth/authorize?client_id=e0e111549db56f6609e4&redirect_uri=http://localhost:4200/workspaces/${this.workspaceId}/integrations/github&scope=repo`;

    httpHeaders = new HttpHeaders({
        Accept: 'application/json',
    });

    httpBody = {
        client_id: 'e0e111549db56f6609e4',
        client_secret: '93e4d34e76f75e6f71a3979718966980781733a2',
        redirect_uri: `http://localhost:4200/workspaces/${this.workspaceId}/integrations/github`,
        code: this.code,
    };

    /**
     * Constructor
     */
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private workspaceService: WorkspaceService
    ) {}

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        if(this.workspaceId) {
            this.workspace$ = this.workspaceService.getWorkspace(this.workspaceId);
        }
        this.workspace$.subscribe(workspace => {
            if(workspace.githubRepo) {
                this.activeRepoId = workspace.githubRepo;
            }
        });
        if (this.code) {
            this.http
                .post<GitHubToken>(this.acessTokenURL, this.httpBody, {
                    headers: this.httpHeaders,
                })
                // FIXME - Unsuscribe.
                .subscribe((tokenData) => {
                    localStorage.setItem('github-token', tokenData.access_token);
                    console.log(tokenData);
                    this.checkifTokenExist();
                    this.router.navigate([
                        '../workspaces',
                        this.workspaceId,
                        'integrations',
                        'github',
                    ]);
                });
        }
        this.checkifTokenExist();
    }

    /**
     * Check if token exist.
     */
    checkifTokenExist() {
        const accessToken = localStorage.getItem('github-token');
        if (accessToken) {
            this.http
                .get<GitHubUser>('https://api.github.com/user', {
                    headers: {
                        ['Authorization']: `token ${accessToken}`,
                    },
                })
                // FIXME - Unsuscribe.
                .subscribe((user) => {
                    this.userName = user.login;
                    this.userProfileURL = user.avatar_url;
                });
            this.http
                .get<GitHubRepoList[]>('https://api.github.com/user/repos', {
                    headers: {
                        ['Authorization']: `token ${accessToken}`,
                    },
                })
                // FIXME - Unsuscribe. Get the best way to unsuscribe from this you mothedafaca
                .subscribe((repos) => {
                    console.log(repos);
                    this.githubUserRepos = repos;
                });
            this.tokenExist = true;
        }
    }

    /**
     * Update the actual repo vinculated with the actual workspace.
     * @param repoId Repository ID.
     */
    updateRepoLink(repoId: number): void {
        if(this.workspaceId) {
            this.workspaceService.updateRepo(repoId, this.workspaceId);
        }
    }
}
