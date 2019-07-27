import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './dashboard.component';

import { LoginService } from './services';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    DashboardRoutingModule
  ],
  providers: [
    LoginService
  ],
  declarations: [LoginComponent, DashboardComponent, HomeComponent]
})
export class DashboardModule { }
