import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './dashboard.component';

import { LoginService } from './services';

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
  declarations: [LoginComponent, DashboardComponent]
})
export class DashboardModule { }
