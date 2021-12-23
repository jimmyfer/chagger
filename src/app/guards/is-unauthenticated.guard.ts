import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
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
            await this.router.navigate(['dashboard']);
            return false;
        }
        return true;
    }
  
}
