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
import { ExpenseCategoryAddEditComponent } from './components/expense-category/expenseCategory-add-edit/expenseCategory-add-edit.component';
import { FundPartyAddEditComponent } from './components/fund-party/fund-party-add-edit/fund-party-add-edit.component';
import { FilterPipe } from './pipes';
import { FundWayAddEditComponent } from './components/fund-way/fund-way-add-edit/fund-way-add-edit.component';
import { FundAccountAddEditComponent } from './components/fundAccount/fund-account-add-edit/fund-account-add-edit.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [NavComponent, DynamicComponentDirective,
    AddressAddEditComponent, ExpenseBookAddEditComponent,
    ExpenseCategoryAddEditComponent, FundPartyAddEditComponent,
    FilterPipe, FundWayAddEditComponent, FundAccountAddEditComponent],
  exports: [
    NavComponent,
    DynamicComponentDirective,
    FilterPipe
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
    ExpenseBookAddEditComponent,
    ExpenseCategoryAddEditComponent,
    FundPartyAddEditComponent,
    FundWayAddEditComponent,
    FundAccountAddEditComponent
  ]
})
export class CoreModule { }
