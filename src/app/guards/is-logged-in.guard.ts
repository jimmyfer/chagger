import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})


/**
 * Guard to check if user is logged in.
 */
export class IsLoggedInGuard implements CanActivate {

    /**
     * 
     * @param authService Auth service.
     * @param router Router.
     */
    constructor(
    private authService: AuthService,
    private router: Router,
    ) {
    }

    /**
     * If user is not logged in return to login page.
     * @param route Route.
     * @param state Auth state.
     * @returns Boleean if user is logged or not.
     */
    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean> {
        const isLoggedIn = await this.authService.isLoggedIn();
        if (!isLoggedIn) {
            await this.router.navigate(['auth/login']);
            return false;
        }

        return true;
    }

}
