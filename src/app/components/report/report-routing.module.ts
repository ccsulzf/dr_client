import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './report.component';
import { ExpenseDetailComponent } from './components';
import { AuthGuard } from '../../auth.guard';
const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'expense-detail', component: ExpenseDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
