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
  public date;
  constructor(
    public accountService: AccountService,
    public http: HttpClientService,
    public baseDataService: BaseDataService,
    public expenseService: ExpenseService,
    public cd: ChangeDetectorRef,
    public system: SystemService
  ) {
  }

  ngAfterViewChecked() {
    // this.cd.detectChanges();
  }

  ngOnInit() {
    this.date = this.expenseService.expneseListDate;
  }

  ngAfterViewInit() {
    this.getListByDate(this.expenseService.expneseListDate);
  }

  ngOnDestroy() {

  }

  changeDate(data) {
    this.date = data.date;
    this.getListByDate(data.date);
  }


  getListByDate(expenseDate) {
    this.expenseService.expneseListDate = expenseDate;
    this.http.get('/DR/Expense?expenseDate=' + moment(expenseDate).format('YYYY-MM-DD')).then((data: any) => {
      this.expenseService.expenseList = [];
      if (data && data.length) {
        for (const item of data) {
          const expenseBook = this.baseDataService.getExpenseBook(item.expenseBookId);
          item.expenseBookName = expenseBook.name;
          this.expenseService.expenseList.push(item);
        }
        // 这里有问题的
        this.expenseService.totalDayAmount = _.map(data, 'totalAmount').reduce(
          (acc, cur) => (100 * acc + 100 * cur) / 100,
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
