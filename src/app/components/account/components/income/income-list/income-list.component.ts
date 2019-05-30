import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { HttpClientService, BaseDataService } from '../../../../../core/providers';
import { IncomeService } from '../../../services';

import * as _ from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.scss']
})
export class IncomeListComponent implements OnInit, OnDestroy, AfterViewInit {

  public date;

  constructor(
    public incomeService: IncomeService,
    public http: HttpClientService,
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.date = this.incomeService.incomeListDate;
  }


  edit(detail) {
    this.incomeService.income = detail;
    this.incomeService.edit(_.cloneDeep(detail));
  }

  ngAfterViewInit() {
    // this.cd.markForCheck();
    this.getListByDate(this.incomeService.incomeListDate);
  }

  ngOnDestroy() {
  }

  changeDate(data) {
    this.date = data.date;
    this.getListByDate(data.date);
  }

  getListByDate(incomeListDate) {
    this.incomeService.incomeListDate = incomeListDate;
    this.http.get('/DR/getIncomeList?incomeListDate=' + incomeListDate).then((data: any) => {
      this.incomeService.incomeList = [];
      if (data && data.length) {
        for (const item of data) {
          this.incomeService.changeIncome(item);
        }
        this.incomeService.totalMonthAmount = _.map(data, 'amount').reduce(
          (acc, cur) => acc + cur,
          0
        );
        this.incomeService.groupDetailList();
      }
    });
  }
}
