import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElectronService } from './providers/electron.service';
import { HttpClientService } from './providers/http-client.service';
import { LogService } from './providers/log.service';
import { SystemService } from './providers/system.service';
import { BaseDataService } from './providers/baseData.service';
import { NavComponent } from './components/nav/nav.component';

import { DynamicComponentDirective } from './directives/dynamic-component.directive';
import { AddressAddEditComponent } from './components/addreess/address-add-edit/address-add-edit.component';
import { ExpenseBookAddEditComponent } from './components/expenseBook/expense-book-add-edit/expense-book-add-edit.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [NavComponent, DynamicComponentDirective, AddressAddEditComponent, ExpenseBookAddEditComponent],
  exports: [
    NavComponent,
    DynamicComponentDirective
  ],
  providers: [
    ElectronService,
    HttpClientService,
    LogService,
    SystemService,
    BaseDataService
  ],
  entryComponents: [
    AddressAddEditComponent,
    ExpenseBookAddEditComponent
  ]
})
export class CoreModule { }
