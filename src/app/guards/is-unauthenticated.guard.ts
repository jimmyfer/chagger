import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
// TODO: Small documentation to explaining what this guard is doing
export class IsUnauthenticatedGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
    ) {
    }

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        const isLoggedIn = await this.authService.isLoggedIn();
        if (isLoggedIn) {
            await this.router.navigate(['workspaces']);
            return false;
        }
        return true;
    }

}
