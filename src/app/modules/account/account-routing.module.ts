import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpenseComponent } from './components';
import { AccountComponent } from './account.component';
import { IncomeComponent } from './components/income';
import { TransferComponent } from './components/transfer';
import { RepayComponent } from './components/repay';
import { AuthGuard } from '../../auth.guard';
const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'expense', pathMatch: 'full' },
      { path: 'expense', component: ExpenseComponent },
      { path: 'income', component: IncomeComponent },
      { path: 'transfer', component: TransferComponent },
      { path: 'repay', component: RepayComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
