import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectronService } from './providers/electron.service';
import { HttpClientService } from './providers/http-client.service';
import { LogService } from './providers/log.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    ElectronService,
    HttpClientService,
    LogService
  ]
})
export class CoreModule { }
