import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { VimeoAuthorize, VimeoMe, VimeoVideoList } from '../models/vimeo';

@Injectable({
    providedIn: 'root',
})


// https://api.vimeo.com/oauth/authorize?response_type=code&client_id=00bec6b266770961fcdf1d89bfcd5551aec4c7a5&redirect_uri=https://www.google.com/&state=true&scope=public

/**
 * Vimeo Service.
 */
export class VimeoService {

    vimeoAcessToken = '';

    acessTokenUrl =
        'https://cors-anywhere.herokuapp.com/https://api.vimeo.com/oauth/authorize/client';
    apiSearchVideoURL = 'https://cors-anywhere.herokuapp.com/https://api.vimeo.com/videos?query=';

    httpHeadersGetToken = {
        headers: new HttpHeaders({
            Authorization: `basic ${btoa(
                '00bec6b266770961fcdf1d89bfcd5551aec4c7a5:36fTR7O0ZRe526k9nZrl5TsjWvsDLhK8nlvhncRx3hafCAZxZrCTox5IjVvsQ+MPTXSssNcDtPi4rqOf4w6WYCcA2Sr0dWffFuUX5jQc1YFskKmHJSOqsdBtpTQkzDos'
            )}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.vimeo.*+json;version=3.4',
        }),
    };

    httpVideoBody = {
        upload: 'post',
        size: 10000,
        redirect_uri: 'http://localhost:4200/workspaces/',
    };

    uploadForm = '';

    httpHeaders = {
        headers: new HttpHeaders({
            Authorization: `bearer ${this.vimeoAcessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.vimeo.*+json;version=3.4',
        }),
    };
  
    /**
     * Constructor.
     */
    constructor(private http: HttpClient) {
        this.http
            .post<VimeoAuthorize>(
                this.acessTokenUrl,
                {
                    grant_type: 'client_credentials',
                    scope: 'public private create edit delete upload',
                },
                this.httpHeadersGetToken
            ).subscribe(data => {
                this.vimeoAcessToken = data.access_token;
            });
    }

    /**
     * Search a vimeo video.
     * @param query Query to search a vimeo video.
     */
    async searchVideo(query: string): Promise<VimeoVideoList> {
        this.httpHeaders.headers = new HttpHeaders({
            Authorization: `bearer ${this.vimeoAcessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.vimeo.*+json;version=3.4',
        });
        return await this.http.get<VimeoVideoList>(`${this.apiSearchVideoURL}${query}&per_page=10`, this.httpHeaders).pipe(first()).toPromise().then(data => {
            return data;
        });
    }

    /**
     * Check if user is loged in.
     */
    async checkIfUserIsLogIn(): Promise<boolean> {
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
            const userName = await this.http.get<VimeoMe>('https://cors-anywhere.herokuapp.com/https://api.vimeo.com/me', this.httpHeaders ).pipe(first()).toPromise().then(data => {
                return data.name;
            });

            if(userName.length > 0) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    /**
     * Get upload form.
     */
    async getUploadForm(): Promise<any> {
        const accessToken = localStorage.getItem('vimeo-token');
        if(accessToken) {
            this.vimeoAcessToken = accessToken;
            this.httpHeaders = {
                headers: new HttpHeaders({
                    Authorization: `bearer ${this.vimeoAcessToken}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.vimeo.*+json;version=3.4',
                }),
            };
            return await this.http.post<any>('https://api.vimeo.com/me/videos', this.httpVideoBody, this.httpHeaders ).pipe(first()).toPromise().then(data => {
                return data;
            });
        }

        return false;
    }
}
