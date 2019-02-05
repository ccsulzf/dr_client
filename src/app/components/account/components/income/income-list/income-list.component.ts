import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { HttpClientService, BaseDataService } from '../../../../../core/providers';
import { IncomeService } from '../../../services';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.scss']
})
export class IncomeListComponent implements OnInit {
  public showDate;

  public isShowCal = false;

  public selectDate;
  constructor(
    private incomeService: IncomeService,
    private http: HttpClientService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  getCal() {
    this.isShowCal = !this.isShowCal;
  }

  edit(detail) {
    this.incomeService.edit(detail);
  }

  ngAfterViewInit() {
    this.getListByDate(this.incomeService.incomeListDate);
    this.cd.detectChanges();
  }

  changeDate(data) {
    this.isShowCal = !this.isShowCal;
    this.getListByDate(data);
  }

  dateShow(date) {
    console.info(moment().diff(moment(date), 'months'));
    switch (moment().diff(moment(date), 'months')) {
      case 0:
        this.showDate = '本月收入';
        break;
      case 1:
        this.showDate = '上月收入';
        break;
      default:
        this.showDate = date;
        break;
    }
  }

  getListByDate(incomeListDate) {
    this.dateShow(incomeListDate);
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
