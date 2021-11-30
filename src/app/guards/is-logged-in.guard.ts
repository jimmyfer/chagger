import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';  // FIXME: Unnecessary import of UrlTree
import { Observable } from 'rxjs';  // FIXME: Unnecessary import
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
    // FIXME: Remove all console.logs before pushing to master, main or develop.
    console.log('hello');
    const isLoggedIn = await this.authService.isLoggedIn();
    if (!isLoggedIn) {
      await this.router.navigate(['auth/login']);
      return false;
    }

    return true;
  }

}
