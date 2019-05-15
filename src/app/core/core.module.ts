import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ElectronService } from './providers/electron.service';
import { HttpClientService } from './providers/http-client.service';
import { LogService } from './providers/log.service';
import { SystemService } from './providers/system.service';
import { BaseDataService } from './providers/baseData.service';
import { NotifyService } from './providers/notify.service';

import { NavComponent } from './components/nav/nav.component';

import { DynamicComponentDirective } from './directives/dynamic-component.directive';

import { BlankClickDirective } from './directives/blankClick.directive';

import { AddressAddEditComponent } from './components/addreess/address-add-edit/address-add-edit.component';
import { ExpenseBookAddEditComponent } from './components/expenseBook/expense-book-add-edit/expense-book-add-edit.component';
import { ExpenseCategoryAddEditComponent } from './components/expense-category/expenseCategory-add-edit/expenseCategory-add-edit.component';
import { FundPartyAddEditComponent } from './components/fund-party/fund-party-add-edit/fund-party-add-edit.component';
import { FilterPipe, FilterListPipe, FilterNamePipe } from './pipes';
// import { FundWayAddEditComponent } from './components/fund-way/fund-way-add-edit/fund-way-add-edit.component';
import { FundAccountAddEditComponent } from './components/fundAccount/fund-account-add-edit/fund-account-add-edit.component';
import { ParticipantAddEditComponent } from './components/participant/participant-add-edit/participant-add-edit.component';
import { AddressSelectComponent } from './components/addreess/address-select/address-select.component';
import { IncomeCategorySelectComponent } from './components/income-category/incomeCategory-select/incomeCategory-select.component';
import { ParticipantSelectComponent } from './components/participant/participant-select/participant-select.component';
import { LabelSelectComponent } from './components/label/label-select/label-select.component';
import { FundAccountSelectComponent } from './components/fundAccount/fund-account-select/fund-account-select.component';
import { IncomeCategoryAddEditComponent } from './components/income-category/income-category-add-edit/income-category-add-edit.component';
import { FundPartySelectComponent } from './components/fund-party/fund-party-select/fund-party-select.component';
// import { FundwaySelectComponent } from './components/fund-way/fundway-select/fundway-select.component';
import { ExpenseCategorySelectComponent } from './components/expense-category/expense-category-select/expense-category-select.component';

import { FundChannelAddEditComponent, FundChannelSelectComponent } from './components/fund-channel';

import { WebviewDirective } from './directives';
import { ExpenseBookListComponent } from './components/expenseBook/expense-book-list/expense-book-list.component';
import { DrDateComponent } from './components/dr-date/dr-date.component';
import { MemoComponent } from './components/memo/memo.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [NavComponent, DynamicComponentDirective, WebviewDirective, BlankClickDirective,
    AddressAddEditComponent, ExpenseBookAddEditComponent,
    ExpenseCategoryAddEditComponent, FundPartyAddEditComponent,
    FilterPipe, FilterListPipe, FilterNamePipe,
    FundAccountAddEditComponent, ParticipantAddEditComponent,
    AddressSelectComponent, IncomeCategorySelectComponent,
    ParticipantSelectComponent, LabelSelectComponent,
    FundAccountSelectComponent, IncomeCategoryAddEditComponent,
    FundPartySelectComponent,
    ExpenseCategorySelectComponent,
    FundChannelAddEditComponent,
    FundChannelSelectComponent, ExpenseBookListComponent, DrDateComponent, MemoComponent
  ],
  exports: [
    NavComponent,
    AddressSelectComponent,
    IncomeCategorySelectComponent,
    ParticipantSelectComponent,
    LabelSelectComponent,
    FundPartySelectComponent,
    // FundwaySelectComponent,
    FundAccountSelectComponent,
    ExpenseCategorySelectComponent,
    FundChannelSelectComponent,
    DynamicComponentDirective,
    WebviewDirective,
    BlankClickDirective,
    FilterPipe,
    FilterListPipe,
    FilterNamePipe,
    ExpenseBookListComponent,
    DrDateComponent,
    MemoComponent
  ],
  providers: [
    ElectronService,
    HttpClientService,
    LogService,
    SystemService,
    BaseDataService,
    NotifyService
  ],
  entryComponents: [
    AddressAddEditComponent,
    ExpenseBookAddEditComponent,
    ExpenseCategoryAddEditComponent,
    FundPartyAddEditComponent,
    // FundWayAddEditComponent,
    FundAccountAddEditComponent,
    ParticipantAddEditComponent,
    IncomeCategoryAddEditComponent,
    FundChannelAddEditComponent
  ]
})
export class CoreModule { }
