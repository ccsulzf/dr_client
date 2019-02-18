import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';
import { ReportFilterComponent } from './components/common/report-filter/report-filter.component';
import { ExpenseDetailComponent } from './components/expense/expense-detail/expense-detail.component';
import { ReportEqualComponent } from './components/common/report-filter/report-equal/report-equal.component';

@NgModule({
  declarations: [ReportComponent, ReportFilterComponent, ExpenseDetailComponent, ReportEqualComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    FormsModule,
    CoreModule
  ]
})
export class ReportModule { }
