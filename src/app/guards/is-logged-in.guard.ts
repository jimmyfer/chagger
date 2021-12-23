import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {
    constructor(
    private authService: AuthService,
    private router: Router,
    ) {
    }

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
