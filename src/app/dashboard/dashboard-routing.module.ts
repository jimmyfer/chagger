import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsoleComponent } from './views/console/console.component';
import { FeaturesBoardComponent } from './views/features-board/features-board.component';
import { ReleasesBoardComponent } from './views/releases-board/releases-board.component';
import { TagsBoardComponent } from './views/tags-board/tags-board.component';

const routes: Routes = [
    {
        path: '',
        component: ConsoleComponent,
        children: [
            {
                path: ':workspaceId',
                children: [
                    {
                        path: 'releases',
                        component: ReleasesBoardComponent,
                        children: [
                            {
                                path: ':releaseId',
                                component: FeaturesBoardComponent
                            }
                        ]
                    },
                    {
                        path: 'tags',
                        component: TagsBoardComponent
                    }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
})

/**
 * Routing module for dashboard.
 */
export class DashboardRoutingModule { }