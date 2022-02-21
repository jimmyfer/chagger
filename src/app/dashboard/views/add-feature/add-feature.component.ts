import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { GitHubRepo, GitHubRepoClosedIssues } from 'src/app/models/github';
import { FeaturesService } from 'src/app/services/features.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { AddFeatureService } from '../../services/add-feature.service';

@Component({
    selector: 'app-add-feature',
    templateUrl: './add-feature.component.html',
    styleUrls: ['./add-feature.component.scss'],
})

/**
 * Add feature modal component.
 */
export class AddFeatureComponent implements OnInit {
    issues: GitHubRepoClosedIssues[] = [];

    paginationindex = 0;

    tokenExist = false;

    /**
     * Get the actual workspaceId
     */
    get workspaceId(): string | null {
        if (this.route.firstChild) {
            const workspaceId =
                this.route.firstChild.snapshot.paramMap.get(
                    'workspaceId'
                );
            if (workspaceId) {
                return workspaceId;
            }
        }
        return null;
    }

    /**
     * Get the actual release.
     */
    get releaseId(): string | null {
        if (this.route.firstChild) {
            const releaseId =
                this.route.firstChild?.firstChild?.firstChild?.snapshot.paramMap.get(
                    'releaseId'
                );
            if (releaseId) {
                return releaseId;
            }
        }
        return null;
    }

    /**
     * Constructor
     */
    constructor(
        private addFeatureService: AddFeatureService,
        private workspaceService: WorkspaceService,
        private featureService: FeaturesService,
        private route: ActivatedRoute,
        private http: HttpClient
    ) {}

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.checkifTokenExist();
    }

    /**
     * Close modal.
     */
    closeModal(): void {
        this.addFeatureService.isAddFeatureVisible = false;
    }

    /**
     * Check if token exist.
     */
    checkifTokenExist(): void {
        const accessToken = localStorage.getItem('github-token');
        if (accessToken) {
            this.tokenExist = true;
            if (this.workspaceId) {
                this.workspaceService
                    .getWorkspace(this.workspaceId)
                    .pipe(first())
                    .toPromise()
                    .then((workspace) => {
                        this.http
                            .get<GitHubRepo>(
                                `https://api.github.com/repositories/${workspace.githubRepo}`,
                                {
                                    headers: {
                                        ['Authorization']: `token ${accessToken}`,
                                    },
                                    // FIXME Unsuscribe
                                }
                            )
                            .subscribe((data) => {
                                this.http
                                    .get<GitHubRepoClosedIssues[]>(
                                        `https://api.github.com/repos/${data.full_name}/issues?state=closed`,
                                        {
                                            headers: {
                                                ['Authorization']: `token ${accessToken}`,
                                            },
                                        }
                                    )
                                    .subscribe((issues) => {
                                        this.issues = issues;
                                    });
                            });
                    });
            }
        }
    }

    /**
     * Change paginator index.
     * @param paginatorData Paginator data.
     */
    paginate(paginatorData: {
        page: number;
        first: number;
        rows: number;
        pageCount: number;
    }) {
        this.paginationindex = paginatorData.page;
    }

    /**
     * Create new feature with the issue data.
     * @param title Issue title.
     * @param description Issue description.
     */
    createNewFeature(title: string ,description: string): void {
        if (this.workspaceId && this.releaseId) {
            this.featureService.addNewFeature(
                this.workspaceId,
                this.releaseId,
                this.featureService.release,
                {
                    tag: '',
                    description: `${title} - 
                    ${description}`,
                    emojiId: 'santa',
                    action: {
                        type: '',
                        link: '',
                        options: {
                            title: '',
                            autoplay: false,
                            muted: false,
                            startOn: {hour: 0, minute: 0, second: 0},
                        },
                    },
                }
            );
            this.addFeatureService.isAddFeatureVisible = false;
        }
    }
}
