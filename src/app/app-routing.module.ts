import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsLoggedInGuard } from './guards/is-logged-in.guard';
import { IsUnauthenticatedGuard } from './guards/is-unauthenticated.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ),
        canActivate: [ IsUnauthenticatedGuard ]
    },
    {
        path: 'workspaces',
        loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardModule),
        canActivate: [ IsLoggedInGuard ]
    },
    {
        path: 'public',
        loadChildren: () => import('./changelog/changelog.module').then( m => m.ChangelogModule)
    },
    {
        path: '**',
        redirectTo: 'auth'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot( routes, { paramsInheritanceStrategy: 'always' } )
    ],
    exports: [
        RouterModule
    ]
})

/**
 * Routing module for App.
 */
export class AppRoutingModule { }
