import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GithubComponent } from './views/github/github.component';
import { MainComponent } from './views/main/main.component';
import { VimeoComponent } from './views/vimeo/vimeo.component';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: 'github',
                component: GithubComponent
            },
            {
                path: 'vimeo',
                component: VimeoComponent
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

/**
 * Integrations routing.
 */
export class IntegrationsRoutingModule {}
