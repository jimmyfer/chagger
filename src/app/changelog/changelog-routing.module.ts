import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangelogComponent } from './views/changelog/changelog.component';
import { ReleaseChangelogComponent } from './views/release-changelog/release-changelog.component';

const routes: Routes = [
    {
        path: ':workspaceId',
        component: ChangelogComponent,
        children: [
            {
                path: 'changelog/:releaseId',
                component: ReleaseChangelogComponent
                
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
})

/**
 * Routing module for Changelog.
 */
export class ChangeLogRoutingModule { }