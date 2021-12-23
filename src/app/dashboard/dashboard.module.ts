import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicChangeloggComponent } from './views/public-changelogg/public-changelogg.component';
import { ConsoleComponent } from './views/console/console.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';


@NgModule({
    declarations: [
        PublicChangeloggComponent,
        ConsoleComponent
    ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        DashboardRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule
    ]
})
export class DashboardModule { }