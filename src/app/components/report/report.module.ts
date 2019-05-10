import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { AgGridModule } from 'ag-grid-angular';

import { ReportRoutingModule } from './report-routing.module';


import { ReportComponent } from './report.component';
import { ReportFilterComponent } from './components/common/report-filter/report-filter.component';
import { ExpenseDetailComponent } from './components/expense/expense-detail/expense-detail.component';

import { ReportService, ExpenseDetailService } from './services';
import { FilterEqualComponent } from './components/common/report-filter/filter-equal/filter-equal.component';
import { FilterRangeComponent } from './components/common/report-filter/filter-range/filter-range.component';
import { FilterContainComponent } from './components/common/report-filter/filter-contain/filter-contain.component';
@NgModule({
  declarations: [ReportComponent,
    ReportFilterComponent,
    ExpenseDetailComponent, FilterEqualComponent, FilterRangeComponent, FilterContainComponent],
  providers: [
    ReportService,
    ExpenseDetailService
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    FormsModule,
    CoreModule,
    AgGridModule.withComponents([])
  ]
})
export class ReportModule { }
