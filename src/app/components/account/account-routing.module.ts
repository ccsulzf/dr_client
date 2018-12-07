import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpenseComponent } from './components';
import { AccountComponent } from './account.component';
import { ExpenseListComponent } from './components';
const routes: Routes = [
  {
    path: '', component: AccountComponent, children: [
      { path: '', redirectTo: 'expense', pathMatch: 'full' },
      {
        path: 'expense', component: ExpenseComponent,
        //  children: [
        //   { path: '', redirectTo: 'list', pathMatch: 'full' },
        //   { path: 'list', component: ExpenseListComponent },
        // ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
