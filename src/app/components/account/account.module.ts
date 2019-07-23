import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { ExpenseAddEditComponent } from './components/expense/expense-add-edit/expense-add-edit.component';
import { ExpenseListComponent } from './components/expense/expense-list/expense-list.component';
import { ExpenseDetailComponent } from './components/expense/expense-list/expense-detail/expense-detail.component';
import { AccountService, ExpenseService, IncomeService, TransferService } from './services';
import { IncomeComponent } from './components/income/income.component';
import { IncomeListComponent } from './components/income/income-list/income-list.component';
import { IncomeAddEditComponent } from './components/income/income-add-edit/income-add-edit.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { TransferAddEditComponent } from './components/transfer/transfer-add-edit/transfer-add-edit.component';
import { TransferListComponent } from './components/transfer/transfer-list/transfer-list.component';
import { RepayComponent } from './components/repay/repay.component';
@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    AccountRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AccountComponent, ExpenseComponent,
    ExpenseAddEditComponent, ExpenseListComponent,
    ExpenseDetailComponent, IncomeComponent,
    IncomeListComponent, IncomeAddEditComponent, TransferComponent, TransferAddEditComponent, TransferListComponent, RepayComponent
  ],
  entryComponents: [
    ExpenseListComponent,
    ExpenseDetailComponent,
    IncomeListComponent,
    TransferListComponent
  ],
  providers: [
    AccountService,
    ExpenseService,
    IncomeService,
    TransferService
  ]
})
export class AccountModule { }
