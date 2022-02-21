import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntegrationsRoutingModule } from './integrations-routing.module';
import { MainComponent } from './views/main/main.component';
import { GithubComponent } from './views/github/github.component';
import { HttpClientModule } from '@angular/common/http';
import { VimeoComponent } from './views/vimeo/vimeo.component';

@NgModule({
    declarations: [MainComponent, GithubComponent, VimeoComponent],
    imports: [CommonModule, IntegrationsRoutingModule, HttpClientModule],
})
/**
 * Integration module.
 */
export class IntegrationsModule {}
