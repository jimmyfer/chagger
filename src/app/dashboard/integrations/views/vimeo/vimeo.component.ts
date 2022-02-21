import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { VimeoMe, VimeoToken } from 'src/app/models/vimeo';
import { VimeoService } from 'src/app/services/vimeo.service';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
    selector: 'app-vimeo',
    templateUrl: './vimeo.component.html',
    styleUrls: ['./vimeo.component.scss'],
    host: {
        class: 'flex-grow-1',
    },
})

/**
 * Vimeo integration component.
 */
export class VimeoComponent implements OnInit {
    /**
     * Get workspaceId from Workspace Service.
     */
    get workspaceId(): string | null {
        return this.workspaceService.workspaceId;
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
    vimeoAcessToken = '';

    vimeoMe: VimeoMe = {} as VimeoMe;
    pictureAvaible = false;

    httpHeadersGetToken = {
        headers: new HttpHeaders({
            Authorization: `basic ${btoa(
                '00bec6b266770961fcdf1d89bfcd5551aec4c7a5:36fTR7O0ZRe526k9nZrl5TsjWvsDLhK8nlvhncRx3hafCAZxZrCTox5IjVvsQ+MPTXSssNcDtPi4rqOf4w6WYCcA2Sr0dWffFuUX5jQc1YFskKmHJSOqsdBtpTQkzDos'
            )}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.vimeo.*+json;version=3.4',
        }),
    };

    httpHeaders = {
        headers: new HttpHeaders({
            Authorization: `bearer ${this.vimeoAcessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.vimeo.*+json;version=3.4',
        }),
    };

    httpBody = {
        grant_type: 'authorization_code',
        code: this.code,
        redirect_uri: 'http://localhost:4200/workspaces/',
    };

    httpVideoBody = {
        upload: 'post',
        size: 10000,
        redirect_uri: 'http://localhost:4200/workspaces/',
    };

    tokenExist = false;
    acessTokenURL = 'https://cors-anywhere.herokuapp.com/https://api.vimeo.com/oauth/access_token';
    vimeoApiAuthURL =
        'https://api.vimeo.com/oauth/authorize?response_type=code&client_id=00bec6b266770961fcdf1d89bfcd5551aec4c7a5&redirect_uri=http://localhost:4200/workspaces/&state=true&scope=upload';

    /**
     * Constructor
     */
    constructor(
        private workspaceService: WorkspaceService,
        private vimeoService: VimeoService,
        private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        if(localStorage.getItem('lastWorkspace')) {
            localStorage.removeItem('lastWorkspace');
        }
        if(this.workspaceId) {
            localStorage.setItem(
                'lastWorkspace',
                this.workspaceId
            );
        }
        if (this.code) {
            this.http
                .post<VimeoToken>(this.acessTokenURL, this.httpBody, this.httpHeadersGetToken)
                // FIXME - Unsuscribe.
                .subscribe((tokenData) => {
                    localStorage.setItem(
                        'vimeo-token',
                        tokenData.access_token
                    );
                    console.log(tokenData);
                    this.checkifTokenExist();
                    this.router.navigate([
                        '../workspaces',
                        this.workspaceId,
                        'integrations',
                        'vimeo',
                    ]);
                });
        }
        this.checkifTokenExist();
    }

    /**
     * Check if token exist.
     */
    checkifTokenExist() {
        const accessToken = localStorage.getItem('vimeo-token');
        if (accessToken) {
            this.vimeoAcessToken = accessToken;
            this.httpHeaders = {
                headers: new HttpHeaders({
                    Authorization: `bearer ${this.vimeoAcessToken}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.vimeo.*+json;version=3.4',
                }),
            };
            this.http.get<VimeoMe>('https://cors-anywhere.herokuapp.com/https://api.vimeo.com/me', this.httpHeaders ).pipe(first()).toPromise().then(data => {
                this.vimeoMe = data;
                this.pictureAvaible = true;
                console.log(data);
            });
            this.http.post<any>('https://api.vimeo.com/me/videos', this.httpVideoBody, this.httpHeaders ).pipe(first()).toPromise().then(data => {
                console.log(data);
            });
            this.tokenExist = true;
        }
    }
}
