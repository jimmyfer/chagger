import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
/**
 * Guard to check if user is logged in.
 */
export class IsUnauthenticatedGuard implements CanActivate {

    /**
     * Constructor.
     * @param authService Auth service.
     * @param router Router.
     */
    constructor(
        private authService: AuthService,
        private router: Router,
    ) {
    }

    /**
     * If user is logged then redirect to the workspace board.
     * @param route Router.
     * @param state Auth state.
     * @returns Return a boolean that represent if the user is logged in or not.
     */
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
