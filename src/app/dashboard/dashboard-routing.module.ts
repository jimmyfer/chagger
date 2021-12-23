import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsoleComponent } from './views/console/console.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ConsoleComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild( routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
