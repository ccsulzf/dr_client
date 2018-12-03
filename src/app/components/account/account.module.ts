import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { ExpenseAddEditComponent } from './components/expense/expense-add-edit/expense-add-edit.component';
import { ExpenseListComponent } from './components/expense/expense-list/expense-list.component';
import { ExpenseDetailComponent } from './components/expense/expense-list/expense-detail/expense-detail.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    AccountRoutingModule
  ],
  declarations: [AccountComponent, ExpenseComponent, ExpenseAddEditComponent, ExpenseListComponent, ExpenseDetailComponent]
})
export class AccountModule { }
