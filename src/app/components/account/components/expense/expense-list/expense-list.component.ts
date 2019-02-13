import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { HttpClientService, BaseDataService, SystemService } from '../../../../../core/providers';
import { AccountService, ExpenseService } from '../../../services';
import * as moment from 'moment';
import * as _ from 'lodash';
@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements AfterViewInit, OnInit, OnDestroy, AfterViewChecked {

  public changeDateEvent;

  public showDate;

  public isShowCal = false;

  public selectDate;
  constructor(
    private accountService: AccountService,
    private http: HttpClientService,
    private baseDataService: BaseDataService,
    private expenseService: ExpenseService,
    private cd: ChangeDetectorRef,
    private system: SystemService
  ) {
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.getListByDate(this.expenseService.expneseListDate);
  }

  ngOnDestroy() {
    if (this.changeDateEvent) {
      this.changeDateEvent.unsubscribe();
    }
  }

  changeDate(data) {
    this.isShowCal = !this.isShowCal;
    this.getListByDate(data);
  }

  getCal() {
    this.isShowCal = !this.isShowCal;
  }

  dateShow(expenseDate) {
    switch (moment().diff(moment(expenseDate), 'days')) {
      case 0:
        this.showDate = '今日支出';
        break;
      case 1:
        this.showDate = '昨日支出';
        break;
      default:
        this.showDate = expenseDate;
        break;
    }
  }

  getListByDate(expenseDate) {
    this.dateShow(expenseDate);
    this.expenseService.expneseListDate = expenseDate;
    this.http.get('/DR/Expense?expenseDate=' + expenseDate).then((data: any) => {
      this.expenseService.expenseList = [];
      if (data && data.length) {
        for (const item of data) {
          const expenseBook = this.baseDataService.getExpenseBook(item.expenseBookId);
          item.expenseBookName = expenseBook.name;
          this.expenseService.expenseList.push(item);
        }
        this.expenseService.totalDayAmount = _.map(data, 'totalAmount').reduce(
          (acc, cur) => acc + cur,
          0
        );
      }
    });
  }

  toDetailList() {
    this.system.changeComponent({ component: 'expense-detail' });
  }

  goDetail(item) {
    this.system.changeComponent({ component: 'expense-detail', data: item });
  }

}
