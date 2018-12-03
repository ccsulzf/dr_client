import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpenseComponent } from './components';
import { AccountComponent } from './account.component';
const routes: Routes = [
  {
    path: '', component: AccountComponent, children: [
      { path: '', component: ExpenseComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
