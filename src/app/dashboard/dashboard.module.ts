import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicChangeloggComponent } from './views/public-changelogg/public-changelogg.component';
import { ConsoleComponent } from './views/console/console.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardRoutingModule } from './dashboard-routing.module';


@NgModule({
  declarations: [
    PublicChangeloggComponent,
    ConsoleComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
