import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectronService } from './providers/electron.service';
import { HttpClientService } from './providers/http-client.service';
import { LogService } from './providers/log.service';
import { SystemService } from './providers/system.service';
import { NavComponent } from './components/nav/nav.component';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NavComponent],
  exports: [
    NavComponent
  ],
  providers: [
    ElectronService,
    HttpClientService,
    LogService,
    SystemService
  ]
})
export class CoreModule { }
